import {createAPI} from '@/utils/request'

export const getMenuList = data => createAPI('/system/permission/selectMenuAndPermTree', 'get', data);

