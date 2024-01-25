'use strict';

const api = require('../api'),
	utils = require('../utils')

class Balance {
	/**
	 * This callback type is called `requestCallback` and is displayed as a global symbol.
	 *
	 * @callback requestCallback
	 * @param {Error} error
	 * @param {object} response
	 */

	async all(params, callback) {
		try {
			if (params.multiwallet) {
				utils.getAllBalancesMultiWallet(( wallets ) => {
					callback(null, wallets)
				})
			} else {
				utils.getAllBalancesMultiWallet((wallets) => {
					callback(null, wallets)
				})
			}
		} catch (error) {
			callback(error)
		}
	}
}

module.exports = new Balance()