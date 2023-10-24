import Message from './Message.vue';
import { render, createVNode } from "vue";

// 装载提示消息组件的DOM容器
const div = document.createElement('div')
document.body.appendChild(div)

// 定时器标识
let timer = null
let typeList = ['success', 'error', 'warning', 'info']
export default (content = '', type = 'info',  duration = 3000) => {
  if (typeList.includes(type)) {
    // 将消息提示组件编译为虚拟节点(DOM节点)
    // createVNode(组件, 属性对象(props))
    const vnode = createVNode(Message, { type, content, duration })
    // 将虚拟节点渲染到DOM容器中
    // render(虚拟节点，DOM容器)
    render(vnode, div)
    // 3s后销毁
    clearTimeout(timer)
    timer = setTimeout(() => {
      render(null, div)
    }, duration)
  } else {
    throw "Your message type is not supported, please select 'success', 'error', 'warning', 'info'"
  }
}
