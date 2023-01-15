import axios from "./axios";

export const getDayData = ()=>{
    return axios({
        url:'/stats/dayUploadNum',
        method:'get',
        headers: { 'Content-Type': 'application/json' },
    })
}

export const getDaySize = ()=>{
    return axios({
        url:'/stats/dayUploadSize',
        method:'get',
        headers: { 'Content-Type': 'application/json' },
    })
}
