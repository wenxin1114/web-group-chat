<script setup>
import { ref, reactive, computed } from 'vue'
import { getUserInfo, getUserList } from '../../utils/index';
import axios from '../../http/index'
import Message from '../Message/index';
import { useStore } from 'vuex';
const store = useStore()
const editState = ref(false)
const uploadFile = ref(null)
const form = reactive({
    "nickname": null,
    "avatar": null
})
const imgError = (event) => {
    event.target.src = new URL('../../assets/default_user.jpg', import.meta.url).href
}

const isMyself = computed(() => {
    return store.state.userCardValue.id === store.state.user.id
})

const userCardValue = computed(() => {
    return store.state.userCardValue
})

const user = computed(() => {
    return store.state.user
})

const closeCard = () => {
    store.commit('updateuserCardState', false)
}
const updateNickname = () => {
    if (form.nickname === user.nickname) {
        Message('新昵称与原昵称一致', 'warning')
    }
    if (form.nickname) {
        if (form.nickname.length > 8) {
            Message('昵称长度不能大于8', 'warning')
            return;
        }
        axios.post('/user/update', { 'nickname': form.nickname }).then(resp => {
            const { code, message } = resp.data
            if (code === 200) {
                Message(message, 'success')
                getUserInfo()
                getUserList()
                editState.value = null
            } else {
                Message(message, 'warning')
            }
        }).catch(error => {
            Message('更新昵称接口异常', 'error')
        })
    } else {
        Message('新昵称不能为空', 'warning')
    }
}
const uploadPic = async (file) => {
    let result
    if (file) {
        let formData = new FormData()
        formData.append('image', file)
        await axios.post('/upload/pic', formData).then(resp => {
            const { code, message, data } = resp.data
            if (code === 200) {
                result = data
            } else {
                Message(message, 'warning')
            }
        }).catch(error => {
            Message('上传图片接口异常', 'error')
        })
    }
    return result
}
const updateAvatar = () => {
    uploadPic(uploadFile.value.files[0]).then(avatar => {
        if (avatar) {
            axios.post("/user/update", { 'avatar': avatar }).then(resp => {
                const { code, message } = resp.data
                if (code === 200) {
                    Message('头像更换成功', 'success')
                    getUserInfo()
                    getUserList()
                } else {
                    Message(message, 'warning')
                }
            }).catch(error => {
                Message('头像更换接口异常', 'error')
            })
        }
    })
}
</script>

<template>
    <div class="user-info" v-if="isMyself">
        <img class="close" @click="closeCard" src="./svg/close-small.svg">
        <div class="avatar">
            <img @click="uploadFile.click()" :src="'/api/pic/' + user.avatar" @error="imgError">
            <input type="file" ref="uploadFile" accept="image/png, image/jpeg" @change="updateAvatar">
        </div>
        <div v-if="!editState" class="info">
            <span class="nickname">{{ user.nickname }}</span>
            <img @click="editState = true" src="./svg/edit.svg">
        </div>
        <div class="edit-form" v-else>
            <input type="text" v-model="form.nickname">
            <div>
                <button class="btn-yes" @click="updateNickname">确认</button>
                <button class="btn-no" @click="editState = false">取消</button>
            </div>
        </div>
    </div>
    <div class="user-info" v-else>
        <img class="close" @click="closeCard" src="./svg/close-small.svg">
        <div class="avatar">
            <img :src="userCardValue.avatar" @error="imgError">
        </div>
        <div class="info">
            <span class="nickname">{{ userCardValue.nickname }}</span>
        </div>
    </div>
</template>

<style scoped>
.user-info {
    user-select: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 200px;
    min-height: 300px;
    width: 25%;
    height: 30%;
    background-color: #ede2e2;
    z-index: 10;
    border-radius: 15px;
    box-shadow: 0 0 15px rgba(0, 0, 0, .5);
    text-align: center;
    padding: 10px;
}

input[type="file"] {
    display: none;
}

.avatar {
    position: relative;
}

.avatar img {
    border-radius: 50%;
    width: 100px;
    height: 100px;
    box-sizing: border-box;
}

.avatar img:hover {
    cursor: pointer;
    border: 2px solid #0077ff;
}

.info {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
}

.nickname {
    margin-right: 5px;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.info img {
    border-radius: 100%;
    transition: all .2s ease-in;
    vertical-align: middle;
}

.info img:hover {
    cursor: pointer;
    background-color: #93d8ec;
}

.edit-form input {
    border: none;
    outline: none;
    width: 60%;
    height: 20px;
    text-indent: 2px;
    border-radius: 5px;
    margin-bottom: 5px;
    border: 1px solid #000000;
}

.edit-form input:focus {
    border: 1px solid #00bee4;
}

.edit-form button {
    margin: 0 5px;
    padding: 2px 5px;
    border-radius: 5px;

}

.edit-form button:hover {
    cursor: pointer;
}

.btn-yes {
    border: none;
    border: 1px solid #0077ff;
}

.btn-no {
    border: none;
    border: 1px solid #ff0000;
}

.close {
    position: absolute;
    right: 10px;
    z-index: 20;
    border-radius: 50%;
    transition: all .2s ease-in;
}

.close:hover {
    cursor: pointer;
    background-color: #93d8ec;
}

@media screen and (max-width: 768px) {}
</style>