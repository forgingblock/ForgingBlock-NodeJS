'use strict'

const fetch = require('node-fetch')
const qs = require('qs')
const Client = require('../Client')

let auth = {}
let baseURL = null

function initAPI() {
  const clientObj = Client.getInstance()

  auth = {
    trade: clientObj.getTrade(),
    token: clientObj.getToken()
  }

  baseURL = clientObj.getBaseApiUrl() || 'https://api.forgingblock.io'
  baseURL = baseURL.replace(/\/+$/, '')
}

function joinUrl(base, path) {
  const p = String(path || '')
  if (!p) return base
  return p.startsWith('/') ? `${base}${p}` : `${base}/${p}`
}

async function handleResponse(res) {
  const contentType = res.headers?.get?.('content-type') || ''

  let data
  if (contentType.includes('application/json')) {
    data = await res.json().catch(() => null)
  } else {
    data = await res.text().catch(() => '')
  }

  if (res.status === 200) return data

  const err = new Error(
    typeof data === 'string' && data ? data : res.statusText
  )
  err.status = res.status
  err.data = data
  throw err
}

const buildPromise = (method, endPoint, data, config) => {
  if (!baseURL) initAPI()

  const upper = String(method || '').toUpperCase()
  const urlBase = joinUrl(baseURL, endPoint)

  const hasConfig = config !== undefined && config !== null

  let finalUrl = urlBase
  let body

  if (upper === 'GET') {
    const paramsObj = data && typeof data === 'object' ? data : {}
    const query = qs.stringify(
      { ...paramsObj, ...auth },
      { arrayFormat: 'indices' }
    )
    if (query) {
      finalUrl += (finalUrl.includes('?') ? '&' : '?') + query
    }
  } else {
    if (hasConfig && typeof data === 'string') {
      body = data
    } else {
      const dataObj = data && typeof data === 'object' ? data : {}
      body = qs.stringify(
        { ...dataObj, ...auth },
        { arrayFormat: 'indices' }
      )
    }
  }

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    ...(config?.headers || {})
  }

  const fetchOptions = {
    method: upper,
    headers,
    credentials: 'include',
    ...(config || {})
  }

  if (upper !== 'GET' && body !== undefined) {
    fetchOptions.body = body
  }

  return fetch(finalUrl, fetchOptions).then(handleResponse)
}

function apiGet(endPoint, config) {
  if (!baseURL) initAPI()
  return buildPromise('GET', endPoint, config, null)
}

function apiPost(endPoint, data, config) {
  if (!baseURL) initAPI()
  return buildPromise('POST', endPoint, data, config)
}

function apiPut(endPoint, data, config) {
  if (!baseURL) initAPI()
  return buildPromise('PUT', endPoint, data, config)
}

function apiDelete(endPoint, data, config) {
  if (!baseURL) initAPI()
  return buildPromise('DELETE', endPoint, data, config)
}

module.exports = {
  buildPromise,
  apiGet,
  apiPost,
  apiPut,
  apiDelete
}
