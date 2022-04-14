import axios from '../utils/request'

export function getCategories() {
    return axios({
        url: '/cate/getCategories',
        method: 'get'
    })
}

export function getCateById(id) {
    return axios({
        url: '/cate/getCateById/'+id,
        method: 'get'
    })
}

export function getCategoriesByPage(params) {
    return axios({
        url:'/cate/getCategoriesByPage',
        method:'get',
        params:params
    })
}

export function deleteCateById(id) {
    return axios({
        url: '/cate/deleteCateById/'+id,
        method: 'get'
    })
}

export function updateCateById(data) {
    return axios({
        url: '/cate/updateCateById',
        method: 'post',
        data:data
    })
}

export function addCateAndAttr(data) {
    return axios({
        url: '/cate/addCateAndAttr',
        method: 'post',
        data:data
    })
}
