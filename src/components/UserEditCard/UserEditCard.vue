<script setup>
import { getUserInfo, uploadFile } from '../../utils/index';
import { ref, computed } from 'vue';
import axios from '../../http/index'
import Message from '../Message/index';
const props = defineProps(['user'])
const user = props.user
const emit = defineEmits(['close-edit-card'])
const uploadPic = ref(null)
const genderOptionsState = ref(false)
const genderOptions = ['保密', '男', '女']
const clickOutside = (event) => {
    if (event.target.className === 'input-item gender') {
        genderOptionsState.value = true
    } else {
        genderOptionsState.value = false
    }
}

const clickOption = (index) => {
    user.gender = index
}


const imgError = (event) => {
    event.target.src = new URL('../../assets/default_user.jpg', import.meta.url).href
}

const gender = computed(() => {
    return user.gender === 0 ? '保密' : (user.gender === 1 ? '男' : '女')
})

const saveEdit = () => {
    if (user.nickname) {
        if (user.nickname.length > 8) {
            Message('昵称长度不能大于8', 'warning')
            return;
        }
        if (user.description.length > 80) {
            Message('签名长度不能大于80', 'warning')
            return;
        }
        axios.post('/user/update', user).then(resp => {
            const { code, message } = resp.data
            if (code === 200) {
                Message('保存成功', 'success')
                getUserInfo()
            } else {
                Message(message, 'warning')
            }
        }).catch(error => {
            Message('更新用户信息接口异常', 'error')
        })
    } else {
        Message('新昵称不能为空', 'warning')
    }
}

const updateAvatar = () => {
    uploadFile(uploadPic.value.files[0]).then(avatar => {
        if (avatar) {
            axios.post("/user/update", { 'avatar': avatar }).then(resp => {
                const { code, message } = resp.data
                if (code === 200) {
                    user.avatar = avatar
                    Message('头像更换成功', 'success')
                    getUserInfo()
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
    <div class="edit-form" @click="clickOutside">
        <div class="edit-avatar">
            <img @click="uploadPic.click()" :src="'/api/pic/' + user.avatar" @error="imgError">
            <icon-camera @click="uploadPic.click()" class="icon-camera" theme="outline" size="30" fill="#ffffff"
                :strokeWidth="3" />
            <input type="file" ref="uploadPic" accept="image/png, image/jpeg" @change="updateAvatar">
        </div>
        <div class="edit-input">
            <div class="input-item">
                <span class="label">昵称</span>
                <input type="text" v-model="user.nickname">
            </div>
            <div class="input-item">
                <span class="label">签名</span>
                <input type="text" v-model="user.description">
            </div>
            <div class="input-item gender">
                <span class="label">性别</span>
                <span>{{ gender }}</span>
            </div>
            <div v-if="genderOptionsState" class="gender-options">
                <div class="option" @click="clickOption(index)" v-for="(option, index) in genderOptions">{{ option }}
                </div>
            </div>
            <div class="edit-floor">
                <button class="save-btn" @click="saveEdit">保存</button>
                <button class="cancel-btn" @click="emit('close-edit-card')">取消</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.edit-form {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 30;
    width: 300px;
    height: 400px;
    background-color: #f4efef;
    border-radius: 15px;
    box-shadow: 0 0 15px rgba(0, 0, 0, .5);
    padding: 20px;
}

.edit-avatar {
    text-align: center;
    position: relative;

}

.edit-avatar .icon-camera {
    cursor: pointer;
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translate(50%, -50%);
}

.edit-avatar img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    box-sizing: border-box;
    filter: brightness(80%);
    cursor: pointer;
}

.edit-avatar img:hover {
    cursor: pointer;
    border: 2px solid #3046c1;
}

input[type="file"] {
    display: none;
}

.input-item {
    background-color: #fff;
    margin: 20px 0;
    padding: 5px;
    border-radius: 5px;
}

.input-item .label {
    margin-right: 10px;
}

.input-item input[type="text"] {
    width: 85%;
    border: none;
    outline: none;
    font-size: 16px;
}


.gender-options {
    margin-top: -15px;
    box-shadow: 0 0 15px rgba(0, 0, 0, .5);
    padding: 5px 8px;
    border-radius: 5px;
    background-color: #fff;
}

.gender-options .option {
    cursor: pointer;
    margin: 3px 0;
    padding: 2px;
    border-radius: 5px;
    text-indent: 4px;
}

.gender-options .option:hover {
    background-color: #e4dada;
}

.gender-options .option .active {
    background-color: #d2caca;
}

.edit-floor {
    position: absolute;
    bottom: 30px;
    right: 20px;
}

.edit-floor button {
    user-select: none;
    border: none;
    margin: 0 5px;
    border-radius: 5px;
    padding: 4px 18px;
    border: 1px solid #bdb4b4;
    cursor: pointer;
}

.edit-floor .save-btn {
    background-color: #008deb;
    color: #fff;
}

.edit-floor .save-btn:hover {
    background-color: #1177bc;
}

.edit-floor .cancel-btn:hover {
    background-color: #d0c4c4;
}

@media screen and (max-width: 768px) {
    .edit-form {
        width: 80%;
    }
}</style>