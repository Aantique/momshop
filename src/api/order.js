import axios from '../utils/request'

export function getOrderList(data) {
    return axios({
        url:'/order/getOrderList',
        method:'post',
        contentType:'application/json',
        data:data
    })

}

export function deleteOrder(data) {
    return axios({
        url:'/order/deleteOrder',
        method:'post',
        data:data
    })
}

export function updateOrder(data) {
    return axios({
        url:'/order/updateOrder',
        method:'post',
        data:data
    })
}

export function addOrder(data) {
    return axios({
        url:'/order/addOrder',
        method:'post',
        data:data
    })
}
