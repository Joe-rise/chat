import axios from "./axios";

export const login = (data)=>{
    return axios({
        url:'/user/login',
        method:'post',
        headers: { 'Content-Type': 'application/json' },
        data:data
    })
}

