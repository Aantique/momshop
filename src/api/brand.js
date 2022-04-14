import axios from '../utils/request'

export function getBrands() {
    return axios({
        url: '/brand/getBrands',
        method: 'get'
    })
}

export function getBrandList(params) {
    return axios({
        url:'/brand/getBrandsByPage',
        method:"post",
        params:params
    })
}

export function addBrand(data) {
    return axios({
        url: '/brand/add',
        method: 'post',
        data:data
    })
}

export function deleteBrand(id) {
    return axios({
        url:'/brand/delete/'+id,
        method:'get',
    })
}

export function updateBrand(data) {
    return axios({
        url: '/brand/update',
        method: 'post',
        data:data
    })
}
