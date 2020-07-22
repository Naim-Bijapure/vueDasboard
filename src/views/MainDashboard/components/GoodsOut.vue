<!-- @format -->

<template>
  <div>
    <v-container fluid class="goodsOut">
      <v-row>
        <v-col class="goodOut__select">
          <!-- SELECT CUSTOMER-->
          <v-select
            :items="getCustomersNames"
            v-model="selectedCustomer"
            item-value="id"
            item-text="name"
            label="Select A Customer"
            outlined
            @input="onSelectCustomer($event)"
            id="customerSelect"
          ></v-select>
        </v-col>

        <v-col> </v-col>
      </v-row>
      <v-row class="Customer__Panel">
        <!--  -->
        <v-expansion-panels id="GoodsOut__ExpansionPanel" v-model="panelIndex">
          <v-expansion-panel v-for="(eachTranscaction, i) in customerTransactionData" :key="i">
            <v-expansion-panel-header>
              <div>{{ eachTranscaction["category"] }}</div>
              <div>Count:{{ eachTranscaction["count"] }}</div>
              <div>Price:{{ eachTranscaction["price"] }}</div>
              <div>Amount:{{ eachTranscaction["amount"] }}</div>
              <div>{{ eachTranscaction["date"] }}</div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <!-- TABLE -->
              <v-data-table :headers="headers" :items="eachTranscaction['tranScactionDataOut']" sort-by="calories" class="elevation-1">
                <template v-slot:top>
                  <v-toolbar flat color="white">
                    <v-toolbar-title>GOODS OUT</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <!-- n-INPUT FORM -->
                    <v-dialog v-model="dialog" max-width="500px" persistent>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          id="GoodsOut__ExpansionPanel--AddEntry"
                          color="primary"
                          dark
                          class="mb-2"
                          v-bind="attrs"
                          v-on="on"
                          @click="onOpenForm(eachTranscaction)"
                          >Add Entry</v-btn
                        >
                      </template>
                      <v-card>
                        <v-card-title>
                          <span class="headline">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                          <v-container>
                            <v-row>
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
                                  <!-- v-model="date" -->
                                  <!-- :value="myMomentDate" -->
                                  <v-text-field
                                    readonly
                                    label="Select Out Date"
                                    v-bind="attrs"
                                    v-on="on"
                                    required
                                    :value="date"
                                    outlined
                                  ></v-text-field>
                                </template>
                                <v-date-picker v-model="date" @input="datePickerMenu = false"></v-date-picker>
                              </v-menu>
                            </v-row>
                            <v-row>
                              <v-col md="4">
                                <!-- n-COUNT -->
                                <div>
                                  <v-text-field
                                    id="goodsOut__Count"
                                    name="count"
                                    label="Enter Count"
                                    outlined
                                    v-model="editedItem.count"
                                    :error="editedItem.count > eachTranscaction['count']"
                                  ></v-text-field>
                                </div>
                              </v-col>
                              <v-col md="4">
                                <!-- n-PRICE -->
                                <v-text-field
                                  name="price"
                                  label="price"
                                  outlined
                                  v-model="editedItem.price"
                                  :disabled="true"
                                ></v-text-field>
                              </v-col>

                              <v-col md="4">
                                <!-- n-AMOUNT -->
                                <v-text-field name="amount" label="Amount" outlined :disabled="true" v-model="amount"></v-text-field>
                              </v-col>
                            </v-row>
                            <v-row>
                              <!-- n-PAID -->
                              <v-col md="6">
                                <v-text-field
                                  id="goodsOut__Paid"
                                  name="paid"
                                  label="Enter Paid Amount"
                                  outlined
                                  v-model="editedItem.paid"
                                ></v-text-field>
                              </v-col>
                              <v-col md="6">
                                <!-- N-FINALE-AMOUNT -->
                                <v-text-field
                                  v-model="finalAmount"
                                  name="finalAmount"
                                  label="Final Amount "
                                  outlined
                                  :disabled="true"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="primary" @click="close">Cancel</v-btn>
                          <!-- N-ONSUBMIT -->
                          <v-btn
                            color="primary"
                            @click="onSubmit"
                            :disabled="finalAmount <= 0 || editedItem.count > eachTranscaction['count']"
                            >Submit</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-icon small class="mr-2" @click="editItem(item)">
                    mdi-pencil
                  </v-icon>
                  <v-icon small @click="deleteItem(item)">
                    mdi-delete
                  </v-icon>
                </template>
                <!-- <template v-slot:no-data>
                  <v-btn color="primary" @click="initialize">Reset</v-btn>
                </template> -->
              </v-data-table>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
    </v-container>

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

  export default {
    name: "GoodsOut",
    components: {},
    data() {
      return {
        selectedCustomer: "",
        customerTransactionData: "",
        customerTransactionOutData: "",
        selectedCustomerName: "",
        categories: "",
        goodsOutDate: "",
        datePickerMenu: "",
        date: moment(new Date()).format("YYYY-MM-DD"),

        randomNumber: Math.random() * 1000 + 1,

        //MOCK DATA
        dialog: false,
        headers: [
          {
            text: "Date",
            align: "start",
            sortable: true,
            value: "date",
          },
          { text: "Count", value: "count" },
          { text: "Price", value: "price" },
          { text: "Amount", value: "amount" },
          { text: "Paid", value: "paid" },
          // { text: "Note", value: "note" },
          { text: "Actions", value: "actions", sortable: false },
        ],
        desserts: [],
        editedIndex: -1,
        editedItem: {
          date: "",
          count: 0,
          price: 0,
          amount: 0,
          paid: 0,
          finalAmount: 0,
          currentSelectedCategory: "",
        },
        defaultItem: {
          date: "",
          count: 0,
          price: 0,
          amount: 0,
          paid: 0,
        },
        panelIndex: "",
        toDeleteDialog: false,
        deletPayload: {},
      };
    },

    computed: {
      ...mapGetters(["getCustomersNames", "getCustomerData"]),
      formTitle() {
        return this.editedIndex === -1 ? "New Item" : "Edit Item";
      },
      amount: function() {
        return this.editedItem.count * this.editedItem.price;
      },
      finalAmount: function() {
        return this.amount - this.editedItem.paid;
      },
    },
    created() {},

    methods: {
      ...mapMutations(["addGoodsOut", "deleteGoodsOut"]),
      onSelectCustomer(customerId) {
        let customerData = this.getCustomerData({
          customerId: customerId,
          goodsType: "goods_in",
        });
        this.customerTransactionData = customerData["customerTransaction"];
        this.selectedCustomerName = customerData["customerOverview"][0]["customerName"];
        this.categories = [...customerData["customerOverview"][0]["categories"]];
      },

      //  MOCK METHODS
      editItem(item) {
        console.log("editItem -> item", item)
        // this.editedIndex = this.desserts.indexOf(item);
        // this.editedItem = Object.assign({}, item);
        // this.dialog = true;
      },

      confirmDelete() {
        this.deleteGoodsOut(this.deletPayload);
        this.toDeleteDialog = false;
      },

      deleteItem(item) {
        console.log("deleteItem -> item", item, this.selectedCustomer);
        let payload = {
          customerId: this.selectedCustomer,
          category: item["category"],
          goodsOut_tr_id: item["goodsOut_tr_id"],
        };
        this.deletPayload = payload;
        this.toDeleteDialog = true;
        // const index = this.desserts.indexOf(item);
        // confirm("Are you sure you want to delete this item?") && this.desserts.splice(index, 1);
      },

      close() {
        this.dialog = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        });
      },

      onOpenForm(item) {
        this.editedItem.price = +item.price;
        this.editedItem.currentSelectedCategory = item["category"];
      },

      onSubmit() {
        let payload = {
          customerId: this.selectedCustomer,
          tr_id: +this.randomNumber,
          type: "goods_out",
          date: this.date,
          category: this.editedItem.currentSelectedCategory,
          count: +this.editedItem.count,
          price: +this.editedItem.price,
          amount: +this.amount,
          paid: +this.editedItem.paid,
          totalAmount: +this.finalAmount,
          note: "cool ",
        };
        this.addGoodsOut(payload);
        this.dialog = false;
      },
    },

    watch: {
      dialog(val) {
        val || this.close();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .Danger__text {
    color: red;
    width: 100%;
  }
</style>
