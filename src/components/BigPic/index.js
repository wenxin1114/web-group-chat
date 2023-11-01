import BigPic from './BigPic.vue';
import { render, createVNode } from "vue";

const div = document.createElement('div')
document.body.appendChild(div)

const closeBigPic = () => {
    render(null, div)
} 

export default (picUrl) => {
    const vnode = createVNode(BigPic, { picUrl, closeBigPic })
    render(vnode, div)
}
