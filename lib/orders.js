'use strict'

export function orders (client) {
  return {
    create (payload) {
      return client.request('POST', '/orders', payload)
    },

    list ({ page = 1 } = {}) {
      const qs = new URLSearchParams({ page: String(page) })
      return client.request('GET', `/orders?${qs.toString()}`)
    },

    get (orderId, { checkoutPage = 1 } = {}) {
      if (!orderId) {
        throw new Error('orderId is required')
      }

      const qs = new URLSearchParams({ checkout_page: String(checkoutPage) })
      return client.request('GET', `/orders/${orderId}?${qs.toString()}`)
    }
  }
}
