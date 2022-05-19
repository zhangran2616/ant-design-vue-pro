import request from '@/utils/request'

const api = {
  queryHostMonitor: '/cmp/monitor/queryHostMonitor',
  queryVmMonitor: '/cmp/monitor/queryVmMonitor'
}

export default api

export function queryHostMonitor (parameter) {
  return request({
    url: api.queryHostMonitor,
    method: 'get',
    params: parameter
  })
}

export function queryVmMonitor (parameter) {
  return request({
    url: api.queryVmMonitor,
    method: 'get',
    params: parameter
  })
}
