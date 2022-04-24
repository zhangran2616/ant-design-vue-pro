import request from '@/utils/request'

const api = {
  user: '/cmp/user/queryUser',
  addUser: '/cmp/user/addUser',
  updateUser: '/cmp/user/updateUser',
  deleteUser: '/cmp/user/deleteUser',
  role: '/cmp/role/queryRole',
  addRole: '/cmp/role/addRole',
  getRolePermission: '/cmp/role/getRolePermission',
  updateRole: '/cmp/role/updateRole',
  deleteRole: '/cmp/role/deleteRole',
  service: '/cmp/service',
  permission: '/cmp/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree'
}

export default api

export function getUserList (parameter) {
  return request({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function addUser (parameter) {
  return request({
    url: api.addUser,
    method: 'post',
    data: parameter
  })
}

export function updateUser (parameter) {
  return request({
    url: api.updateUser,
    method: 'post',
    data: parameter
  })
}

export function deleteUser (parameter) {
  return request({
    url: api.deleteUser,
    method: 'get',
    params: parameter
  })
}

export function getRoleList (parameter) {
  return request({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function addRole (parameter) {
  return request({
    url: api.addRole,
    method: 'post',
    data: parameter
  })
}

export function updateRole (parameter) {
  return request({
    url: api.updateRole,
    method: 'post',
    data: parameter
  })
}

export function deleteRole (parameter) {
  return request({
    url: api.deleteRole,
    method: 'get',
    params: parameter
  })
}

export function getRolePermission (parameter) {
  return request({
    url: api.getRolePermission,
    method: 'get',
    params: parameter
  })
}

export function getServiceList (parameter) {
  return request({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions (parameter) {
  return request({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return request({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return request({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}

export function saveSub (sub) {
  return request({
    url: '/sub',
    method: sub.id === 0 ? 'post' : 'put',
    data: sub
  })
}
