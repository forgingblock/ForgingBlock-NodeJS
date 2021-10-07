'use strict';

const api = require('../api'),
	utils = require('../utils')

class Sale {
	/**
	 * This callback type is called `requestCallback` and is displayed as a global symbol.
	 *
	 * @callback requestCallback
	 * @param {Error} error
	 * @param {object} response
	 */

	/**
	 * @param {string} invoiceId - ID of the product/donation
	 * @param {requestCallback} callback - The callback that handles the response.
	 */
	async retrieve(invoiceId, callback) {
		try {
			let response = await api.checkInvoice({
				invoice: invoiceId
			})

			callback(null, response)
		} catch (error) {
			callback(error, null)
		}
	}

	async all(params, callback) {
		// var params = {
		// 	'status': 'all'
		// };
		params = params || { status : 'all'}
		try {
			const payments = await api.getStoreInvoicesSimple({ full: true })
			const cleanedPayments = utils.cleanData(payments)
			const paidPayments = utils.filterPaidInvoices(cleanedPayments)

			callback(null, params.status === 'paid' ? paidPayments : cleanedPayments)
		} catch (error) {
			callback(error)
		}
	}
}

module.exports = new Sale()