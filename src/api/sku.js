import axios from '../utils/request'

export function getSkuList(id) {
    return axios.get('/sku/getByProductId/'+id)
}

export function deleteSku(id) {
    return axios.get('sku/delete/'+id)
}

export function addSku(data) {
   return axios({
       url:'/sku/add',
       method:'post',
       data:data
   })
}
export function addOrUpdateSkus(data) {
    return axios({
        url:'/sku/addOrUpdateSkus',
        method:'post',
        data:data
    })
}

export function updateSkus(data) {
    return axios({
        url:'/sku/updateSkus',
        method:'post',
        data:data
    })
}
