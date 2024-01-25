// const { apiGet, apiPost } = require('./default')
const { apiGet, apiPost} = require('./default')
const requestClient = require('request')

// TODO: Remove unused api routes
function btcBalance(url) {
  return new Promise((resolve, reject) => {
    let balance = '0'

    requestClient.get(
      {
        uri: url,
        json: true
      },
      (error, response, body) => {
        if (error) {
          console.error('error:', error)
        }
        balance =
          (Number(body.chain_stats.funded_txo_sum) -
            Number(body.chain_stats.spent_txo_sum)) *
            0.00000001 +
          ''
        resolve(balance)
      }
    )
  })
}

function ethBalance(url) {
  return new Promise((resolve, reject) => {
    let balance = '0'

    requestClient.get(
      {
        uri: url,
        json: true
      },
      (error, response, body) => {
        if (error) {
          console.error('error:', error)
        }
        balance = Number(body.result) / 1000000000000000000 + ''
        resolve(balance)
      }
    )
  })
}

function ethTokenBalance(url, division) {
  return new Promise((resolve, reject) => {
    let balance = '0'

    requestClient.get(
      {
        uri: url,
        json: true
      },
      (error, response, body) => {
        if (error) {
          console.error('error:', error)
        }
        balance = Number(body.result) / Number(division) + ''
        resolve(balance)
      }
    )
  })
}

function xtzBalance(url) {
  return new Promise((resolve, reject) => {
    let balance = '0'

    requestClient.get(
      {
        uri: url,
        json: true
      },
      (error, response, body) => {
        if (error) {
          console.error('error:', error)
        }
        balance = Number(body.total_balance) + ''
        resolve(balance)
      }
    )
  })
}

function eosBalance(url, account) {
  return new Promise((resolve, reject) => {
    let balance = '0'

    requestClient.post(
      {
        uri: url,
        body: {
          account_name: account
        },
        json: true
      },
      (error, response, body) => {
        if (error) {
          console.error('error:', error)
        }
        if (
          typeof body.core_liquid_balance !== 'undefined' &&
          body.core_liquid_balance !== null
        ) {
          balance = body.core_liquid_balance.replace(/[^\d.-]/g, '')
          resolve(balance)
        } else {
          resolve(balance)
        }
      }
    )
  })
}

function eosTokenBalance(url, account, code, symbol) {
  return new Promise((resolve, reject) => {
    let balance = '0'

    requestClient.post(
      {
        uri: url,
        body: {
          code: code,
          account: account,
          symbol: symbol
        },
        json: true
      },
      (error, response, body) => {
        if (error) {
          console.error('error:', error)
        }
        if (typeof body !== 'undefined' && body.length > 0) {
          balance = body[0].replace(/[^\d.-]/g, '')
          resolve(balance)
        } else {
          resolve(balance)
        }
      }
    )
  })
}

function tuscBalance(url, account) {
  return new Promise((resolve, reject) => {
    let balance = 0

    requestClient.get(
      {
        uri: url + account,
        json: true
      },
      (error, response, body) => {
        if (error) {
          console.error('error:', error)
        }
        try {
          if (response.statusCode === 500) {
            balance = 0
          } else if (body.balances[0].asset_type === '1.3.0') {
            balance = Number(body.balances[0].balance) / 100000
          } else {
            balance = 0
          }
        } catch (err) {
          balance = 0
        }
        resolve(balance)
      }
    )
  })
}

function dgbBalance(url) {
  return new Promise((resolve, reject) => {
    let balance = '0'

    requestClient.get(
      {
        uri: url,
        json: true
      },
      (error, response, body) => {
        if (error) {
          console.error('error:', error)
        }
        balance = body.balance
        resolve(balance)
      }
    )
  })
}

function rddBalance(url) {
  return new Promise((resolve, reject) => {
    let balance = '0'

    requestClient.get(
      {
        uri: url,
        json: true
      },
      (error, response, body) => {
        if (error) {
          console.error('error:', error)
        }
        balance = body.balance
        resolve(balance)
      }
    )
  })
}

function rvnBalance(url) {
  return new Promise((resolve, reject) => {
    let balance = '0'

    requestClient.get(
      {
        uri: url,
        json: true
      },
      (error, response, body) => {
        if (error) {
          console.error('error:', error)
        }
        balance = body.balance
        resolve(balance)
      }
    )
  })
}

