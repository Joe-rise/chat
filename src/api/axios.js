import axios from 'axios'
import {ElMessage} from 'element-plus'


// 创建一个 axios 实例
const service = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 60000, // 请求超时时间毫秒
    withCredentials: true, // 异步请求携带cookie
    headers: {
        // 设置后端需要的传参类型
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
})

// 添加请求拦截器
service.interceptors.request.use(
    function (config) {
        // 在发送请求之前做些什么
        const token = localStorage.getItem('userInfo')
        if (token) {
            // 请求头携带token
            config.headers.Authorization = JSON.parse(token).token
        }
        return config
    },
    function (error) {
        // 对请求错误做些什么
        console.log(error)
        return Promise.reject(error)
    }
)

// 添加响应拦截器
service.interceptors.response.use(
    response => {
        // 2xx 范围内的状态码都会触发该函数。
        // 对响应数据做点什么
        // dataAxios 是 axios 返回数据中的 data
        const dataAxios = response.data
        // 这个状态码是和后端约定的
        // const code = dataAxios.reset
        if (dataAxios.code === !200) {
            ElMessage({
                message: dataAxios.msg,
                type: 'warning',
            })
        }
        return dataAxios
    },
    error=> {
        console.log(error)
        const responseCode = error.response.status;
        switch (responseCode) {
            case 401:
                ElMessage({
                    message: "登陆信息失效，请重新登陆",
                    type: 'warning',
                })
                localStorage.removeItem('userInfo');
                // router.push({name: "login"})
                break
            case 400:
                ElMessage({
                    message: error.response.data.msg,
                    type: 'warning',
                })
                break
            case 500:
                ElMessage({
                    message: error.response.data.msg,
                    type: 'error',
                })
                break
        }
        return Promise.reject(error)

    }
)

export default service

