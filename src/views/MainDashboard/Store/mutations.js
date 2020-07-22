/** @format */

// N-WORK ADD TRANSCTATIONAL DATA TO  A CUSTOMER
function addTranscactionData(state, payload) {
  let selectedCustomerId = payload["newCutomerOverviewData"]["customerId"];
  let newTranscactionData = [...payload["data"]];
  let customersData = [...state.customers];
  customersData.map((obj) => {
    if (obj.customerId == selectedCustomerId) {
      obj["tranScactionData"].push({ ...newTranscactionData[0] });
      // TODO: ADD TOTAL ADDED AMOUNT TO CUSTOMER OVERVIEW VALUES
      // TODO: MERGE SAME DAY CATEGORY ADDED VALUES
    }
  });
  state["customers"] = customersData;
}

//  ADD A  NEW CATEGORY TO CUSTOMER DATA
function addCategory(state, payload) {
  const { customerId, category } = payload;
  state.customers.map((obj) => {
    if (obj["customerId"] == customerId) {
      obj["categories"].push(category);
    }
  });
  let selectedCustomer = state.customers.filter((obj) => obj["customerId"] == customerId);

  return selectedCustomer[0]["categories"];
}

function updateData(state, payload) {
  let { customerId, goodsIn_tr_id } = payload;

  let cId = customerId;
  state.customers.map((obj) => {
    if (obj["customerId"] == customerId) {
      delete payload["customerId"];
      obj["tranScactionData"] = obj["tranScactionData"].map((objData) => {
        if (objData["goodsIn_tr_id"] == goodsIn_tr_id) {
          objData = { ...objData, ...payload };
        }
        return objData;
      });
    }
    return obj;
  });

  return state;
}

function deleteData(state, payload) {
  const { goodsIn_tr_id, customerId } = payload;
  let updatedData = state.customers.map((obj) => {
    if (obj["customerId"] == customerId) {
      obj["tranScactionData"] = obj["tranScactionData"].filter((objData) => objData["goodsIn_tr_id"] != goodsIn_tr_id);
    }
    return obj;
  });
}
// ADD GOODS OUT
function addGoodsOut(state, payload) {
  const { customerId, tr_id, category } = payload;

  //  MAPPING THROUGH CUSTOMER ARRAY AND SELECT CUSTOMER WITH ID
  state.customers.map((obj) => {
    if (obj["customerId"] == customerId) {
      //  MAPPING THROUGH TRANSCACTION DATA AND SELECT TRANSCACTION OF THAT CATEGORY
      obj["tranScactionData"].map((tranScactionDataObj) => {
        //    SELECT THE CATEGORY WISE DATA
        if (tranScactionDataObj["category"] == category) {
          delete payload.customerId;
          tranScactionDataObj["count"] -= payload["count"];
          //   tranScactionDataObj["price"] -= payload["price"];
          tranScactionDataObj["amount"] -= payload["amount"];
          tranScactionDataObj["paid"] -= payload["paid"];
          // PUSHING NEW VALUES  TO TRANSCACTION OUT DATA
          // if (tranScactionDataObj["tranScactionDataOut"] == undefined) {
          //   tranScactionDataObj["tranScactionDataOut"] = [];

          // }
          tranScactionDataObj["tranScactionDataOut"].push({ ...payload });
        }
        return tranScactionDataObj;
      });
    }
    return obj;
  });
}
// DELETE GOODS OUT
function deleteGoodsOut(state, payload) {
  const { customerId, category, goodsOut_tr_id } = payload;
  state.customers.map((obj) => {
    if (obj["customerId"] == customerId) {
      obj["tranScactionData"].map((tranScactionDataObj) => {
        if (tranScactionDataObj["category"] == category) {
          // console.log("deleteGoodsOut -> tranScactionDataObj", tranScactionDataObj);

          // FIRST GET TO DELETE DATA VALUES
          let toDeleteGoodsOutData = tranScactionDataObj["tranScactionDataOut"].filter(
            (tranScactionDataOutObj) => tranScactionDataOutObj["goodsOut_tr_id"] == goodsOut_tr_id
          );
          tranScactionDataObj["count"] += toDeleteGoodsOutData[0]["count"];
          tranScactionDataObj["amount"] += toDeleteGoodsOutData[0]["amount"];

          //  REMOVE  DATA
          tranScactionDataObj["tranScactionDataOut"] = tranScactionDataObj["tranScactionDataOut"].filter(
            (tranScactionDataOutObj) => tranScactionDataOutObj["goodsOut_tr_id"] != goodsOut_tr_id
          );
          // console.log("deleteGoodsOut -> tranScactionDataObj[tranScactionDataOut]", tranScactionDataObj["tranScactionDataOut"]);
        }
        return tranScactionDataObj;
      });
    }
    return obj;
  });
  return state.customers;
}

function updateGoodsOut(state, payload) {
  const { customerId, goodsIn_tr_id, goodsOut_tr_id } = payload;
  state.customers.map((customerObj) => {
    // finding
    if (customerObj["customerId"] == customerId) {
      customerObj["tranScactionData"] = customerObj["tranScactionData"].map((tranScactionDataObj) => {
        if (tranScactionDataObj["goodsIn_tr_id"] == goodsIn_tr_id) {

        }
      });
    }
  });
}

export default {
  addTranscactionData,
  addCategory,
  updateData,
  deleteData,
  addGoodsOut,
  deleteGoodsOut,
  updateGoodsOut,
};