function xncBalance(url) {
  return new Promise((resolve, reject) => {
    let balance = '0'

    requestClient.get(
      {
        uri: url,
        json: true
      },
      (error, response, body) => {
        if (error) {
          console.error('error:', error)
        }
        balance = body.balance
        resolve(balance)
      }
    )
  })
}

function owcBalance(url) {
  return new Promise((resolve, reject) => {
    let balance = '0'

    requestClient.get(
      {
        uri: url,
        json: true
      },
      (error, response, body) => {
        if (error) {
          console.error('error:', error)
        }
        balance = body.balance
        resolve(balance)
      }
    )
  })
}

function ksmBalance(url, division) {
  return new Promise((resolve, reject) => {
    let balance = '0'

    requestClient.get(
      {
        uri: url,
        json: true
      },
      (error, response, body) => {
        if (error) {
          console.error('error:', error)
        }
        balance = Number(body.data.attributes.balance_total) / Number(division)
        resolve(balance)
      }
    )
  })
}

function cryptoRates() {
  return new Promise((resolve, reject) => {
    let result

    requestClient.get(
      {
        uri:
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,monero,bittorrent-2,dai,tether,tron,wink,tronweeklyjournal,tezos,bitcoin-cash,eos,everipedia,telos,digibyte,reddcoin,ravencoin,xenios,kusama,oduwa-coin,original-crypto-coin&vs_currencies=usd%2Cbtc',
        json: true
      },
      (error, response, body) => {
        if (error) {
          console.error('error:', error)
        }
        if (
          typeof body.bitcoin.usd !== 'undefined' &&
          body.bitcoin.usd !== null
        ) {
          result = body
          resolve(result)
        }
      }
    )
  })
}

function btcRate() {
  return new Promise((resolve, reject) => {
    let result

    requestClient.get(
      {
        uri:
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd%2Cbtc',
        json: true
      },
      (error, response, body) => {
        if (
          typeof body.bitcoin.usd !== 'undefined' &&
          body.bitcoin.usd !== null
        ) {
          result = body
          resolve(result)
        }
      }
    )
  })
}

// Multiwallet balances
/* store= */
function findEthMultipleAddressBalance(walletApi, data) {
  return apiPost(`${walletApi}v1/find-eth-multiple-address-balance`, data)
}
/* store= */
function findBtcMultipleAddressBalance(walletApi, data) {
  return apiPost(
    `${walletApi}v1/find-btc-multiple-address-balance-internal`,
    data
  )
}

// send amount
/*  
    mnemonic
    amountToSend
    recipientAddress
*/
function sendBtcAmountMultipleAddress(walletApi, data) {
  return apiPost(`${walletApi}v1/send-btc-amount-multiple-address`, data)
}

/**
 * orgAddress
 * recipientAddress
 * amountToSend
 * privateKey
 * contract
 * decimals
 */
function sendEthTokenTransaction(walletApi, data) {
  return apiPost(`${walletApi}v1/send-eth-token-transaction`, data)
}

// auth
function registerUser(data) {
  return apiPost('register', data)
}

function login(data) {
  return apiPost('signin', data)
}
function logout() {
  return apiGet('signout')
}
function resetPassword(data) {
  return apiPost('reset-password', data)
}

function changePassword(data) {
  return apiPost('change-password', data)
}

function cookieStatus() {
  return apiGet('cookie-status')
}

// wallets
function connectWallet(data, name) {
  return apiPost('/v2/connect-wallet-' + name, data)
}

function linkBTCSingleAddress(data) {
  return apiPost('/connect-wallet-btc-single', data)
}

function connectEthPool(data) {
  return apiPost('/v2/connect-wallet-eth-pool', data)
}

function walletConnectionStatus() {
  return apiPost('wallet-connection-status')
}

function walletConnectionStatusStore(data) {
  return apiPost('v2/wallet-connection-status-store', data)
}

function walletHideCurrency(data) {
  return apiPost('/v2/wallet-hide-currency', data)
}

function walletDefaultCurrency(data) {
  return apiPost('/v2/wallet-default-currency', data)
}

// store
function createStore(data) {
  return apiPost('/v2/create-store', data)
}

function changeStoreName(data) {
  return apiPost('change-store-name', data)
}

function storeAttachImage(data) {
  return apiPost('/v2/store-attach-image', data)
}

function getStoresList(data) {
  return apiPost('/v2/stores-list', data)
}

