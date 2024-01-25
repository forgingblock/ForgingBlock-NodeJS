const ethers = require('ethers')
const Client = require('../Client')
const api = require('../api')

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
    ethTokensDai: 0,
    ethTokensLusd: 0
  }

  for (const i in eth) {
    ethBalances['eth'] += parseFloat(
      eth[i]['0x0000000000000000000000000000000000000000']
    )

    if (eth[i]['0x6b175474e89094c44da98b954eedeac495271d0f']) {
          ethBalances['ethTokensDai'] += parseFloat(
              eth[i]['0x6b175474e89094c44da98b954eedeac495271d0f']
          )
    }

    if (eth[i]['0x5f98805a4e8be255a32880fdec7f6728c6568ba0']) {
          ethBalances['ethTokensLusd'] += parseFloat(
              eth[i]['0x5f98805a4e8be255a32880fdec7f6728c6568ba0']
          )
    }
  }

    ethBalances['eth'] = ethers.utils.formatEther(ethBalances['eth'].toString())
    ethBalances['ethTokensUsdt'] = ethers.utils.formatUnits(
        ethBalances['ethTokensUsdt'].toString(),
        6
    )
    ethBalances['ethTokensDai'] = ethers.utils.formatUnits(
        ethBalances['ethTokensDai'].toString(),
        18
    )
    ethBalances['ethTokensLusd'] = ethers.utils.formatUnits(
        ethBalances['ethTokensLusd'].toString(),
        18
    )

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
    getAllBalancesMultiWallet
}