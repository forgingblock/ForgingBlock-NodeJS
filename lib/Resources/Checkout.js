'use strict';

const api = require('../api'),
	client = require('../Client')

class Checkout {

	/**
	 * @param {object} data - Data object for creating an item
	 * <br> e.g. { amount:550, currency:rub, description:spoon, email:test@fastmail.mx, count:2 name:bestspoon }
	 * @param {string} itemType - ["produсt" | "donation"]
	 * @param {requestCallback} callback - The callback that handles the response.
	 */
	async create(data, itemType, ipn, callback) {
		// amount=550&currency=rub&description=spoon&email=test%40fastmail.mx&count=2&name=bestspoon
		itemType = itemType || 'product'
		try {
			let response
			const reqApi = itemType === 'donation' ? api.createCrowdfunding : api.createUrl
			if (ipn) {
				data.notification = ipn
				response = await reqApi(data)
			}
			if (!ipn) {
				response = await reqApi(data)
			}

			callback(null, response)
		} catch (error) {
			callback(error, null)
		}
	}

	/**
	 * This callback type is called `requestCallback` and is displayed as a global symbol.
	 *
	 * @callback requestCallback
	 * @param {Error} error
	 * @param {object} response
	 */

	/**
	 * @param {string} itemId - ID of the product/donation
	 * @param {string} itemType - ["produt" | "donation"]
	 * @param {requestCallback} callback - The callback that handles the response.
	 */
	async retrieve(itemId, itemType, callback) {
		itemType = itemType || 'product'
		try {
			const clientObj = client.getInstance()
			let response

			if (itemType === 'donation') {
				response = await api.checkCrowdfunding({ fund: itemId })
				response.url = clientObj.getBaseApiUrl() + 'fund/' + response.fund + '/' + response.amount
			} else {
				response = await api.checkUrl({ item: itemId })
				response.url = clientObj.getBaseApiUrl() + 'item/' + response.item
			}

			callback(null, response)
		} catch (error) {
			callback(error, null)
		}
	}
	
	/**
	 * @param {object} data - Checkout data to be updated
	 * @param {string} data.item - Item id of checkout
	 * @param {string} data.name - Item name
	 * @param {string} data.description - Item description
	 * @param {number} data.count - Item count
	 * @param {requestCallback} callback - The callback that handles the response.
	 */
	async update(data, callback) {
		// item: 24ea53d945692da5f353b4cd323e7826, description: thebesttool, name: product1, count: 12
		try {
			try {
				let response
				response = await api.checkoutUpdate(data)

				callback(null, response)
			} catch (error) {
				callback(error, null)
			}
		} catch (error) {
			callback(error, null)
		}
	}

	delete(id, callback) {
	}

	list(params, callback) {
		// var params = {
		// 	'limit': 2,
		// 	'order': 'desc'
		// };
	}

	async all(params, callback) {
		try {
			const promises = [api.getPaymentsList(), api.getCrowdfundsList()]
			Promise.all(promises).then(response => {
				const obj = {}
				obj.products = response[0].items
				obj.donations = response[1].funds
				callback(null, obj)
			}).catch(err => {
				console.log(err);
				callback(err, null)
			})
			// const res = await api.getCrowdfundsList()
		} catch (error) {
			callback(error)
		}
	}
}

module.exports = new Checkout()