import { createStore } from 'vuex'
import {nextTick} from 'vue'

// 创建一个新的 store 实例
const store = createStore({
  state() {
    return {
      loginState: localStorage.getItem('TOKEN') ? true : false, // 登录状态
      user: {}, // 登录用户
      userList: [], // 用户列表
      onlineNum: 0,
      msgList: [], // 用户历史记录
      scrollContainer: null
    }
  },
  mutations: {
    updateLoginState(state, newState) {
      state.loginState = newState
    },
    updateUser(state, user) {
      state.user = user
    },
    saveUserList(state, userList) {
      state.userList = userList
    },
    updateUserList(state, updateDate) {
      state.userList.forEach(user => {
        if (user.id === updateDate.id) {
          user = Object.assign(user, updateDate)
        }
      })
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
      console.log("更新用户在线状态")
      state.userList.forEach(user => {
        if (array.includes(user.id)) {
          user.online = 1
        } else {
          user.online = 0
        }
      })
    },
    saveScrollContainer(state, scrollContainer) {
      state.scrollContainer = scrollContainer
    },
    scrollContainerToBottom(state) {
      nextTick(() => {
        console.log("滚动条拉到最下面")
        state.scrollContainer.scrollTop = state.scrollContainer.scrollHeight
      })
    }
  }
})


export default store