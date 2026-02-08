'use strict'

import { test } from 'node:test'
import assert from 'node:assert'
import { forgingblock } from '../lib/index.js'

test('Library tests: create order, list orders, get order', async () => {
  const apiKey = process.env.FORGINGBLOCK_TEST_API_KEY
  const baseUrl = process.env.FORGINGBLOCK_TEST_BASE_URL

  assert.ok(apiKey, 'FORGINGBLOCK_TEST_API_KEY must be set')
  assert.ok(baseUrl, 'FORGINGBLOCK_TEST_BASE_URL must be set')

  const sdk = forgingblock({ apiKey, baseUrl })

  // 1) create order
  const created = await sdk.orders.create({
    price_amount: '0.01',
    price_currency: 'USD',
    title: 'Lib test order',
    description: 'lib test order'
  })
  console.log(created)

  assert.ok(created.id)
  assert.equal(created.status, 'new')

  const orderId = created.id

  // 2) list orders
  const list = await sdk.orders.list({ page: 1 })
  console.log(list)

  assert.ok(Array.isArray(list.orders))
  assert.ok(list.orders.length > 0)
  assert.equal(list.current_page, 1)
  assert.equal(list.per_page, 100)

  const listed = list.orders.find(o => o.id === orderId)
  assert.ok(listed, 'created order must appear in list')

  // 3) get order by id
  const fetched = await sdk.orders.get(orderId)
  console.log(fetched)

  assert.equal(fetched.id, orderId)
  assert.equal(fetched.status, 'new')
  assert.equal(fetched.price_currency, 'USD')
  assert.equal(fetched.price_amount, '0.01000000')
  assert.ok(fetched.invoice_url)
  assert.ok(fetched.checkout_url)
  assert.ok(Array.isArray(fetched.blockchain_transactions))
})
