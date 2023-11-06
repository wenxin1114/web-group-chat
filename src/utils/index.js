import axios from '../http'
import store from '../store'
import Message from '../components/Message/index'
let heartbeatTimer;
let ws
const heartbeatMsg = '{"data":"?","type":0}';
const heartbeatInterval = 30000; // 30秒
let reconnectTimer = null;
const MAX_RECONNECT_TIME = 60 * 1000; // 最长重连时间 60s 

const handleReconnect = () => {
    if (!reconnectTimer) {
        let waitTime = 5000; // 初始等待时间为 5s
        reconnectTimer = setInterval(() => {
            console.log(`正在尝试重连，等待时间：${waitTime}ms`);
            wsInit(); // 尝试重新连接服务器
            waitTime = Math.min(waitTime * 2, MAX_RECONNECT_TIME); // 等待时间指数增长
        }, waitTime);
    }
};

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
    ws = new WebSocket(`wss://${location.host}/ws/${localStorage.getItem('TOKEN')}`)

    // 连接成功后的回调函数
    ws.onopen = () => {
        console.log('客户端连接成功')
        clearInterval(reconnectTimer); // Cancel reconnection attempts
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
            store.commit('scrollContainerToBottom')
        } else if (result.type === 2) {
            // 在线人数更新
            store.commit('updateOnlineUser', result.data)
        } else if (result.type === 3) {
            // 用户未登录或token已过期, 更改登录状态
            localStorage.removeItem('TOKEN')
            store.commit('updateLoginState', false)
        } else if (result.type === 4) {
            // 用户有更新用户操作
            console.log("用户更新")
            store.commit('updateUserList', result.data)
        }
    };
    // 连接关闭后的回调函数
    ws.onclose = (evt) => {
        console.log("关闭客户端连接");
        clearInterval(heartbeatTimer); // 清除心跳定时器
        handleReconnect(); // Start reconnection attempts
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
        const { code, data } = resp.data
        if (code === 200) {
            store.commit('updateUser', data)
        }
    }).catch(error => {
        Message('用户信息接口异常', 'error')
    })
}

export const getUserList = (ids) => {
    axios.post("/user/list", ids).then(resp => {
        const { code, message, data } = resp.data
        if (code === 200) {
            store.commit('saveUserList', data)
        } else {
            Message(message, 'warning')
        }
    }).catch(error => {
        Message('用户列表接口异常', 'error')
    })
}
// 获取消息记录
export const getMsgRecord = async () => {
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
    console.log("获取历史消息")
    try {
        const resp = await axios.post("/chat/msg/record", form)
        if (resp.data.code === 200) {
            store.commit('msgListInsert', resp.data.data)
        }
    } catch (error) {
        console.error(error)
        Message('消息记录接口异常', 'error')
    }
}

// 上传图片
export const uploadFile = async (formData) => {
    let result
    if (formData) {
        await axios.post('/file/upload', formData).then(resp => {
            const { code, message, data } = resp.data
            if (code === 200) {
                result = data
            } else {
                Message(message, 'warning')
            }
        }).catch(error => {
            Message('文件上传接口异常', 'error')
        })
    }
    return result
}



