import {createAPI} from '@/utils/request'

export const getMenuList = data => createAPI('/system/permission/findMenuAndPermTreeList', 'get', data);
export const add = data => createAPI('/system/permission', 'post', data);
export const update = data => createAPI(`/system/permission/${data.permissionId}`, 'put', data);
export const remove = data => createAPI(`/system/permission/${data.id}`, 'delete', data);
export const batchRemove = data => createAPI(`/system/permission/permissionByBatchDelete`, 'post', data);
