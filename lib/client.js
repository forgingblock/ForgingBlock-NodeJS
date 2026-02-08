'use strict'

import { apiVersion } from './version.js'

export function createClient ({
  apiKey,
  baseUrl = 'https://api.forgingblock.io'
}) {
  if (!apiKey) {
    throw new Error('apiKey is required')
  }

  const normalizedBase = baseUrl.replace(/\/+$/, '')
  const base = `${normalizedBase}/api/${apiVersion}`

  async function request (method, path, body) {
    const res = await fetch(`${base}${path}`, {
      method,
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`
      },
      body: body ? JSON.stringify(body) : undefined
    })

    const text = await res.text()
    const data = text ? JSON.parse(text) : null

    if (!res.ok) {
      const err = new Error(data?.error || res.statusText)
      err.status = res.status
      err.data = data
      throw err
    }

    return data
  }

  return { request }
}
