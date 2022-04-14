import axios from '../utils/request'

export function getProductList(params) {
    return axios({
        url:'/product/getProducts',
        method:'get',
        params:params

    })
}

export function deleteProduct(id) {
    return axios.get('/product/deleteProduct/'+id)
}

export function getProductById(id) {
    return axios.get('/product/getProductById/'+id)
}

export function getProductsByCondition(data) {
    return axios({
        url:'/product/getProductsByCondition',
        method:'post',
        data:data
    })
}

export function updateProduct(data) {
    return axios({
        url:'/product/update',
        method:'post',
        data:data

    })
}

export function addProduct(data) {
    return axios({
        url:'/product/add',
        method:'post',
        data:data
    })
}
