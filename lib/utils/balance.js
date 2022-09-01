const debounce = require('lodash').debounce
const ethers = require('ethers')
const Client = require('../Client')
const api = require('../api')

let wallets = {}

async function getAllBalancesSingleWallet(cb) {
    const clientObj = Client.getInstance()

    const fiatBalances = {}

    let connectWallet = {}
    let ethTokens = {}
    let eosTokens = {}
    let trxTokens = {}

    await api
        .walletConnectionStatusStore()
        .then(async connectedWallet => {
            //console.log('connectedWallet')
            const cloudflareCorsProxy =
                'https://white-mud-e962.forgingblock.workers.dev/corsproxy/?apiurl='
            // If there would be more CORS issues, just add cloudflareCorsProxy
            let btcApi
            let ethApi
            let xtzApi
            let eosApi
            let rvnApi
            const dgbApi = cloudflareCorsProxy + 'https://dgb.ccore.online'
            const rddApi = cloudflareCorsProxy + 'https://live.reddcoin.com/api'
            const ksmApi = 'https://explorer-31.polkascan.io/kusama/api/v1'
            const owcApi = cloudflareCorsProxy + 'http://oduwaexplorer.com'
            const xncApi =
                cloudflareCorsProxy + 'http://blockexplorer.xenioscoin.com'
            const tuscApi = 'https://elasticsearch.tusc.network'

            //console.log(clientObj.getBaseApiUrl())
            if (clientObj.getBaseApiUrl() === 'https://api.forgingblock.io/') {
                btcApi = 'https://blockstream.info/api'
                ethApi = 'https://api.etherscan.io/api'
                xtzApi = 'https://api.tzstats.com'
                eosApi = cloudflareCorsProxy + 'https://eos.greymass.com/v1'
                rvnApi = cloudflareCorsProxy + 'https://ravencoin.network/api'
            } else if (clientObj.getBaseApiUrl() === 'https://api.betcoinpay.com/') {
                btcApi = 'https://blockstream.info/api'
                ethApi = 'https://api.etherscan.io/api'
                xtzApi = 'https://api.tzstats.com'
                eosApi = cloudflareCorsProxy + 'https://eos.greymass.com/v1'
                rvnApi = cloudflareCorsProxy + 'https://ravencoin.network/api'
            } else {
                btcApi = 'https://blockstream.info/testnet/api'
                ethApi = 'https://api-rinkeby.etherscan.io/api'
                xtzApi = 'https://api.babylonnet.tzstats.com'
                eosApi = cloudflareCorsProxy + 'https://api.jungle.alohaeos.com/v1'
                rvnApi =
                    cloudflareCorsProxy + 'https://testnet.ravencoin.network/api'
            }
            const result = await api.cryptoRates()

            if (result) {
                fiatBalances['btc'] = result['bitcoin']
                fiatBalances['eth'] = result['ethereum']
                fiatBalances['usdt'] = result['tether']
                fiatBalances['dai'] = result['dai']
                fiatBalances['xtz'] = result['tezos']
                fiatBalances['eos'] = result['eos']
                fiatBalances['iq'] = result['everipedia']
                fiatBalances['dgb'] = result['digibyte']
                fiatBalances['rdd'] = result['reddcoin']
                fiatBalances['rvn'] = result['ravencoin']
                fiatBalances['ksm'] = result['kusama']
                fiatBalances['xnc'] = result['xenios']
                fiatBalances['owc'] = result['oduwa-coin']
                fiatBalances['tusc'] = result['original-crypto-coin']
            }
            try {
                if (
                    typeof connectedWallet.btc !== 'undefined' &&
                    connectedWallet.btc.length > 0 &&
                    connectedWallet.btc[0].address
                ) {
                    connectWallet.btc = connectedWallet.btc[0].address
                    api
                        .btcBalance(btcApi + '/address/' + connectWallet.btc)
                        .then(balance => {
                            if (balance === undefined) balance = 0
                            setWalletBalance('Bitcoin', 'btc', balance)
                        })
                }
            } catch (err) {
                console.log('error', err)
            }
            try {
                if (
                    typeof connectedWallet.eth !== 'undefined' &&
                    connectedWallet.eth.length > 0
                ) {
                    connectWallet.eth = connectedWallet.eth[0].address
                    api
                        .ethBalance(
                            ethApi +
                            '?module=account&action=balance&address=' +
                            connectWallet.eth +
                            '&tag=latest&apikey=V1Q4166HESUUEU2VJ75E6KR13KRGPGIHVR'
                        )
                        .then(balance => {
                            if (balance === undefined) balance = 0
                            setWalletBalance('Ethereum', 'eth', balance)
                        })
                }
            } catch (err) {
                console.log('error', err)
            }
            try {
                if (
                    typeof connectedWallet.bch !== 'undefined' &&
                    connectedWallet.bch.length > 0
                ) {
                    connectWallet.bch = connectedWallet.bch[0].xpub
                }
            } catch (err) {
                console.log('error', err)
            }
            try {
                if (
                    typeof connectedWallet.dgb !== 'undefined' &&
                    connectedWallet.dgb.length > 0
                ) {
                    connectWallet.dgb = connectedWallet.dgb[0].address
                    api
                        .dgbBalance(
                            dgbApi + '/ext/getaddress/' + connectWallet.dgb
                        )
                        .then(balance => {
                            if (balance === undefined) balance = 0
                            setWalletBalance('DigiByte', 'dgb', balance)
                        })
                }
            } catch (err) {
                console.log('error', err)
            }
            try {
                if (
                    typeof connectedWallet.rdd !== 'undefined' &&
                    connectedWallet.rdd.length > 0
                ) {
                    connectWallet.rdd = connectedWallet.rdd[0].address
                    api
                        .dgbBalance(rddApi + '/addr/' + connectWallet.rdd)
                        .then(balance => {
                            if (balance === undefined) balance = 0
                            setWalletBalance('Reddcoin', 'rdd', balance)
                        })
                }
            } catch (err) {
                console.log('error', err)
            }
            try {
                if (
                    typeof connectedWallet.rvn !== 'undefined' &&
                    connectedWallet.rvn.length > 0
                ) {
                    connectWallet.rvn = connectedWallet.rvn[0].address
                    api
                        .rvnBalance(rvnApi + '/addr/' + connectWallet.rvn)
                        .then(balance => {
                            if (balance === undefined) balance = 0
                            setWalletBalance('Ravencoin', 'rvn', balance)
                        })
                }
            } catch (err) {
                console.log('error', err)
            }
            try {
                if (
                    typeof connectedWallet.ksm !== 'undefined' &&
                    connectedWallet.ksm.length > 0
                ) {
                    connectWallet.ksm = connectedWallet.ksm[0].address
                    api
                        .ksmBalance(
                            ksmApi + '/account/' + connectWallet.ksm,
                            1000000000000
                        )
                        .then(balance => {
                            if (balance === undefined) balance = 0
                            setWalletBalance('Kusama', 'ksm', balance)
                        })
                }
            } catch (err) {
                console.log('error', err)
            }
            try {
                if (
                    typeof connectedWallet.xnc !== 'undefined' &&
                    connectedWallet.xnc.length > 0
                ) {
                    connectWallet.xnc = connectedWallet.xnc[0].address
                    api
                        .xncBalance(
                            xncApi + '/ext/getaddress/' + connectWallet.xnc
                        )
                        .then(balance => {
                            if (balance === undefined) balance = 0
                            setWalletBalance('XeniosCoin', 'xns', balance)
                        })
                }
            } catch (err) {
                console.log('error', err)
            }
            try {
                if (
                    typeof connectedWallet.owc !== 'undefined' &&
                    connectedWallet.owc.length > 0
                ) {
                    connectWallet.owc = connectedWallet.owc[0].address
                    api
                        .owcBalance(
                            owcApi + '/ext/getaddress/' + connectWallet.owc
                        )
                        .then(balance => {
                            if (balance === undefined) balance = 0
                            setWalletBalance('Oduwa Coin', 'owc', balance)
                        })
                }
            } catch (err) {
                console.log('error', err)
            }
            try {
                if (
                    typeof connectedWallet.xtz !== 'undefined' &&
                    connectedWallet.xtz.length > 0
                ) {
                    connectWallet.xtz = connectedWallet.xtz[0].address
                    api
                        .xtzBalance(
                            xtzApi + '/explorer/account/' + connectWallet.xtz
                        )
                        .then(balance => {
                            if (balance === undefined) balance = 0
                            setWalletBalance('Tezos', 'xtz', balance)
                        })
                }
            } catch (err) {
                console.log('error', err)
            }
            try {
                if (
                    typeof connectedWallet.eos !== 'undefined' &&
                    connectedWallet.eos.length > 0
                ) {
                    connectWallet.eos = connectedWallet.eos[0].address
                    api
                        .eosBalance(
                            eosApi + '/chain/get_account',
                            connectWallet.eos
                        )
                        .then(balance => {
                            if (balance === undefined) balance = 0
                            setWalletBalance('EOS', 'eos', balance)
                        })
                }
            } catch (err) {
                console.log('error', err)
            }
            try {
                if (
                    typeof connectedWallet.tusc !== 'undefined' &&
                    connectedWallet.tusc.length > 0
                ) {
                    connectWallet.tusc = connectedWallet.tusc[0].address
                    api
                        .tuscBalance(
                            tuscApi + '/full_account?account_id=',
                            connectWallet.tusc
                        )
                        .then(balance => {
                            if (balance === undefined) balance = 0
                            setWalletBalance('TUSC', 'tusc', balance)
                        })
                }
            } catch (err) {
                console.log('error', err)
            }
            try {
                if (
                    typeof connectedWallet.xmr !== 'undefined' &&
                    connectedWallet.xmr.length > 0
                ) {
                    connectWallet.xmr = connectedWallet.xmr[0].viewkey
                }
            } catch (err) {
                console.log('error', err)
            }
            try {
                if (
                    typeof connectedWallet.ethTokens !== 'undefined' &&
                    connectedWallet.ethTokens.length > 0
                ) {
                    try {
                        if (
                            typeof connectedWallet.ethTokens[0] !== 'undefined' &&
                            connectedWallet.ethTokens[0] !== null
                        ) {
                            try {
                                if (connectedWallet.ethTokens[0].name === 'DAI') {
                                    ethTokens.dai = connectedWallet.ethTokens[0].address
                                    api
                                        .ethTokenBalance(
                                            ethApi +
                                            '?module=account&action=tokenbalance&address=' +
                                            ethTokens.dai +
                                            '&contractaddress=' +
                                            '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359' +
                                            '&apikey=V1Q4166HESUUEU2VJ75E6KR13KRGPGIHVR',
                                            1000000000000000000
                                        )
                                        .then(balance => {
                                            if (balance === undefined) balance = 0
                                            setWalletBalance('DAI', 'dai', balance)
                                        })
                                }
                            } catch (err) {
                                console.log('error', err)
                            }
                            try {
                                if (connectedWallet.ethTokens[0].name === 'USDT') {
                                    ethTokens.usdt = connectedWallet.ethTokens[0].address
                                    api
                                        .ethTokenBalance(
                                            ethApi +
                                            '?module=account&action=tokenbalance&address=' +
                                            ethTokens.usdt +
                                            '&contractaddress=' +
                                            '0xdac17f958d2ee523a2206206994597c13d831ec7' +
                                            '&apikey=V1Q4166HESUUEU2VJ75E6KR13KRGPGIHVR',
                                            1000000
                                        )
                                        .then(balance => {
                                            if (balance === undefined) balance = 0
                                            setWalletBalance('USDT', 'usdt', balance)
                                        })
                                }
                            } catch (err) {
                                console.log('error', err)
                            }
                        }
                    } catch (err) {
                        console.log('error', err)
                    }
                    try {
                        if (
                            connectedWallet.ethTokens[1] !== undefined &&
                            connectedWallet.ethTokens[1] !== null
                        ) {
                            try {
                                if (connectedWallet.ethTokens[1].name === 'DAI') {
                                    ethTokens.dai = connectedWallet.ethTokens[1].address
                                    api
                                        .ethTokenBalance(
                                            ethApi +
                                            '?module=account&action=tokenbalance&address=' +
                                            ethTokens.dai +
                                            '&contractaddress=' +
                                            '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359' +
                                            '&apikey=V1Q4166HESUUEU2VJ75E6KR13KRGPGIHVR',
                                            1000000000000000000
                                        )
                                        .then(balance => {
                                            if (balance === undefined) balance = 0
                                            setWalletBalance('DAI', 'dai', balance)
                                        })
                                }
                            } catch (err) {
                                console.log('error', err)
                            }
                            try {
                                if (connectedWallet.ethTokens[1].name === 'USDT') {
                                    ethTokens.usdt = connectedWallet.ethTokens[1].address
                                    api
                                        .ethTokenBalance(
                                            ethApi +
                                            '?module=account&action=tokenbalance&address=' +
                                            ethTokens.usdt +
                                            '&contractaddress=' +
                                            '0xdac17f958d2ee523a2206206994597c13d831ec7' +
                                            '&apikey=V1Q4166HESUUEU2VJ75E6KR13KRGPGIHVR',
                                            1000000
                                        )
                                        .then(balance => {
                                            if (balance === undefined) balance = 0
                                            setWalletBalance('USDT', 'usdt', balance)
                                        })
                                }
                            } catch (err) {
                                console.log('error', err)
                            }
                        }
                    } catch (err) {
                        console.log('error', err)
                    }
                }
            } catch (err) {
                console.log('error', err)
            }
            try {
                if (
                    typeof connectedWallet.eosTokens !== 'undefined' &&
                    connectedWallet.eosTokens.length > 0
                ) {
                    try {
                        if (
                            typeof connectedWallet.eosTokens[0] !== 'undefined' &&
                            connectedWallet.eosTokens[0] !== null
                        ) {
                            try {
                                if (connectedWallet.eosTokens[0].name === 'IQ') {
                                    eosTokens.iq = connectedWallet.eosTokens[0].address
                                    api
                                        .eosTokenBalance(
                                            eosApi + '/chain/get_currency_balance',
                                            eosTokens.iq,
                                            'everipediaiq',
                                            'IQ'
                                        )
                                        .then(balance => {
                                            if (balance === undefined) balance = 0
                                            setWalletBalance('Everipedia', 'iq', balance)
                                        })
                                }
                            } catch (err) {
                                console.log('error', err)
                            }
                            try {
                                if (connectedWallet.eosTokens[0].name === 'TLOS') {
                                    eosTokens.tlos = connectedWallet.eosTokens[0].address
                                }
                            } catch (err) {
                                console.log('error', err)
                            }
                        }
                    } catch (err) {
                        console.log('error', err)
                    }
                    try {
                        if (
                            typeof connectedWallet.eosTokens[1] !== 'undefined' &&
                            connectedWallet.eosTokens[1] !== null
                        ) {
                            try {
                                if (connectedWallet.eosTokens[1].name === 'IQ') {
                                    eosTokens.iq = connectedWallet.eosTokens[1].address
                                    api
                                        .eosTokenBalance(
                                            eosApi + '/chain/get_currency_balance',
                                            eosTokens.iq,
                                            'everipediaiq',
                                            'IQ'
                                        )
                                        .then(balance => {
                                            if (balance === undefined) balance = 0
                                            setWalletBalance('Everipedia', 'iq', balance)
                                        })
                                }
                            } catch (err) {
                                console.log('error', err)
                            }
                            try {
                                if (connectedWallet.eosTokens[1].name === 'TLOS') {
                                    eosTokens.tlos = connectedWallet.eosTokens[1].address
                                }
                            } catch (err) {
                                console.log('error', err)
                            }
                        }
                    } catch (err) {
                        console.log('error', err)
                    }
                }
            } catch (err) {
                console.log('error', err)
            }
            try {
                if (
                    typeof connectedWallet.trx !== 'undefined' &&
                    connectedWallet.trx.length > 0
                ) {
                    connectWallet.trx = connectedWallet.trx[0].address
                }
            } catch (err) {
                console.log('error', err)
            }
            try {
                if (
                    typeof connectedWallet.trxTokens !== 'undefined' &&
                    connectedWallet.trxTokens.length > 0
                ) {
                    try {
                        if (
                            typeof connectedWallet.trxTokens[0] !== 'undefined' &&
                            connectedWallet.trxTokens[0] !== null
                        ) {
                            try {
                                if (connectedWallet.trxTokens[0].name === 'BTT') {
                                    trxTokens.btt = connectedWallet.trxTokens[0].address
                                }
                            } catch (err) {
                                console.log('error', err)
                            }
                            try {
                                if (connectedWallet.trxTokens[0].name === 'USDT') {
                                    trxTokens.usdt = connectedWallet.trxTokens[0].address
                                }
                            } catch (err) {
                                console.log('error', err)
                            }
                        }
                    } catch (err) {
                        console.log('error', err)
                    }
                    try {
                        if (
                            typeof connectedWallet.trxTokens[1] !== 'undefined' &&
                            connectedWallet.trxTokens[1] !== null
                        ) {
                            try {
                                if (connectedWallet.trxTokens[1].name === 'BTT') {
                                    trxTokens.btt = connectedWallet.trxTokens[1].address
                                }
                            } catch (err) {
                                console.log('error', err)
                            }
                            try {
                                if (connectedWallet.trxTokens[1].name === 'USDT') {
                                    trxTokens.usdt = connectedWallet.trxTokens[1].address
                                }
                            } catch (err) {
                                console.log('error', err)
                            }
                        }
                    } catch (err) {
                        console.log('error', err)
                    }
                    try {
                        if (
                            typeof connectedWallet.trxTokens[2] !== 'undefined' &&
                            connectedWallet.trxTokens[2] !== null
                        ) {
                            try {
                                if (connectedWallet.trxTokens[2].name === 'BTT') {
                                    trxTokens.btt = connectedWallet.trxTokens[2].address
                                }
                            } catch (err) {
                                console.log('error', err)
                            }
                            try {
                                if (connectedWallet.trxTokens[2].name === 'USDT') {
                                    trxTokens.usdt = connectedWallet.trxTokens[2].address
                                }
                            } catch (err) {
                                console.log('error', err)
                            }
                        }
                    } catch (err) {
                        console.log('error', err)
                    }
                    try {
                        if (
                            typeof connectedWallet.trxTokens[3] !== 'undefined' &&
                            connectedWallet.trxTokens[3] !== null
                        ) {
                            try {
                                if (connectedWallet.trxTokens[3].name === 'BTT') {
                                    trxTokens.btt = connectedWallet.trxTokens[3].address
                                }
                            } catch (err) {
                                console.log('error', err)
                            }
                            try {
                                if (connectedWallet.trxTokens[3].name === 'USDT') {
                                    trxTokens.usdt = connectedWallet.trxTokens[3].address
                                }
                            } catch (err) {
                                console.log('error', err)
                            }
                        }
                    } catch (err) {
                        console.log('error', err)
                    }
                    try {
                        if (
                            typeof connectedWallet.trxTokens[4] !== 'undefined' &&
                            connectedWallet.trxTokens[4] !== null
                        ) {
                            try {
                                if (connectedWallet.trxTokens[4].name === 'BTT') {
                                    trxTokens.btt = connectedWallet.trxTokens[4].address
                                }
                            } catch (err) {
                                console.log('error', err)
                            }
                            try {
                                if (connectedWallet.trxTokens[4].name === 'USDT') {
                                    trxTokens.usdt = connectedWallet.trxTokens[4].address
                                }
                            } catch (err) {
                                console.log('error', err)
                            }
                        }
                    } catch (err) {
                        console.log('error', err)
                    }
                    try {
                        if (
                            typeof connectedWallet.trxTokens[5] !== 'undefined' &&
                            connectedWallet.trxTokens[5] !== null
                        ) {
                            try {
                                if (connectedWallet.trxTokens[5].name === 'BTT') {
                                    trxTokens.btt = connectedWallet.trxTokens[5].address
                                }
                            } catch (err) {
                                console.log('error', err)
                            }
                            try {
                                if (connectedWallet.trxTokens[5].name === 'USDT') {
                                    trxTokens.usdt = connectedWallet.trxTokens[5].address
                                }
                            } catch (err) {
                                console.log('error', err)
                            }
                        }
                    } catch (err) {
                        console.log('error', err)
                    }
                }
            } catch (err) {
                console.log('error', err)
            }
        }).catch(error => {
            console.error(error)
        })

    const debounced_setBalances = debounce(() => {
        cb(wallets)
    }, 1000)

    function setWalletBalance(name, ticker, balance) {
        wallets[ticker] = {
            name,
            ticker: ticker.toUpperCase(),
            balance,
            balanceFiat: Number(fiatBalances[ticker]['usd']) * Number(balance)
        }
        debounced_setBalances()
    }

}


