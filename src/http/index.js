import axios from 'axios'
import store from '../store';


const request = axios.create({
	baseURL: `/api`, // 根据实际情况设置基本URL
	// 这里可以添加其他默认配置
});

// 请求拦截器
request.interceptors.request.use(
	(config) => {
		if (config.url !== "/user/login") {   // 判断请求是否是登录接口
			config.headers.token = localStorage.getItem("TOKEN"); // 如果不是登录接口，就给请求头里面设置token
		}
		return config; // 返回这个配置对象，如果没有返回，这个请求就不会发送出去
	},
	(error) => {
		return Promise.reject(error);
	}
)

// 响应拦截器
request.interceptors.response.use(
	(resp) => {
		const { code } = resp.data
		if (code === 401) {           // 没有登录，或者token过期
			localStorage.removeItem('TOKEN')
			// 更改登录状态
			store.commit('changeLoginState', false)
		}
		return resp
	},
	(error) => {
		return Promise.reject(error);
	}
)

export default request;