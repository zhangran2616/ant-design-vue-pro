import request from '@/utils/request'

const api = {
  querySubnet: '/cmp/network/querySubnet',
  addSubnet: '/cmp/network/addSubnet',
  updateSubnet: '/cmp/network/updateSubnet',
  deleteSubnet: '/cmp/network/deleteSubnet',
  queryPlatform: '/cmp/platform/queryPlatform',
  addPlatform: '/cmp/platform/addPlatform',
  updatePlatform: '/cmp/platform/updatePlatform',
  deletePlatform: '/cmp/platform/deletePlatform',
  queryCluster: '/cmp/platform/queryCluster',
  queryHost: '/cmp/platform/queryHost',
  queryStore: '/cmp/platform/queryStore',
  queryVirtualMachine: '/cmp/vm/queryVirtualMachine',
  queryDc: '/cmp/platform/queryDc',
  queryNetworkLabel: '/cmp/platform/queryNetworkLabel',
  isOnline: '/cmp/platform/isOnline'
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

export function addPlatform (parameter) {
  return request({
    url: api.addPlatform,
    method: 'post',
    data: parameter
  })
}

export function updatePlatform (parameter) {
  return request({
    url: api.updatePlatform,
    method: 'post',
    data: parameter
  })
}

export function deletePlatform (parameter) {
  return request({
    url: api.deletePlatform,
    method: 'get',
    params: parameter
  })
}

export function queryCluster (parameter) {
  return request({
    url: api.queryCluster,
    method: 'get',
    params: parameter
  })
}

export function queryHost (parameter) {
  return request({
    url: api.queryHost,
    method: 'get',
    params: parameter
  })
}

export function queryStore (parameter) {
  return request({
    url: api.queryStore,
    method: 'get',
    params: parameter
  })
}

export function queryVirtualMachine (parameter) {
  return request({
    url: api.queryVirtualMachine,
    method: 'get',
    params: parameter
  })
}

export function queryDc (parameter) {
  return request({
    url: api.queryDc,
    method: 'get',
    params: parameter
  })
}

export function queryNetworkLabel (parameter) {
  return request({
    url: api.queryNetworkLabel,
    method: 'get',
    params: parameter
  })
}

export function isOnline (parameter) {
  return request({
    url: api.isOnline,
    method: 'get',
    params: parameter
  })
}
