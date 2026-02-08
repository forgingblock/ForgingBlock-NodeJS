'use strict'

import { createClient } from './client.js'
import { orders } from './orders.js'

export function forgingblock ({ apiKey, baseUrl }) {
  const client = createClient({ apiKey, baseUrl })

  return {
    orders: orders(client)
  }
}
