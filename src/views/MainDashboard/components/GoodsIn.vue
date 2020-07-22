<!-- @format -->

<template>
  <div>
    <v-container fluid class="goodsIn">
      <v-row class="goodsIn__selectBar">
        <!-- select option -->
        <v-col class="goodsIn__select">
          <v-select
            id="customer-select"
            :items="getCustomersNames"
            item-value="id"
            item-text="name"
            label="Select A Customer"
            outlined
            @change="onSelectCustomer($event)"
            v-model="selectedCustomer"
          ></v-select>
        </v-col>

        <!-- Add button -->
        <v-col class="goodsIn__addData">
          <v-btn v-if="customerTransactionData" @click="openForm = true" outlined large fab color="indigo">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <!-- table  body  -->
      <v-card>
        <v-simple-table v-if="customerTransactionData">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  Date
                </th>
                <th class="text-left">
                  Category
                </th>
                <th class="text-left">
                  Count
                </th>
                <th class="text-left">
                  Price
                </th>
                <th class="text-left">
                  Amount
                </th>
                <th class="text-left">
                  Paid
                </th>
                <th class="text-left">
                  Total Amount
                </th>
                <th class="text-left">
                  Edit
                </th>
                <th class="text-left">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in customerTransactionData" :key="item.goodsIn_tr_id">
                <td>
                  {{ item.date }}
                </td>
                <td>
                  {{ item.category }}
                </td>
                <td>
                  {{ item.count }}
                </td>
                <td>
                  {{ item.price }}
                </td>
                <td>
                  {{ item.amount }}
                </td>
                <td>
                  {{ item.paid }}
                </td>
                <td>
                  {{ item.totalAmount }}
                </td>
                <td>
                  <v-btn :id="'Data__Edit-' + item.goodsIn_tr_id" @click="onEdit(item)" outlined small fab color="indigo">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </td>

                <td>
                  <v-btn @click="onDelete(item.goodsIn_tr_id)" outlined small fab color="indigo">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </v-container>

    <!-- INPUT FORM DIALOG -->

    <v-dialog v-model="openForm" max-width="700" :persistent="true">
      <v-card>
        <v-card-title class="headline">Enter Details</v-card-title>

        <v-card-text>
          <ValidationObserver ref="observer">
            <form>
              <!-- DEMO SNIPPET -->
              <!-- <ValidationProvider
                v-slot="{ errors }"
                name="Name"
                rules="required"
              >
                <v-text-field
                  v-model="name"
                  :counter="10"
                  :error-messages="errors"
                  label="Name"
                  required
                ></v-text-field>
              </ValidationProvider> -->

              <!-- DATE PICKER -->
              <v-menu
                v-model="datePickerMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template
                  v-slot:activator="{
                    on,
                    attrs,
                  }"
                >
                  <ValidationProvider
                    v-slot="{
                      errors,
                    }"
                    name="Date"
                    rules="required"
                  >
                    <!-- v-model="date" -->
                    <!-- :value="myMomentDate" -->
                    <v-text-field
                      readonly
                      label="Select Date"
                      v-bind="attrs"
                      v-on="on"
                      :error-messages="errors"
                      required
                      :value="date"
                    ></v-text-field>
                  </ValidationProvider>
                </template>
                <v-date-picker v-model="date" @input="datePickerMenu = false"></v-date-picker>
              </v-menu>

              <!-- END-DATE PICKER -->

              <!-- SELECT CATEGORY -->
              <v-row>
                <v-col cols="8">
                  <!-- v-model="value" -->
                  <!-- MAIN SELECT OPTION -->
                  <ValidationProvider
                    rules="required"
                    v-slot="{
                      errors,
                    }"
                    name="Select Category"
                  >
                    <v-select
                      id="SelectCategory"
                      :items="categories"
                      chips
                      label="Select Categories"
                      multiple
                      outlined
                      :error-messages="errors"
                      @change="onSelectCategory($event)"
                      v-model="selectedCategory"
                    ></v-select>
                  </ValidationProvider>
                </v-col>
                <v-col cols="4">
                  <!--  ADD CATEGORY BUTTON -->
                  <v-btn @click="addCategoryDialog = true" class="mr-4" color="primary" fab><v-icon>mdi-plus</v-icon></v-btn>
                  <!-- ADD CATEGORY INPUT DIALOG -->
                  <v-dialog v-model="addCategoryDialog" width="500">
                    <v-card>
                      <v-card-title>Add New Category</v-card-title>
                      <!-- @change="onChangeCount($event, categoryName)" -->
                      <v-card-text>
                        <v-text-field label="New Category Name" outlined v-model="newCategoryName"></v-text-field>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" class="mb-2k" @click="onAddCategory()">
                          Add
                        </v-btn>
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>
              <!--END SELECT CATEGORY -->

              <!-- ADD COUNT BOX FOR CATEGORY -->
              <div v-for="(categoryName, index) in categoryCounts" :key="index">
                <!-- DYNAMIC CATEGORY COUNT BOX -->
                <v-divider></v-divider>
                <v-chip class="ma-2">
                  {{ categoryName }}
                </v-chip>
                <v-row>
                  <!-- COUNT FIELD -->
                  <v-col cols="3" sm="3" md="3">
                    <ValidationProvider
                      v-slot="{
                        errors,
                      }"
                      name="Count"
                      rules="required"
                    >
                      <v-text-field
                        :error-messages="errors"
                        label="Count"
                        outlined
                        v-model="categoryData['count_' + categoryName]"
                        @change="onChangeCount($event, categoryName)"
                        :key="categoryName"
                      ></v-text-field>
                    </ValidationProvider>
                  </v-col>
                  <!-- PRICE FIELD -->
                  <v-col cols="3" sm="3" md="3">
                    <ValidationProvider
                      v-slot="{
                        errors,
                      }"
                      name="Price"
                      rules="required"
                    >
                      <v-text-field
                        :error-messages="errors"
                        label="Price"
                        outlined
                        v-model="categoryData['price_' + categoryName]"
                        @change="onChangePrice($event, categoryName)"
                        :key="categoryName"
                      ></v-text-field>
                    </ValidationProvider>
                  </v-col>

                  <v-col cols="1" sm="1" md="1">
                    <v-icon class="mt-4">mdi-equal</v-icon>
                  </v-col>

                  <!-- AMOUNT FIELD -->
                  <v-col cols="3" sm="3" md="3">
                    <ValidationProvider
                      v-slot="{
                        errors,
                      }"
                      name="Amount"
                      rules="required"
                    >
                      <v-text-field
                        :error-messages="errors"
                        label="Amount"
                        outlined
                        v-model="categoryData['amount_' + categoryName]"
                        :disabled="true"
                        :key="categoryName"
                      ></v-text-field>
                    </ValidationProvider>
                  </v-col>

                  <!-- DELETE BUTTON -->
                  <!-- <v-col cols="3" sm="3" md="3">
                    <v-btn fab @click="onCategoryDelete(categoryName)"
                      ><v-icon>mdi-delete</v-icon></v-btn
                    >
                  </v-col> -->
                </v-row>
                <v-divider></v-divider>
              </div>
              <!-- END ADD COUNT BOX FOR CATEGORY -->

              <!-- PAID AMOUNT & TOTAL AMOUNT BOX -->
              <div v-if="categoryCounts.length > 0">
                <div>
                  Total
                </div>
                <v-row>
                  <v-col cols="6">
                    <ValidationProvider
                      v-slot="{
                        errors,
                      }"
                      name="Paid"
                      rules="required"
                    >
                      <!-- PAID AMOUNT -->
                      <v-text-field v-model="paid" :error-messages="errors" label="Paid" outlined></v-text-field>
                    </ValidationProvider>
                  </v-col>

                  <v-col cols="1">
                    <v-icon class="mt-4">mdi-equal</v-icon>
                  </v-col>

                  <v-col cols="3">
                    <ValidationProvider
                      v-slot="{
                        errors,
                      }"
                      name="Total Amount"
                      rules="required"
                    >
                      <!-- TOTAL AMOUNT -->
                      <v-text-field
                        :error-messages="errors"
                        label="Total Amount"
                        outlined
                        :disabled="true"
                        v-model="calculateTotalAmount"
                      ></v-text-field>
                    </ValidationProvider>
                  </v-col>
                </v-row>
                <!-- NOTE -->
                <v-row>
                  <v-textarea name="note" filled label="Add Note" v-model="note" rows="2"></v-textarea>
                </v-row>
              </div>
              <!-- END-PAID AMOUNT & TOTAL AMOUNT BOX -->

              <!--  FORM ACTION BUTTONS -->
              <v-btn v-if="isEdit == false" class="mr-4" @click="onSubmit" color="primary">Submit</v-btn>
              <v-btn v-else id="Update__Data" class="mr-4" @click="onUpdate" color="primary">Update</v-btn>
              <v-btn @click="openForm = false">Cancle</v-btn>
            </form>
          </ValidationObserver>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <!-- <v-btn color="green darken-1" text @click="openForm = false">
            Close
          </v-btn>

          <v-btn color="green darken-1" text @click="openForm = false">
            Submit
          </v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- END OPEN DIALOG -->

    <!-- DELETE ALERT DIALOG -->
    <v-dialog v-model="toDeleteDialog" max-width="500" persistent="">
      <v-card>
        <v-card-text>
          <v-alert type="warning">
            Ary you sure you wan't to Delete This Record ?
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn id="Confirm__delete" @click.native="confirmDelete()" color="primary">
            Delete
          </v-btn>

          <v-btn id="Cancle__delete" @click="toDeleteDialog = false">
            Cancle
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

  import moment from "moment";
  import { required, email, max } from "vee-validate/dist/rules";
  import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from "vee-validate";

  // form validation
  setInteractionMode("eager");

  extend("required", {
    ...required,
    message: "{_field_} can not be empty",
  });

  export default {
    name: "GoodsIn",
    components: {
      ValidationProvider,
      ValidationObserver,
    },

    // DATA
    data() {
      return {
        // categories: [ "category_1", "category_2", "category_3"],
        selectedCustomer: "",
        categories: [],
        customerTransactionData: null,
        openForm: false,

        // FORM VALIDATION FILEDS
        name: "",
        datePickerMenu: false,
        // date: new Date().toISOString().substr(0, 10),
        date: moment(new Date()).format("YYYY-MM-DD"),
        categoryCounts: [],
        count: 0,
        price: 0,
        amount: 0,
        categoryData: {},
        selectedCategory: "",
        paid: 0,
        totalAmount: 0,
        totalCount: 0,
        note: "",
        lastTr_id: 1, // TODO: FETCH LAST CUSTOMER TRANSCTION ID AND ASSIGN IT HERE
        selectedCustomerId: "",
        selectedCustomerName: "",
        addCategoryDialog: false,
        newCategoryName: "",
        isEdit: false,
        Edit_tr_id: "",
        toDeleteDialog: false,
        deleteRecord: false,
        toDeleteData: {},
        randomNumber: Math.random() * 1000 + 1,
      };
    },
    computed: {
      ...mapState({
        customers: (state) => state.customers,
      }),
      ...mapGetters(["getCustomersNames", "getCustomerData", "getCategories"]),

      // TO CALCULATE TOTAL FINAL AMOUNT OF TRANSCACTION
      calculateTotalAmount: {
        get: function() {
          if (this.totalAmount != 0) {
            return this.totalAmount - this.paid;
            // return this.totalAmount;
          } else {
            return 0;
          }
        },
        set: function(value) {
          this.totalAmount = value;
        },
      },
      // CALCULATE TOTAL COUNTS
      // calculateTotalCounts: {
      // 	get: function() {
      // 		return this.totalCount;
      // 	},
      // 	set: function(value) {
      // 		this.totalCount += value;
      // 	},
      // },
      myMomentDate() {
        return this.date ? moment(this.date).format("dddd, MMMM Do YYYY") : "";
      },
    },

    created() {
      let stateIs = this.customers;
    },

    methods: {
      ...mapMutations(["addCategory", "updateData", "deleteData"]),
      ...mapActions(["addCustomerData"]),

      onSelectCustomer(customerId) {
        let customerData = this.getCustomerData({
          customerId: customerId,
          goodsType: "goods_in",
        });
        this.customerTransactionData = customerData["customerTransaction"];
        this.selectedCustomerId = customerData["customerOverview"][0]["customerId"];
        this.selectedCustomerName = customerData["customerOverview"][0]["customerName"];
        this.categories = [...customerData["customerOverview"][0]["categories"]];
        // // console.log("onSelectCustomer -> this.customerTransactionData", this.customerTransactionData);
        return this.customerTransactionData;
      },
      onEdit(editData) {
        this.openForm = true;
        this.isEdit = true;
        this.Edit_tr_id = editData["goodsIn_tr_id"];
        this.date = moment(editData["date"]).format("YYYY-MM-DD");
        this.selectedCategory = [editData["category"]];

        let categoryName = editData["category"];
        // console.log("onEdit -> categoryName", categoryName)
        this.categoryData["count_" + categoryName] = editData["count"];
        this.categoryData["price_" + categoryName] = editData["price"];
        this.categoryData["amount_" + categoryName] = editData["amount"];
        this.paid = editData["paid"];
        this.totalAmount = editData["totalAmount"];
        this.note = editData["note"];
        // // console.log("onEdit -> editData", editData);
        // this.selectedCategory = ["category_1"];
        this.onSelectCategory([...this.selectedCategory]);
      },
      onUpdate() {
        // console.log("onUpdate -> onUpdate");

        let payload = {};
        this.categoryCounts.map((categoryName, index) => {
          let categoryAmount = this.categoryData[`amount_${categoryName}`];
          index += 2;

          payload = {
            customerId: this.selectedCustomerId,
            goodsIn_tr_id: this.Edit_tr_id,
            type: "goods_in",
            date: moment(this.date).format("YYYY-MM-DD"),
            category: categoryName,
            count: this.categoryData[`count_${categoryName}`],
            price: this.categoryData[`price_${categoryName}`],
            amount: this.categoryData[`amount_${categoryName}`],
            paid: this.paid,
            totalAmount: this.calculateTotalAmount,
            note: this.note,
          };
          // // console.log("onSubmit -> categoryAmount", categoryAmount);
        });

        this.updateData(payload);
        this.getUpdatedData();
        this.openForm = false;
        this.isEdit = false;
      },

      // ON SELECT CATEGORY FROM OPTION
      onSelectCategory(categoryName) {
        this.categoryCounts = [...categoryName];
      },

      onChangeCount(value, categoryName) {
        // addding in total count value
        // this.calculateTotalCounts = Number(value);
        this.categoryData[`count_${categoryName}`] = value;
        // this.categoryData[`amount_${categoryName}`] = 0;
        this.categoryData[`price_${categoryName}`] = 0;

        // UPDATING GLOBAL STATE TO RENDER
        this.$set(this, "categoryData", {
          ...this.categoryData,
        });
      },
      onChangePrice(value, categoryName) {
        if (this.categoryData[`count_${categoryName}`]) {
          // DONT DO ANYTHING IF COUNT IS ZERO

          // CAPTURING OLD AMOUNT ADDED IN ADDITION OF TOTAL CALCULATION OF AMT TO SUBTRACT IT
          let oldAmount = this.categoryData[`amount_${categoryName}`] ? this.categoryData[`amount_${categoryName}`] : 0;

          this.categoryData[`price_${categoryName}`] = value;

          this.categoryData[`amount_${categoryName}`] =
            this.categoryData[`count_${categoryName}`] * this.categoryData[`price_${categoryName}`];

          //  ADDING PREVIOUS TOTAL + PAID TO MATCH WITH CURRENT PAID AMOUNT
          let actualTotalAmount = Number(this.calculateTotalAmount) + Number(this.paid);

          //  SETTING TOTAL AMOUNT
          this.calculateTotalAmount = actualTotalAmount + this.categoryData[`amount_${categoryName}`] - oldAmount;

          // this.calculateTotalAmount + this.categoryData[`amount_${categoryName}`] ;
          this.$set(this, "categoryData", {
            ...this.categoryData,
          });
        }
      },

      // FORM VALIDATION
      async onSubmit() {
        let validate = await this.$refs.observer.validate();
        // let validate = true;
        if (validate) {
          let allData = {
            data: this.date,
            categoryData: this.categoryData,
            paid: this.paid,
            note: this.note,
            totalAmount: this.calculateTotalAmount,
          };
          // // console.log("onSubmit -> allData", JSON.stringify(allData));

          let goodsInData = {};

          // amount_category_1: 100
          // count_category_1: "10"
          // price_category_1: "10"
          let data = [];
          let totalCount = 0;

          this.categoryCounts.map((categoryName, index) => {
            let categoryAmount = this.categoryData[`amount_${categoryName}`];
            index += 2;

            data.push({
              goodsIn_tr_id: this.randomNumber,
              type: "goods_in",
              date: this.date,
              category: categoryName,
              count: this.categoryData[`count_${categoryName}`],
              price: this.categoryData[`price_${categoryName}`],
              amount: this.categoryData[`amount_${categoryName}`],
              paid: this.paid,
              totalAmount: this.calculateTotalAmount,
              note: this.note,
              tranScactionDataOut: [],
            });
            // // console.log("onSubmit -> categoryAmount", categoryAmount);
          });
          let newCutomerOverviewData = {
            customerId: +this.selectedCustomerId,
            customerName: this.selectedCustomerName,
            newTotalAmount: +this.calculateTotalAmount,
            newPaidAmount: +this.paid,
            newTotalCount: +totalCount,
          };
          // // // console.log("onSubmit -> this.selectedCustomerName", this.selectedCustomerName);

          //  this.openForm=false
          //  ADD DATA TO MAIN STATE
          this.addCustomerData({ newCutomerOverviewData, data });
          this.getUpdatedData();

          this.openForm = false; // closing the form
        }
      },
      clear() {
        this.name = "";
      },

      onAddCategory() {
        if (this.newCategoryName) {
          this.addCategoryDialog = !this.addCategoryDialog; // toggle form
          let payloadData = { customerId: this.selectedCustomerId, category: this.newCategoryName };
          this.addCategory(payloadData);

          this.categories = this.getCategories({ customerId: this.selectedCustomerId });

          return this.categories;
        }
      },
      getUpdatedData() {
        let updatedCustomerData = this.getCustomerData({
          customerId: +this.selectedCustomerId,
          goodsType: "goods_in",
        });
        // // // console.log("onSubmit -> updatedCustomerData", updatedCustomerData);
        this.customerTransactionData = updatedCustomerData["customerTransaction"];
      },

      confirmDelete() {
        // console.log("confirmDelete -> confirmDelete")
        this.deleteData(this.toDeleteData);
        this.getUpdatedData();
        this.toDeleteDialog = false;
      },

      onDelete(goodsIn_tr_id) {
        let payload = { goodsIn_tr_id, customerId: this.selectedCustomerId };
        this.toDeleteDialog = true;
        this.toDeleteData = payload;
      },

      // N-TEST RUN FUNCTION
      testRun: function(event) {
        // // console.log("event", event);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .N {
    border: 1px solid red;
  }
</style>
