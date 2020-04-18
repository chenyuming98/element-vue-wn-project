import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import {showLoading,hideLoading} from '@/utils/loadingUtils';

// create an axios instance
const instance = axios.create({
  baseURL:  'http://www.tianyu.com', // api的base_url
  timeout: 5000 // request timeout
})



export const createAPI = (url, method, data) => {
  let config = {}
  if (method === 'get') {
    config.params = data
  } else {
    config.data = data
    config.headers = {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json'
    }
    config.responseType = 'json'
  }
  return instance({
    url,
    method,
    ...config
  }).catch( (err) => {
    ElementUI.Message({message: "服务器错误！" ,type: "error"});
    console.log(err);
    hideLoading();
  })
};


export const createFormAPI = (url, method, data) => {
  let config = {}
  config.data = data
  config.headers = {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  config.responseType = 'json'

  return instance({
    url,
    method,
    ...config
  })
}

