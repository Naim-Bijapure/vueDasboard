/** @format */

function addCustomerData({ commit, state }, payload) {
	// console.log("addCustomerData -> payload", payload)

	commit("addTranscactionData", payload);
}

export default {
	addCustomerData,
};
