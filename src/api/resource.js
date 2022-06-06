import request from '@/utils/request'
import qs from 'qs'

const api = {
  querySubnet: '/cmp/network/querySubnet',
  addSubnet: '/cmp/network/addSubnet',
  updateSubnet: '/cmp/network/updateSubnet',
  deleteSubnet: '/cmp/network/deleteSubnet',
  queryPlatform: '/cmp/platform/queryPlatform',
  getPlatformDetail: '/cmp/platform/getPlatformDetail',
  addPlatform: '/cmp/platform/addPlatform',
  updatePlatform: '/cmp/platform/updatePlatform',
  deletePlatform: '/cmp/platform/deletePlatform',
  syncPlatform: '/cmp/platform/sync',
  queryCluster: '/cmp/platform/queryCluster',
  queryHost: '/cmp/platform/queryHost',
  queryStore: '/cmp/platform/queryStore',
  queryVm: '/cmp/vm/queryVm',
  createVm: '/cmp/vm/create',
  queryDc: '/cmp/platform/queryDc',
  queryNetworkLabel: '/cmp/platform/queryNetworkLabel',
  queryTemplate: '/cmp/platform/queryTemplate',
  isOnline: '/cmp/platform/isOnline',
  powerOn: '/cmp/vm/powerOn',
  powerOff: '/cmp/vm/powerOff',
  reboot: '/cmp/vm/reboot',
  shutdown: '/cmp/vm/shutdown',
  suspend: '/cmp/vm/suspend',
  destroy: '/cmp/vm/destroy',
  queryIp: '/cmp/network/queryIp'
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

export function getPlatformDetail (parameter) {
  return request({
    url: api.getPlatformDetail,
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

export function syncPlatform (parameter) {
  return request({
    url: api.syncPlatform,
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

export function queryVm (parameter) {
  return request({
    url: api.queryVm,
    method: 'get',
    params: parameter,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}

export function createVm (parameter) {
  return request({
    url: api.createVm,
    method: 'post',
    data: parameter
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

export function queryTemplate (parameter) {
  return request({
    url: api.queryTemplate,
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

export function powerOn (parameter) {
  return request({
    url: api.powerOn,
    method: 'post',
    data: parameter
  })
}

export function powerOff (parameter) {
  return request({
    url: api.powerOff,
    method: 'post',
    data: parameter
  })
}

export function reboot (parameter) {
  return request({
    url: api.reboot,
    method: 'post',
    data: parameter
  })
}

export function shutdown (parameter) {
  return request({
    url: api.shutdown,
    method: 'post',
    data: parameter
  })
}

export function suspend (parameter) {
  return request({
    url: api.suspend,
    method: 'post',
    data: parameter
  })
}

export function destroy (parameter) {
  return request({
    url: api.destroy,
    method: 'post',
    data: parameter
  })
}

export function queryIp (parameter) {
  return request({
    url: api.queryIp,
    method: 'get',
    params: parameter
  })
}
