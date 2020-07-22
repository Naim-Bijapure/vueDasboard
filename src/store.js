/** @format */

import Vue from "vue";
import Vuex from "vuex";
import getters from "./views/MainDashboard/Store/getters";
import mutations from "./views/MainDashboard/Store/mutations";
import actions from "./views/MainDashboard/Store/actions";
import {state} from "./views/MainDashboard/Store/state";

Vue.use(Vuex);

export default new Vuex.Store({
	state: state,

	getters: {
		...getters,
	},
	mutations: {
		SET_BAR_IMAGE(state, payload) {
			state.barImage = payload;
		},
		SET_DRAWER(state, payload) {
			state.drawer = payload;
		},
		...mutations,
	},
	actions: {
		...actions,
	},
});
