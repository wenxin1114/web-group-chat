<script setup>
import { reactive, getCurrentInstance, ref } from 'vue'
import Message from './Message/index'
const { proxy } = getCurrentInstance()
const isLogin = ref(true)
const loginForm = reactive({
    username: '',
    password: ''
})

const registerForm = reactive({
    username: '',
    password: '',
    againpwd: ''
})

const login = () => {
    if (loginForm.username && loginForm.password) {
        proxy.$axios.post("/user/login", loginForm).then(resp => {
            const { code, message, data } = resp.data
            if (code === 200) {
                // 登陆成功，保存token
                Message(message, 'success')
                localStorage.setItem('TOKEN', data)
                proxy.$store.commit('updateLoginState', true)
                location.reload()
            } else {
                // 登录失败
                Message(message, 'error')
            }
        }).catch(error => {
            Message('登录接口异常', 'warning')
        })
    }
}

const regiset = () => {
    if (registerForm.username && registerForm.password && registerForm.againpwd) {
        proxy.$axios.post("/user/register", registerForm).then(resp => {
            const { code, message, data } = resp.data
            if (code === 200) {
                // 注册成功，返回登录
                Message(message, 'success')
                isLogin.value = true
            } else {
                // 注册失败
                Message(message, 'error')
            }
        }).catch(error => {
            console.log(error)
            Message('注册接口异常', 'warning')
        })
    }
}
</script>


<template>
    <div v-if="isLogin" class="container">
        <div class="title">LOGIN</div>
        <div class="form">
            <input type="text" style="margin: 15px;" v-model="loginForm.username" placeholder="USERNAME">
            <input type="password" style="margin: 15px;" v-model="loginForm.password" placeholder="PASSWORD">
            <button class="btn" @click="login">登录</button>
        </div>
        <div class="floor">
            <a @click="isLogin = false">注册账号</a>
        </div>
    </div>
    <div v-else class="container">
        <div class="title">REGIST</div>
        <div class="form">
            <input type="text"  style="margin: 10px;" v-model="registerForm.username" placeholder="USERNAME">
            <input type="password" style="margin: 10px;" v-model="registerForm.password" placeholder="PASSWORD">
            <input type="password" style="margin: 10px;" v-model="registerForm.againpwd" placeholder="AGAIN PASSWORD">
            <button class="btn" @click="regiset">注册</button>
        </div>
        <div class="floor">
            <a @click="isLogin = true">返回登录</a>
        </div>
    </div>
</template>

<style scoped>
.container {
    background-image: linear-gradient(to top, #30cfd0 0%, #330867 100%);
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    border-radius: 20px;
    width: 300px;
    height: 400px;
    text-align: center;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.title {
    font-family: 'Courier New', Courier, monospace;
    color: #fff;
    font-size: 50px;
    font-weight: bolder;
    letter-spacing: 10px;
    margin-top: 50px;
    background-color: transparent;
}

.form {
    margin: 10px;
}

.form input {
    width: 80%;
    border-radius: 20px;
    background-color: rgba(249, 249, 249, 0.5);
    height: 35px;
    color: #fbfbfb;
    font-size: 18px;
    text-indent: 1em;
    border: none;
    outline: none;
    border: 2px solid #f8edea;
    box-sizing: border-box;
}

.form input:hover {
    border: 2px solid #ecc412;
}

.form input:focus {
    border: 2px solid rgb(49, 201, 206);
}

.btn {
    margin-top: 15px;
    padding: 5px 60px;
    font-size: 20px;
    letter-spacing: 5px;
    border-radius: 30px;
    font-weight: 550;
    color: rgb(255, 255, 255);
    border: 2px solid rgb(249, 249, 249);
    cursor: pointer;
    background-color: transparent;
}
.btn:hover {
    background-color: hsl(184, 61%, 49%);
}


.floor {
    margin: 20px;
}

.floor a {
    margin: 0 5px;
    color: #ffffff;
    cursor: pointer;
}

.floor a:hover {
    color: rgb(244, 2, 2);
    
}
</style>