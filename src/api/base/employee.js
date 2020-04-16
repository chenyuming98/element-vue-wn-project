import {createAPI} from '@/utils/request'

export const list = data => createAPI('/organization/employee', 'get', data);
export const simple = data => createAPI('/organization/employee/simple', 'get', data);
export const add = data => createAPI('/organization/employee', 'post', data);
export const update = data => createAPI(`/organization/employee/${data.employeeId}`, 'put', data);
export const remove = data => createAPI(`/organization/employee/${data.id}`, 'delete', data);
export const batchRemove = data => createAPI(`/organization/employee/batchDeleteEmployeeByIds`, 'post', data);
export const detail = data => createAPI(`/organization/employee/${data.id}`, 'get', data);