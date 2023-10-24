import { createStore } from 'vuex'

// 创建一个新的 store 实例
const store = createStore({
  state () {
    return {
      loginState: localStorage.getItem('TOKEN') ? true : false,
      user: {},
      userList: [],
      msgList: [],
      isMdUp: document.body.clientWidth > 768
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
    updateUserInfoList(state, userList) {
      state.userList = userList
    },
    msgListAdd(state, element) {
      state.msgList.push(element)
    },
    msgListInsert(state, list) {
      state.msgList.unshift(...list)
    }
  }
})

export default store