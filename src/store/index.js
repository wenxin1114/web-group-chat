import { createStore } from 'vuex'

// 创建一个新的 store 实例
const store = createStore({
  state () {
    return {
      loginState: localStorage.getItem('TOKEN') ? true : false, // 登录状态
      user: {}, // 登录用户
      userList: [], // 用户列表
      onlineUser: [], // 在线人员
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
    updateIsMdUp(state) {
      state.isMdUp = document.body.clientWidth > 768 
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
      state.onlineUser = array
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