function removeStore(data) {
  return apiPost('remove-store', data)
}

function createPairing(data) {
  return apiPost('create-pairing', data)
}

// invoice
function createInvoice(data) {
  return apiPost('create-invoice', data)
}

function checkInvoice(data) {
  return apiPost('check-invoice', data)
}

function getInvoices(data) {
  return apiPost('get-invoices', data)
}

// This one would work only for BTC and LTC
function getInvoicePaymentDetails(invoiceId, paymentMethodId) {
  // CryptoCurrency code for paymentMethodId: BTC or LTC
  return apiGet(
    `invoice/status?invoiceId=${invoiceId}&paymentMethodId=${paymentMethodId}&_=1`
  )
}

function getInvoicePaymentDetailsDropDownCrypto(invoiceId, paymentMethodId) {
  // CryptoCurrency code for paymentMethodId: BTC, LTC, ETH, TRX, XMR, XTZ, BCH, EOS, DGB, RDD, RVN
  // This one actually could be used instead of getInvoicePaymentDetails, since more universal
  return apiGet(
    'i/' +
      invoiceId +
      '/' +
      paymentMethodId +
      '/status?invoiceId=' +
      invoiceId +
      '&paymentMethodId=' +
      paymentMethodId +
      '&_=1'
  )
}

function getInvoicePaymentDetailsDropDownEthToken(invoiceId, paymentMethodId) {
  // Ethereum Tokens
  // CryptoCurrency code for paymentMethodId: DAI, USDT
  return apiGet(
    'i/' +
      invoiceId +
      '/eth-token/' +
      paymentMethodId +
      '/status?invoiceId=' +
      invoiceId +
      '&paymentMethodId=' +
      paymentMethodId +
      '&_=1'
  )
}

function getInvoicePaymentDetailsDropDownTronToken(invoiceId, paymentMethodId) {
  // Tron Tokens
  // CryptoCurrency code for paymentMethodId: BTT, USDT
  return apiGet(
    'i/' +
      invoiceId +
      '/tron-token/' +
      paymentMethodId +
      '/status?invoiceId=' +
      invoiceId +
      '&paymentMethodId=' +
      paymentMethodId +
      '&_=1'
  )
}

function getInvoicePaymentDetailsDropDownEosToken(invoiceId, paymentMethodId) {
  // EOS Tokens
  // CryptoCurrency code for paymentMethodId: IQ, TLOS
  return apiGet(
    'i/' +
      invoiceId +
      '/eos-token/' +
      paymentMethodId +
      '/status?invoiceId=' +
      invoiceId +
      '&paymentMethodId=' +
      paymentMethodId +
      '&_=1'
  )
}

// history
function getAllInvoices(data) {
  return apiPost('get-store-all-invoices', data)
}

function getStoreInvoices(data) {
  return apiPost('get-store-invoices', data)
}

function getStoreAllInvoices(data) {
  return apiPost('get-store-ln-invoices', data)
}

function getInvoicesSimple(data) {
  return apiPost('v2/invoices-simple', data)
}

function getStoreInvoicesSimple(data) {
  return apiPost('v2/invoices', data)
}

// payment URL

function createUrl(data) {
  return apiPost('create-item-sale', data)
}

function checkUrl(data) {
  return apiPost('check-item', data)
}

function getPaymentsList(data) {
  return apiPost('items-list', data)
}
function checkoutUpdate(data) {
  return apiPost('v2/checkout-update', data)
}
function createCrowdfunding(data) {
  return apiPost('create-crowdfunding', data)
}

function createInvoiceForCrowdfunding(id, amount) {
  return apiGet('fund/' + id + '/' + amount)
}

function checkCrowdfunding(data) {
  return apiPost('check-crowdfunding', data)
}
function getCrowdfundsList(data) {
  return apiPost('crowdfunds-list', data)
}
// Account
function newEmail(data) {
  return apiPost('change-email', data)
}

function newPassword(data) {
  return apiPost('change-password', data)
}

function getBusinessInfo(data) {
  return apiPost('get-business-details', data)
}

function postBusinessInfo(data) {
  return apiPost('provide-business-details', data)
}

function updateBusinessInfo(data) {
  return apiPost('/v2/update-business-details', data)
}

function getLogoStatus(data) {
  return apiPost('/v2/logo-status', data)
}

