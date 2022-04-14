import axios from '../utils/request'

export function getAttrList(params) {
    return axios({
        url:'/attr/getAttrList',
        method:'get',
        params:params
    })
}

export function getAttrs() {
    return axios({
        url:'/attr/getAttrs',
        method:'get',
    })
}

export function updateAttrs(data) {
    return axios({
        url:'/attr/updateAttrs',
        method: 'post',
        data:data
    })
}

