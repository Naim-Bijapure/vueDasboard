/** @format */

import { shallowMount, createLocalVue, mount } from "@vue/test-utils";
import goodsIn from "@/views/MainDashboard/components/GoodsIn.vue";
import vuex from "vuex";
import Vuetify from "vuetify";
import Vue from "vue";
// import moment from "moment";
import actions from "../../src/views/MainDashboard/Store/actions";
import getters from "../../src/views/MainDashboard/Store/getters";
import mutations from "../../src/views/MainDashboard/Store/mutations";
import { state } from "../../src/views/MainDashboard/Store/state";

// const localVue = createLocalVue();
// localVue.use(vuex);
// localVue.use(Vuetify);
Vue.use(vuex);
Vue.use(Vuetify);

describe("GoodsIn.vue", () => {
	let test_getters, test_actions, test_mutations, store, test_state, vuetify;
	var wrapper; // main component mount here
	beforeEach(() => {
		(test_actions = { ...actions }), (test_getters = { ...getters }), (test_mutations = { ...mutations });

		store = new vuex.Store({ state: state, actions: test_actions, getters: test_getters, mutations: test_mutations });
		vuetify = new Vuetify();

		wrapper = shallowMount(goodsIn, { store, Vue, vuetify });
	});

	describe("ADD A NEW GOODS IN CUSTOMER TRANSCACTION  DATA ", () => {
		it("Should return all customer names", () => {
			const { getCustomersNames } = getters;
			expect(getCustomersNames(state).length).toBeGreaterThan(0);
		});
		it("Should returns the selected customer data", () => {
			const { getCustomerData } = getters;
			let data = { customerId: 1, goodsType: "goods_in" };
			let customerData = getCustomerData(state)(data);

			expect(customerData["customerOverview"].length).toBeGreaterThan(0);
			expect(customerData["customerTransaction"].length).toBeGreaterThan(0);
		});

		it("Should set the data of selected customer ", async () => {
			const { vm } = wrapper;
			let selectedCustomerId = 1;
			wrapper.setData({ openForm: true });
			vm.onSelectCustomer(selectedCustomerId);

			expect(vm.$data.openForm).toBe(true);
			expect(vm.$data.selectedCustomerId).toBe(1);
			expect(vm.customerTransactionData).not.toBe(null);
		});

		it("Should get the form input data", async () => {
			// wrapper = shallowMount(goodsIn, { store, Vue, vuetify });
			const { vm } = wrapper;
			wrapper.setData({ openForm: true });
			expect(vm.$data.date).toBe(new Date().toISOString().substr(0, 10));
			let categoryNames = ["category_1", "category_2"];
			vm.onSelectCategory([...categoryNames]);
			expect(vm.categoryCounts).toContain(...categoryNames);
			let categoryData = {};

			// SETTING  VALUES
			categoryNames.map((categoryName) => {
				if (categoryName == "category_1") {
					categoryData[`count_${categoryName}`] = 10;
					categoryData[`price_${categoryName}`] = 10;
					categoryData[`amount${categoryName}`] =
						categoryData[`count_${categoryName}`] * categoryData[`price_${categoryName}`];
				} else {
					categoryData[`count_${categoryName}`] = 10;
					categoryData[`price_${categoryName}`] = 10;
					categoryData[`amount${categoryName}`] =
						categoryData[`count_${categoryName}`] * categoryData[`price_${categoryName}`];
				}
			});
			let PAID = 10;
			let totalAmount = 0;

			categoryNames.map((categoryName) => {
				vm.onChangeCount(categoryData[`count_${categoryName}`], categoryName); // COUNT INPUT
				expect(vm.categoryData[`count_${categoryName}`]).toBe(categoryData[`count_${categoryName}`]);

				expect(vm.categoryData[`price_${categoryName}`]).toBe(0);
				vm.onChangePrice(categoryData[`price_${categoryName}`], categoryName); // PRICE INPUT
				expect(vm.categoryData[`price_${categoryName}`]).toBe(categoryData[`price_${categoryName}`]);
				expect(vm.categoryData[`amount_${categoryName}`]).toBe(categoryData[`amount${categoryName}`]); // AMOUNT
				totalAmount += categoryData[`amount${categoryName}`];
			});

			wrapper.setData({ paid: PAID });
			wrapper.setData({ note: "cool test" });
			let finalAmount = totalAmount > 0 ? totalAmount - PAID : 0;
			expect(vm.calculateTotalAmount).toBe(finalAmount);
		});
	});

	describe("Add a new Category to Customer Data", () => {
		let customerId = 1;
		let newCategoryName = "category_4";
		let payloadData = { customerId: customerId, category: newCategoryName };

		// ADD CUSTOMER MUTATION
		it("should add new category to customer category array ", () => {
			const { addCategory } = mutations;
			let categories = addCategory(state, payloadData);
			expect(categories).toContain(newCategoryName);
		});

		// GET CUSTOMER CATEGORIES DATA
		it("should gives the categories from customer id ", () => {
			const { getCategories } = getters;
			let categories = getCategories(state)({ customerId });
			expect(categories).toContain(newCategoryName);
		});

		// ADD CUSTOMER METHOD
		it("Should add new category to the customer data", async () => {
			// wrapper = shallowMount(goodsIn, { store, Vue, vuetify });
			const { vm } = wrapper;
			wrapper.setData({ selectedCustomerId: customerId, newCategoryName: newCategoryName });
			expect(await vm.onAddCategory()).toContain(newCategoryName);
		});
	});

	describe("UPDATE A CUSTOMER TRANSCACTION GOODS IN DATA", () => {
		let customerId = 1;
		let categoryName;
		const { updateData } = mutations;

		test("On Edit and update should open pop up for edit data ", async () => {
			wrapper = mount(goodsIn, { store, Vue, vuetify });
			const { vm } = wrapper;
			await vm.onSelectCustomer(customerId);
			let EditTranscactionData = vm.customerTransactionData[0];
			let EditButton = wrapper.find("#Data__Edit-" + customerId);
			await EditButton.trigger("click");
			// AFTER CLICK ON EDIT BUTTON

			expect(vm.Edit_tr_id).toBe(EditTranscactionData["tr_id"]);
			expect(vm.categories).toContain(EditTranscactionData["category"]);
			expect(vm.openForm).toBe(true);
			expect(vm.isEdit).toBe(true);
			expect(vm.date).toBe(EditTranscactionData["date"]);
			expect(vm.selectedCategory).toContain(EditTranscactionData["category"]);

			categoryName = EditTranscactionData["category"];

			expect(vm.categoryData["count_" + categoryName]).toBe(EditTranscactionData["count"]);
			expect(vm.categoryData["price_" + categoryName]).toBe(EditTranscactionData["price"]);
			expect(vm.categoryData["amount_" + categoryName]).toBe(EditTranscactionData["amount"]);
			expect(vm.paid).toBe(EditTranscactionData["paid"]);
			expect(vm.totalAmount).toBe(EditTranscactionData["totalAmount"]);
			expect(vm.note).toBe(EditTranscactionData["note"]);

			expect(vm.categoryCounts).toContain(categoryName);
			//  calling onUpdate method
			const updateDataSpy = jest.spyOn(vm, "updateData");
			const getUpdateDataSpy = jest.spyOn(vm, "getUpdatedData");
			await vm.onUpdate();
			expect(updateDataSpy).toHaveBeenCalled(); // test updateData mutation seperatly
			expect(getUpdateDataSpy).toHaveBeenCalled(); // test updateData mutation seperatly
			//  WHAT SHOULD YOU EXPECT ON UPDATE METHOD ?
			//  expect to be data update
			// expect to be called mutation to update data
			// expect to get latest updated data
		});

		it(" updateData mutation should update the data of goods in type of a customer ", async () => {
			let payload = {
				customerId: 1,
				tr_id: 1,
				type: "goods_in",
				date: "2020-11-11",
				category: "category_1",
				count: 20,
				price: 20,
				amount: 400,
				paid: 0,
				totalAmount: 100,
				note: " updated cool test",
			};
			let updateState = await updateData(state, payload);

			expect(updateState["customers"]).toEqual(state["customers"]);
		});

		it(" shuld delete a record from state  ", async () => {
			wrapper = shallowMount(goodsIn, { store, Vue, vuetify });
			const { vm } = wrapper;
			let deleteDataSpy = jest.spyOn(vm, "deleteData");
			const getUpdateDataSpy = jest.spyOn(vm, "getUpdatedData");
			const confirmDeleteSpy = jest.spyOn(vm, "confirmDelete");
			wrapper.setData({selectedCustomerId:1})
			await vm.onDelete(1);
			expect(vm.toDeleteDialog).toBe(true); 
			let confirmDelete = wrapper.find("#Confirm__delete")
			await confirmDelete.trigger('click')
			expect(confirmDeleteSpy).toHaveBeenCalled(); 
			expect(deleteDataSpy).toHaveBeenCalled();
			expect(getUpdateDataSpy).toHaveBeenCalled(); 
			expect(vm.toDeleteDialog).toBe(false); 
			
			
		});
	});
});
