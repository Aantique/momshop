import axios from 'axios';
import {ElMessage} from "element-plus";

axios.defaults.baseURL = 'http://101.43.3.244:8088'
//axios.defaults.baseURL = 'http://localhost:8088'

axios.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

axios.interceptors.response.use(res => {
    //console.log(res)
    if (typeof res.data !== 'object') {
        ElMessage.error('服务端异常！')
        return Promise.reject(res)
    }
    if (res.data.code != 200) {
        if (res.data.message) ElMessage.error(res.data.message)
        return Promise.reject(res.data)
    }
    return res.data.data
})

export default axios;
