import request from '@/utils/request'

const api = {
  summaryVm: '/cmp/dashboard/summaryVm'
}

export default api

export function summaryVm (parameter) {
  return request({
    url: api.summaryVm,
    method: 'get',
    params: parameter
  })
}
