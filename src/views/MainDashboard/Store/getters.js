/** @format */

//  RETURNS CUSTOEMRS NAME

function getCustomersNames(state) {
	let customersNames = [];
	state.customers.map((obj) => {
		customersNames.push({ id: obj["customerId"], name: obj["customerName"] });
	});
	return customersNames;
}

//  TO GET PER CUSTOMER DATA
function getCustomerData(state) {
	return (payload) => {
		let customerOverview = state.customers.filter((obj) => obj["customerId"] == payload["customerId"]);
		let customerTransaction = customerOverview[0]["tranScactionData"].filter((obj) => obj["type"] == payload["goodsType"]);
		// TODO:RETURN A SIGNLE OBJECT INSTEAD OF ARRAY
		return { customerOverview, customerTransaction };
	};
}

function getCategories(state) {
	return (payload) => {
		const { customerId } = payload;
		let selectedCustomer = state.customers.filter((obj) => obj["customerId"] == customerId);
		return selectedCustomer[0]["categories"];
	};
}

export default {
	getCustomersNames,
	getCustomerData,
	getCategories,
};
