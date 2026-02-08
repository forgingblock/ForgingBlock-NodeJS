# ForgingBlock

ForgingBlock is a peer-to-peer cryptocurrency payment system that enables merchants and developers to accept stablecoins using APIs similar to traditional card-payment infrastructure. ForgingBlock offers APIs, libraries, and Ecommerce plugins to assist merchants and developers.

This package is the **official Node.js SDK** for the ForgingBlock API.

* API Docs: [https://api.forgingblock.io/docs/](https://api.forgingblock.io/docs/)
* npm: [https://www.npmjs.com/package/forgingblock.js](https://www.npmjs.com/package/forgingblock.js)

## Requirements

* Node.js **>= 18**
* A ForgingBlock account
* An **API key** generated from the dashboard

## Getting an API key

1. Log in to the ForgingBlock dashboard
2. Go to **Account Settings → Integrations → API Token**
3. Generate an API key
4. Store it securely (environment variable recommended)

## Installation

```sh
npm install forgingblock.js
```

## Usage

### Initialize SDK

```js
import { forgingblock } from 'forgingblock.js'

const fb = forgingblock({
  apiKey: process.env.FORGINGBLOCK_API_KEY
})
```

## Orders

### Create order

*Order support optional merchant-side order identifier using `order_id` parameter*

Creates a new payment order.

```js
const order = await fb.orders.create({
  price_amount: '0.01',
  price_currency: 'USD',
  title: 'Test order',
  description: 'Example order'
})

console.log(order.id)
console.log(order.invoice_url) // invoice lifetime 20 minutes
console.log(order.checkout_url) // generates new invoice using same order data
```

### List orders

Returns a paginated list of orders (100 per page).

```js
const list = await fb.orders.list({ page: 1 })

console.log(list.current_page)
console.log(list.total_orders)
console.log(list.orders)
```

### Get order by ID

Retrieves full details for a single order.

```js
const order = await fb.orders.get('<order_id>')

console.log(order.status)
console.log(order.price_amount)
console.log(order.crypto_amount)
console.log(order.customerInfo)
```

