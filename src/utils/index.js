import axios from '../http'
import store from '../store'
import Message from '../components/Message/index'

let heartbeatTimer;
let ws
const heartbeatMsg = '{"data":"?","type":0}';
const heartbeatInterval = 30000; // 30秒
let reconnectTimer = null;
const MAX_RECONNECT_TIME = 60 * 1000; // 最长重连时间 60s 

const handleHeartbeat = () => {
    clearInterval(heartbeatTimer); // 清除旧的心跳定时器
    heartbeat(); // 重新启动心跳定时器
};
const heartbeat = () => {
    heartbeatTimer = setInterval(function () {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(heartbeatMsg);
        }
    }, heartbeatInterval);
}

export const wsInit = () => {
    // WebSocket构造函数，创建WebSocket对象
    ws = new WebSocket(`ws://localhost:8080/ws/${localStorage.getItem('TOKEN')}`)
    // 连接成功后的回调函数
    ws.onopen = () => {
        console.log('客户端连接成功')
        clearInterval(reconnectTimer);
        handleHeartbeat(); // 处理心跳消息
        console.log("启动心跳定时器")
    };
    // 从服务器接受到信息时的回调函数
    ws.onmessage = (e) => {
        const result = JSON.parse(e.data)
        if (result.type === 0) {
            // 收到心跳回复，重置心跳定时器
            handleHeartbeat(); // 处理心跳消息
        } else if (result.type === 1) {
            // 聊天数据
            store.commit('msgListAdd', result.data)
        } else if (result.type === 2) {
            // 更新数据
        } else if (result.type === 3) {
            // 用户数据
            localStorage.setItem("USER_INFO", JSON.stringify(result.data))
        }

        // console.log('收到服务器响应', result)

    };
    // 连接关闭后的回调函数
    ws.onclose = (evt) => {
        console.log("关闭客户端连接");
        clearInterval(heartbeatTimer); // 清除心跳定时器
        // 在 MAX_RECONNECT_TIME 时间内进行重连
        let waitTime = 5000; // 初始等待时间为 5s
        reconnectTimer = setInterval(() => {
            console.log(`正在尝试重连，等待时间：${waitTime}ms`);
            wsInit(); // 尝试重新连接服务器
            waitTime = Math.min(waitTime * 2, MAX_RECONNECT_TIME); // 等待时间指数增长
        }, waitTime);
    };
    // 连接失败后的回调函数
    ws.onerror = (evt) => {
        Message("WebSocket 连接失败了", 'error')
    };
    // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，这样服务端会抛异常。
    window.onbeforeunload = function () {
        console.log("窗口要刷新了，主动关闭websocket连接")
        ws.close();
    }
}

export const getUserInfo = () => {
    axios.get("/user/info").then(resp => {
        const { code, message, data } = resp.data
        if (code === 200) {
            store.commit('updateUser', data)
        }
    })
}

export const getUserInfoList = (ids) => {
    axios.post("/user/info/list", ids).then(resp => {
        const { code, message, data } = resp.data
        if (code === 200) {
            store.commit('updateUserInfoList', data)
        }
    })
}

export const getMsgRecord = (currentId) => {
    let form = {
        pageSize: 20
    }
    if (store.state.msgList.length > 0) {
        // 有消息，获取第一条消息的id
        if (store.state.msgList[0].id === 1) {
            // 到顶了
            Message("没有更多消息了", 'warning')
            return;
        }
        form.currentId = store.state.msgList[0].id
    }
    axios.post("/chat/msg/record", form).then(resp => {
        const { code, message, data } = resp.data
        if (code === 200) {
            store.commit('msgListInsert', data)
        }
    })
}

