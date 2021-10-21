# ForgingBlock

ForgingBlock is a peer-to-peer cryptocurrency payment system that facilitates developers in providing infrastructure similar to what is offered within the credit card payment industry. ForgingBlock offers APIs, libraries, and Ecommerce plugins to assist merchants and developers - who are familiar with the credit payment process – in adopting cryptocurrency, L2 networks & stable coins as a payment method with a minimal learning curve and easy adaptability.

The official Node.js library for the [ForgingBlock API](https://api.forgingblock.io/docs/).
npm Links : https://www.npmjs.com/package/forgingblock.js

# Table of contents
   * [Node.js Versions](#node.js-version)
   * [Documentation](#documentation)
   * [Installation](#installation)
   * [Usage](#usage)
      * [Checkouts](#checkouts)
      * [Sales](#sales)
      * [Balances](#balances)

## Node.js versions
Node.js v0.10.48 and above are supported.

## Documentation
For more details visit [ForgingBlock API Docs](https://api.forgingblock.io/docs/).

To start using this library register an account on [ForgingBlock](https://dash.forgingblock.io/).
You will find your ``Trade`` and ``Token`` keys from Settings.

Next initialize a ``Client`` for interacting with the API. The required parameters to initialize a client are ``Trade`` and ``Token``, however, you can also pass in ``baseUrl``, ``apiVersion``  and ``timeout``.
Parameters can be also be set post-initialization:
``` js
var forgingblock = require('forgingblock.js');
var Client = forgingblock.Client;

var clientObj = Client.init(Trade, Token);
clientObj.setRequestTimeout(3000);
```

The API resource class provides the following static methods: ``list, all, create, retrieve, updateById, deleteById``.  Additionally, the API resource class also provides the following instance methods: ``save, delete, insert, update``.

Each API method returns an ``ApiResource`` which represents the JSON response from the API.
When the response data is parsed into objects, the appropriate ``ApiResource`` subclass will automatically be used.


## Installation

Install with ``npm``:
``` sh
npm install forgingblock.js --save
```

## Usage
``` js
var forgingblock = require('forgingblock.js');
var Client = forgingblock.Client;

Client.init(Trade, Token);
```
## Checkouts 
[Checkouts API docs](https://api.forgingblock.io/docs/#item-payment-urls--checkout-)


### Load checkout resource class
``` js
var forgingblock = require('forgingblock.js');
var Checkout = forgingblock.resources.Checkout;
```
### Retrieve
checkout_type is of type string, and can accept either "product" or "donation"
``` js
Checkout.retrieve(<checkout_id>, <checkout_type [product | donation]>, function (error, response) {
  console.log(error);
  console.log(response);
});
```
### Create
checkout_type is of type string, and can accept either "product" or "donation"
``` js
var checkoutData = {
  amount: 550,
  currency: 'usd',
  description: 'Description for the product',
  email: 'test@fastmail.mx',
  count: 2,
  name: 'IPhone'
};

Checkout.create(checkoutData, <checkout_type [product | donation]>,function (error, response) {
  console.log(error);
  console.log(response);
});
```
### Update
``` js
var newParams = {
  description: 'thebesttool',
  name: 'product1',
  count: 12,
  item: '829f8bd302d0f2b24e8fe9b6d23ad494' // item or fund id is required
};

Checkout.update(<checkout_id>, newParams, function (error, response) {
  console.log(error);
  console.log(response);
});
```

### Get all checkouts
``` js
Checkout.all({}, function (error, list) {
  console.log(error);
  console.log(list);
});
```
## Sales
[Sales API docs](https://api.forgingblock.io/docs/#invoices-history)

### Load Sale resource class
``` js
var forgingblock = require('forgingblock.js');
var Sale = forgingblock.resources.Sale;
```
### Retrieve
``` js
Sale.retrieve(<invoiceId>, function (error, response) {
  console.log(error);
  console.log(response);
});
```

### Get all sales
``` js
Sale.all({}, function (error, response) {
  console.log(error);
  console.log(response);
});
```
// OR you can pass the status parameter to get only the paid invoices
``` js
Sale.all({ status: 'paid' }, function (error, response) {
  console.log(error);
  console.log(response);
});
```

## Balances

### Load event resource class
``` js
var forgingblock = require('forgingblock.js');
var Balance = forgingblock.resources.Balance;
```

### Get all balances
If you are using `Single Wallet` connection in your dashboard, you can simply call the `all` method and that will give you all the balances
``` js
Balance.all({}, function (error, list) {
  console.log(error);
  console.log(list);
});
```

If you are using `Multi Wallet` settings, you have to pass that multiwallet flag as below
``` js
Balance.all({ multiwallet: true }, function (error, list) {
  console.log(error);
  console.log(list);
});
```


License
----

MIT
