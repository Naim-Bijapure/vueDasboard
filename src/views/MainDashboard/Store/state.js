/** @format */

export var state = {
	barColor: "rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)",
	barImage: "https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-1.jpg",
	drawer: null,

	// CUSTOMER MOCK DATA
	customers: [
		{
			customerId: 1,
			customerName: "customer_1",
			finalAmount: 0,
			finalCount: 0,
			finalPaidAmount: 0,
			categories: ["category_1", "category_2", "category_3"],
			tranScactionData: [
				{
					goodsIn_tr_id: 1,
					type: "goods_in",
					date: "2020-11-11",
					category: "category_1",
					count: 5,
					price: 10,
					amount: 50,
					paid: 0,
					totalAmount: 50,
					note: "cool in",
					// TRANSCACTION OUT DATA FOR EACH IN DATA
					tranScactionDataOut: [
						{
							goodsOut_tr_id: 1,
							type: "goods_out",
							date: "2020-11-12",
							category: "category_1",
							count: 5,
							price: 10,
							amount: 50,
							paid: 0,
							totalAmount: 100,
							note: "cool ",
						},
					],
				},
			],
		},
	],
};
