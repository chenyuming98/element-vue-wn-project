import axios from 'axios'
import {Message} from 'element-ui'

// create an axios instance
const instance = axios.create({
  baseURL:  'http://www.tianyu.com', // api的base_url
  timeout: 5000 // request timeout
})

const ok = "10000";

export const createAPI = (url, method, data) => {
  let config = {}
  if (method === 'get') {
    config.params = data
  } else {
    config.data = data
  }
  return instance({
    url,
    method,
    ...config
  })
}
