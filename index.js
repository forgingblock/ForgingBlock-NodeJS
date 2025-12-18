var resources = {
	Sale: require('./lib/Resources/Sale'),
	Checkout: require('./lib/Resources/Checkout')
};

module.exports = {
	Client: require('./lib/Client'),
	resources: resources,
};
