import {createAPI,createFormAPI} from '@/utils/request'

export const list = data => createAPI('/system/role', 'get', data)
export const add = data => createAPI('/system/role', 'post', data)
export const update = data => createAPI(`/system/role/${data.roleId}`, 'put', data)
export const remove = data => createAPI(`/system/role/${data.id}`, 'delete', data)
export const batchRemove = data => createAPI(`/system/role/batchDeleteRoleByIds`, 'post', data);
export const detail = data => createAPI(`/system/role/${data.id}`, 'get', data)
export const assignRoles = data => createAPI(`/system/role/assignRoles`, 'put', data)