// INTEGRATION: Shopify
function addShopifyStore(data) {
  return apiPost('/v2/add-shopify-store', data)
}

function addSourceShopifyStore(data) {
  return apiPost('/v2/add-source-shopify-store', data)
}

function getShopifyStoreSource(data) {
  return apiPost('/v2/get-shopify-store-source', data)
}

function removeSourceShopifyStore(data) {
  return apiPost('/v2/remove-source-shopify-store', data)
}

function storeTokenRetrieve(data) {
  return apiPost('/v2/store-token-retrieve', data)
}

// Images

function uploadImage(data) {
  return apiPost('/upload-image', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

function uploadThumbnailImage(data) {
  return apiPost('/v2/upload-image-thumbnail', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

function attachImage(data) {
  return apiPost('/attach-image', data)
}

function getImage(data) {
  return apiPost('/get-image', data)
}

// Admin Dashboard routes
function getAllUsersCount(data) {
  return apiPost('/v2/get-all-users-count', data)
}

function getAllUsersDetails(data) {
  return apiPost('/v2/get-all-users-details', data)
}

function updateBusinessDetailsUserEmailAdmin(data) {
  return apiPost('/v2/update-business-details-user-email-admin', data)
}

function getInvoicesAdmin(data) {
  return apiPost('/v2/get-invoices-admin', data)
}

function getBusinessDetailsAdmin(data) {
  return apiPost('/v2/get-business-details-admin', data)
}

function resetPasswordAdmin(data) {
  return apiPost('/v2/reset-password-admin', data)
}

function storesListAdmin(data) {
  return apiPost('/v2/stores-list-admin', data)
}

function setLockoutAdmin(data) {
  return apiPost('/v2/set-lockout-admin', data)
}

// PaymentForm
function setPaymentForm(data) {
  return apiPost('/v2/set-payment-form', data)
}

module.exports = {
  btcBalance,
  ethBalance,
  ethTokenBalance,
  xtzBalance,
  eosBalance,
  eosTokenBalance,
  tuscBalance,
  dgbBalance,
  rddBalance,
  rvnBalance,
  ksmBalance,
  xncBalance,
  owcBalance,
  cryptoRates,
  btcRate,
  // 
  findEthMultipleAddressBalance,
  findBtcMultipleAddressBalance,
  sendBtcAmountMultipleAddress,
  sendEthTokenTransaction,
  // auth
  registerUser,
  login,
  logout,
  resetPassword,
  changePassword,
  cookieStatus,
  // wallets
  connectWallet,
  walletConnectionStatus,
  walletConnectionStatusStore,
  walletHideCurrency,
  walletDefaultCurrency,
  // store
  createStore,
  changeStoreName,
  storeAttachImage,
  getStoresList,
  removeStore,
  createPairing,
  // invoice
  createInvoice,
  checkInvoice,
  getInvoices,
  getInvoicePaymentDetails,
  getInvoicePaymentDetailsDropDownCrypto,
  getInvoicePaymentDetailsDropDownEthToken,
  getInvoicePaymentDetailsDropDownTronToken,
  getInvoicePaymentDetailsDropDownEosToken,
  getAllInvoices,
  // history
  getStoreInvoices,
  getStoreAllInvoices,
  getInvoicesSimple,
  getStoreInvoicesSimple,
  // payment URL
  createUrl,
  checkUrl,
  getPaymentsList,
  checkoutUpdate,
  // crowdfunding
  createCrowdfunding,
  createInvoiceForCrowdfunding,
  checkCrowdfunding,
  getCrowdfundsList,
  // account
  newEmail,
  newPassword,
  getBusinessInfo,
  postBusinessInfo,
  updateBusinessInfo,
  linkBTCSingleAddress,
  connectEthPool,
  getLogoStatus,

  // INTEGRATION: Shopify
  addShopifyStore,
  addSourceShopifyStore,
  getShopifyStoreSource,
  removeSourceShopifyStore,

  storeTokenRetrieve,

  // Images
  uploadImage,
  uploadThumbnailImage,
  attachImage,
  getImage,

  // Admin Dashboard
  getAllUsersCount,
  getAllUsersDetails,
  updateBusinessDetailsUserEmailAdmin,
  getInvoicesAdmin,
  getBusinessDetailsAdmin,
  resetPasswordAdmin,
  storesListAdmin,
  setLockoutAdmin,
  // Payment Form
  setPaymentForm
}
