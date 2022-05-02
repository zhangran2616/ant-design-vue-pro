import request from '@/utils/request'

const api = {
  querySubnet: '/cmp/network/querySubnet',
  addSubnet: '/cmp/network/addSubnet',
  updateSubnet: '/cmp/network/updateSubnet',
  deleteSubnet: '/cmp/network/deleteSubnet',
  queryPlatform: '/cmp/platform/queryPlatform'
}

export default api

export function querySubnet (parameter) {
  return request({
    url: api.querySubnet,
    method: 'get',
    params: parameter
  })
}

export function addSubnet (parameter) {
  return request({
    url: api.addSubnet,
    method: 'post',
    data: parameter
  })
}

export function updateSubnet (parameter) {
  return request({
    url: api.updateSubnet,
    method: 'post',
    data: parameter
  })
}

export function deleteSubnet (parameter) {
  return request({
    url: api.deleteSubnet,
    method: 'get',
    params: parameter
  })
}

export function queryPlatform (parameter) {
  return request({
    url: api.queryPlatform,
    method: 'get',
    params: parameter
  })
}
