/*eslint no-console: 0 */
'use strict';

var url = require('url'),
	request = require('request'),
	_ = require('lodash'),
	assign = require('object-assign'),
	qs = require('querystring') //,
	// buildApiError = require('./buildApiError'),
	// version = require('../package.json').version,
	// ApiResponse = require('./ApiResponse');

var DEFAULT_TRADE = null;
var DEFAULT_TOKEN = null;
var DEFAULT_BASE_API_URL = 'https://api-demo.forgingblock.io/';
var DEFAULT_TIMEOUT = 3000;

module.exports = (function (DEFAULT_TRADE, DEFAULT_TOKEN, DEFAULT_BASE_API_URL, DEFAULT_TIMEOUT) {
	var instance;

	function init(trade, token, baseApiUrl, timeout) {

		var CONFIG_PARAM_NAMES = {
			TRADE: 'trade',
			TOKEN: 'token',
			BASE_API_URL: 'baseApiUrl',
			TIMEOUT: 'timeout'
		};
		var config = {};

		config[CONFIG_PARAM_NAMES.TRADE] = DEFAULT_TRADE;
		config[CONFIG_PARAM_NAMES.TOKEN] = DEFAULT_TOKEN;

		config[CONFIG_PARAM_NAMES.BASE_API_URL] = DEFAULT_BASE_API_URL;
		config[CONFIG_PARAM_NAMES.TIMEOUT] = DEFAULT_TIMEOUT;

		function setParam(key, value) {
			config[key] = value;
		}

		function getParam(key) {
			return config[key];
		}

		function setTrade(tradeKey) {
			if (tradeKey) {
				setParam(CONFIG_PARAM_NAMES.TRADE, tradeKey);
			} else {
				throw new Error('Trade Key is required.');
			}
		}

		function getTrade() {
			return	getParam(CONFIG_PARAM_NAMES.TRADE);
		}

		function setToken(token) {
			if (token) {
				setParam(CONFIG_PARAM_NAMES.TOKEN, token);
			}
		}

		function getToken() {
			return	getParam(CONFIG_PARAM_NAMES.TOKEN);
		}

		function setRequestTimeout(timeout) {
			if (timeout) {
				setParam(CONFIG_PARAM_NAMES.TIMEOUT, timeout);
			}
		}

		function getRequestTimeout() {
			return	getParam(CONFIG_PARAM_NAMES.TIMEOUT);
		}

		function setBaseApiUrl(baseApiUrl) {
			if (baseApiUrl) {
				var urlObj = url.parse(baseApiUrl);

				if (urlObj.protocol === 'http:') {
					var warning = 'WARNING: this client is sending a request to an insecure'
						+ ' API endpoint. Any API request you make may expose your API key and'
						+ ' secret to third parties. Consider using the default endpoint: ' + baseApiUrl;

					console.warn(warning);
				}

				setParam(CONFIG_PARAM_NAMES.BASE_API_URL, baseApiUrl);
			}
		}

		function getBaseApiUrl() {
			return	getParam(CONFIG_PARAM_NAMES.BASE_API_URL);
		}

		setTrade(trade);
		setToken(token);
		setBaseApiUrl(baseApiUrl);
		setRequestTimeout(timeout);

		function generateReqOptions(url, body, method, headers) {
			var bodyStr = body ? JSON.stringify(body) : '';
			var options = {
				'url': url,
				'body': bodyStr,
				'method': method,
				'timeout': getRequestTimeout(),
				'headers': {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'User-Agent': 'ForgingBlock ' + version,
					'trade': getTrade(),
					'token': getToken()
				}
			};

			options.headers = assign(options.headers, headers);

			return options;
		}

		function getFullUrlPath(path, params) {
			var baseUrl = getBaseApiUrl();
			var extraParams = '';

			if (params && !_.isEmpty(params)) {
				extraParams = '?' + qs.stringify(params);
			}

			return baseUrl + path + extraParams;
		}

		function makeRequest(options, callback) {
			console.log(options)
			request(options, function (error, response) {
				var apiResponse = new ApiResponse(response);

				if (!buildApiError(error, apiResponse, callback)) {
					callback(null, apiResponse);
				}
			});
		}

		return {
			setTrade: setTrade,
			getTrade: getTrade,
			setToken: setToken,
			getToken: getToken,
			setBaseApiUrl: setBaseApiUrl,
			getBaseApiUrl: getBaseApiUrl,
			setRequestTimeout: setRequestTimeout,
			getRequestTimeout: getRequestTimeout,
			getHttp: function (path, args, callback, headers) {
				var fullUrl = getFullUrlPath(path, args);
				var options = generateReqOptions(fullUrl, null, 'GET', headers);

				makeRequest(options, callback);
			},
			postHttp: function (path, data, callback, headers) {
				var fullUrl = getFullUrlPath(path);
				var options = generateReqOptions(fullUrl, data, 'POST', headers);

				makeRequest(options, callback);
			},
			putHttp: function (path, data, callback, headers) {
				var fullUrl = getFullUrlPath(path);
				var options = generateReqOptions(fullUrl, data, 'PUT', headers);

				makeRequest(options, callback);
			},
			deleteHttp: function (path, callback, headers) {
				var fullUrl = getFullUrlPath(path);
				var options = generateReqOptions(fullUrl, {}, 'DELETE', headers);

				makeRequest(options, callback);
			}
		};
	}

	return {
		init: function ({ trade, token, baseApiUrl, timeout }) {
			if (!instance) {
				instance = init(trade, token, baseApiUrl, timeout);
			} else {
				instance.setTrade(trade);
				instance.setBaseApiUrl(baseApiUrl);
				instance.setRequestTimeout(timeout);
			}

			return instance;
		},
		getInstance: function () {
			if (!instance) {
				throw new Error('Please init client first.');
			}

			return instance;
		}
	};
})(DEFAULT_TRADE, DEFAULT_TOKEN, DEFAULT_BASE_API_URL, DEFAULT_TIMEOUT);
