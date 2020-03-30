import axios from 'axios'
import {Message} from 'element-ui'

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
  })
}

