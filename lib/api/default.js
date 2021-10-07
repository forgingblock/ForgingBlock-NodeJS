const axios = require('axios')
const qs = require('qs')

const Client = require('../Client')

let api, auth = {}
function initAPI() {
  const clientObj = Client.getInstance()
  auth = {
    trade: clientObj.getTrade(),
    token: clientObj.getToken()
  }
  api = 
    axios.create({
      baseURL: 'https://api-demo.forgingblock.io', // process.env.API_URL,
      withCredentials: true,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
}

const handleResponse = (res, resolve, reject) => {
  res.status === 200 ? resolve(res.data) : reject(res.statusText)
}

const buildPromise = (method, endPoint, data, config) => {
  data = qs.stringify({ ...data, ...auth})
  return new Promise((resolve, reject) => {
    method(endPoint, data, config)
      .then(res => handleResponse(res, resolve, reject))
      .catch(reason => {
        // TODO: Uncomment below lines for some
        //       specific status code of unauthenticated user.
        // if (reason.response.status === 401 || reason.response.status === 400) {
        //     router.push({ name: 'login' });
        // }
        reject(reason)
      })
  })
}

function apiGet(endPoint, config) {
  if (!api) initAPI()
  return buildPromise(api.get, endPoint, config)
}

function apiPost(endPoint, data, config) {
  if (!api) initAPI()
  // if config given, don't stringify. User should stringify itslef if required
  const parsedData = config ? data : data /*qs.stringify(data)*/

  return buildPromise(api.post, endPoint, parsedData, config)
}

function apiPut(endPoint, data) {
  return buildPromise(api.put, endPoint, data)
}

function apiDelete(endPoint, data) {
  return buildPromise(api.delete, endPoint, data)
}

module.exports = {
  buildPromise,
  apiGet,
  apiPost,
  apiPut,
  apiDelete
}