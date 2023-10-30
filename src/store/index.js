import { createStore } from 'vuex'

// 创建一个新的 store 实例
const store = createStore({
  state () {
    return {
      loginState: localStorage.getItem('TOKEN') ? true : false,
      user: {},
      userList: [],
      onlineUser: [],
      msgList: [],
      userCardState: false,
      userCardValue: {}
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
    }
  }
})

export default store