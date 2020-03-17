import {createAPI} from '@/utils/request'

export const list = data => createAPI('/system/user', 'get', data)
export const simple = data => createAPI('/system/user/simple', 'get', data)
export const add = data => createAPI('/system/user', 'post', data)
export const update = data => createAPI(`/system/user/${data.id}`, 'put', data)
export const remove = data => createAPI(`/system/user/${data.id}`, 'delete', data)
export const detail = data => createAPI(`/system/user/${data.id}`, 'get', data)
export const assignRoles = data => createAPI(`/system/user/assignRoles`, 'put', data)