async function getAllBalancesMultiWallet(cb) {
	let walletApi

	const clientObj = Client.getInstance()
	if (clientObj.getBaseApiUrl() === 'https://api.forgingblock.io/') {
		walletApi = 'https://wallet-api.forgingblock.io/'
	} else {
		walletApi = 'https://wallet-api-demo.forgingblock.io/'
	}

	const btc = await api.findBtcMultipleAddressBalance(walletApi, {})
	const eth = await api.findEthMultipleAddressBalance(walletApi, {})

	const balances = multiWalletBalanceSum(btc, eth)
	
	cb(balances)

}

const multiWalletBalanceSum = (btc, eth) => {
  const ethSum = getEthSum(eth)
  const btcSum = getBtcSum(btc)

  return {
    ...ethSum,
    ...btcSum
  }
}

const getEthSum = eth => {
  const ethBalances = {
    eth: 0,
    ethTokensUsdt: 0,
    ethTokensDai: 0
  }

  for (const i in eth) {
    ethBalances['eth'] += parseFloat(
      eth[i]['0x0000000000000000000000000000000000000000']
    )

    if (eth[i]['0xdac17f958d2ee523a2206206994597c13d831ec7']) {
      ethBalances['ethTokensUsdt'] += parseFloat(
        eth[i]['0xdac17f958d2ee523a2206206994597c13d831ec7']
      )
    }

    if (eth[i]['0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359']) {
      ethBalances['ethTokensDai'] += parseFloat(
        eth[i]['0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359']
      )
    }
  }

  ethBalances['eth'] = ethers.utils.formatEther(ethBalances['eth'].toString())

  // TODO: formatEther for other two tokens?
  return ethBalances
}

const getBtcSum = btc => {
  // TODO: get btc balances for multiwallet
  btc = btc.reduce(
    (acc, current) =>
      acc + parseFloat(current.confirmed) + parseFloat(current.unconfirmed),
    0
  )

  return { btc }
}

module.exports = {
    getAllBalancesSingleWallet,
    getAllBalancesMultiWallet
}