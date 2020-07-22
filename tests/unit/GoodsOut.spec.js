/** @format */

import { shallowMount, createLocalVue, mount, config } from "@vue/test-utils";
import GoodsOut from "@/views/MainDashboard/components/GoodsOut.vue";
import vuex from "vuex";
import Vuetify from "vuetify";
import Vue from "vue";
// import moment from "moment";
import actions from "../../src/views/MainDashboard/Store/actions";
import getters from "../../src/views/MainDashboard/Store/getters";
import mutations from "../../src/views/MainDashboard/Store/mutations";
import { state } from "../../src/views/MainDashboard/Store/state";
import { InputTo, ClickTo } from "./utility";

// import {AddInput} from "./utility";

// const localVue = createLocalVue();
// localVue.use(vuex);
// localVue.use(Vuetify);
Vue.use(vuex);
Vue.use(Vuetify);
config.silent = true;

describe("GOODS OUT ", () => {
  let store, wrapper, vuetify;

  beforeEach(() => {
    store = new vuex.Store({ state: state, actions: { ...actions }, getters: { ...getters }, mutations: { ...mutations } });
    vuetify = new Vuetify();

    wrapper = mount(GoodsOut, { store, Vue, vuetify });
  });

  describe("SELECT A CUSTOMER FROM SELECT BOX AND LOAD ITS DATA ", () => {
    let customer = { id: 1, name: "customer_1" };

    it("should  select customer and load its data", async () => {
      const { vm } = wrapper;
      let names = await vm.getCustomersNames;
      expect(names).toContainEqual(customer);

      let selectCustomer = wrapper.find(".v-select__slot > .v-select__selections > input");
      selectCustomer.element.value = customer["id"];
      await selectCustomer.trigger("input");
      let seletedCustomer = +vm.$data.selectedCustomer;
      expect(seletedCustomer).toBe(customer["id"]);
      expect(vm.customerTransactionData).toBeTruthy();
      wrapper.destroy();
    });

    it("should add the goods out data to form fields", async () => {
      wrapper = mount(GoodsOut, { store, Vue, vuetify });
      const { vm } = wrapper;

      // what should i expect ?

      wrapper.setData({ panelIndex: 0 }); // expanding first panle
      let oldEditedItem = { ...vm.editedItem };
      // SELECTED THE FRIST CUSTOMER
      let customerSelect = await wrapper.find("#customerSelect");
      customerSelect.element.value = 1;
      customerSelect.trigger("input"); // first selected customer from select combo
      expect(+vm.selectedCustomer).toBe(1);

      await ClickTo(wrapper, "#GoodsOut__ExpansionPanel");
      let panelIndex = vm.$data.panelIndex;

      // 1. ADD NEW ENTRY BUTTON IS CLICKED
      await ClickTo(wrapper, "#GoodsOut__ExpansionPanel--AddEntry");

      // 2. DATA IS ADDED IN THE FORM FIELDS
      let newEditedItem = vm.editedItem;
      expect(oldEditedItem.price).not.toEqual(newEditedItem.price);

      // 3. FORM FIELDS OF AMOUNT AND FINAL AMOUNT IS CALCULATED

      await InputTo(wrapper, "#goodsOut__Count", 10);
      expect(+newEditedItem.count).toEqual(10);

      // B. NEED TO UPDAT THE AMOUNT FIELD
      expect(vm.amount).toBe(100); // here price is 10 and we added count 10

      await InputTo(wrapper, "#goodsOut__Paid", 10);

      expect(vm.finalAmount).toBe(90);
      wrapper.destroy();
    });

    // MUTATION ADD GOOD SOUT
    it("addGoodsOut  shold add the data to the state and update  ", async () => {
      const { addGoodsOut } = mutations;
      // what should i except from this mutation ?
      // 1. it should update the state with goods out data
      let randomNumber = Math.random() * 1000 + 1;

      let payload = {
        customerId: 1,
        goodsOut_tr_id: randomNumber,
        type: "goods_out",
        date: "2020-10-12",
        category: "category_1",
        count: 5,
        price: 10,
        amount: 50,
        paid: 0,
        totalAmount: 100,
        note: "cool ",
      };
      addGoodsOut(state, payload);
      expect(state.customers[0]["tranScactionData"][0]["tranScactionDataOut"].length).toBeGreaterThan(1);
    });

    // mutation deleteGoodsOut
    it("should delete the data and update the previous values ", () => {
      const { deleteGoodsOut } = mutations;

      let payload = {
        customerId: 1,
        category: "category_1",
        goodsOut_tr_id: 1,
      };
      let deletedState = deleteGoodsOut(state, payload);
      expect(state.customers[0]["tranScactionData"][0]["tranScactionDataOut"]).toEqual([]);
      expect(state.customers[0]["tranScactionData"][0]["count"]).toBe(10); // deleted count is added back to main category count
    });

    // mutation updateGoodsOut
    it.only("should update the data of goods out", () => {
      const { updateGoodsOut } = mutations;
      let payload = {
        customerId: 1,
        category: "category_1",
        goodsIn_tr_id: 1,
        goodsOut_tr_id: 1,
        oldCount: 5,
        newcount: 3,
        oldAmount: 50,
        newAmount: 30,
      };
      //  what should i expect from this update goods data mutation?
      // 1. it updates the goods out data
      // 2. it updates main category goods in state count and amount
      let updatedData = updateGoodsOut(state, payload);
      updatedData = updatedData.customers.filter((obj) => obj["customerId"] == 1);
      expect(updatedData[0]["tranScactionData"][0]["count"]).toBe(7);
      expect(updatedData[0]["tranScactionData"][0]["amount"]).toBe(70);
    });
  });
});
