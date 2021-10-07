var resources = {
	Sale: require('./lib/Resources/Sale'),
	Checkout: require('./lib/Resources/Checkout'),
	Balance: require('./lib/Resources/Balance')
};

module.exports = {
	Client: require('./lib/Client'),
	resources: resources,
};
