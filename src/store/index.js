import { createStore } from 'vuex'

// 创建一个新的 store 实例
const store = createStore({
  state() {
    return {
      loginState: localStorage.getItem('TOKEN') ? true : false, // 登录状态
      user: {}, // 登录用户
      userList: [], // 用户列表
      onlineNum: 0,
      msgList: [], // 用户历史记录
      userCardState: false, // 用户卡片状态
      userCardValue: {}, // 用户卡片内容
      bigPicShow: false, // 大图显示状态
    }
  },
  mutations: {
    updateLoginState(state, newState) {
      state.loginState = newState
    },
    updateUser(state, user) {
      state.user = user
    },
    updateUserList(state, userList) {
      state.userList = userList
    },
    msgListAdd(state, element) {
      state.msgList.push(element)
    },
    msgListInsert(state, array) {
      state.msgList.unshift(...array)
    },
    updateOnlineUser(state, array) {
      // 保存在线人数
      state.onlineNum = array.length
      // 更新用户在线状态
      array.forEach(id => {
        const userToUpdate = state.userList.find(user => user.id === id);
        if (userToUpdate) {
          userToUpdate.online = 1;
        }
      });
      // 使用 sort 方法将 online 等于 1 的元素放在最前面
      state.userList.sort((a, b) => {
        if (a.online === 1 && b.online !== 1) {
          return -1;
        } else if (a.online !== 1 && b.online === 1) {
          return 1;
        }
        return 0;
      });
    },
    updateuserCardValue(state, value) {
      state.userCardValue = value
    },
    updateuserCardState(state, newState) {
      state.userCardState = newState
    },
    updateBigPicShow(state, newState) {
      state.bigPicShow = newState
    }
  }
})

export default store