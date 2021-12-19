import axios from "axios";
import moment from "moment";
import Noty from "noty";
const User = require("../../app/http/models/user");

export function initAdmin(socket) {
  const orderTableBody = document.querySelector("#orderTableBody");
  const orderTableBodyMakati = document.querySelector("#orderTableBody1");
  const orderTableBodyOrtigas = document.querySelector("#orderTableBody2");

  //Rider Makati
  const rideOrderTableBodyMakati = document.querySelector("#orderTableBody3");
  let riderOrderMakati = [];
  let riderMarkupMakati;

  //Rider Ortigas
  const rideOrderTableBodyOrtigas = document.querySelector("#orderTableBody4");
  let riderOrderOrtigas = [];
  let riderMarkupOrtigas;

  //Rider Main
  const rideOrderTableBodyMain = document.querySelector("#orderTableBody5");
  let riderOrderMain = [];
  let riderMarkupMain
  
  let orders = [];
  let orderMakati = [];
  let orderOrtigas = [];
  let user =[];
  let markupUser;
  let markup;
  let markupMakati;
  let markupOrtigas;

  axios
    .get("/admin/orders", {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then((res) => {
      orders = res.data;
      user = res.data;
      markupUser = generateMarkup(user);
      markup = generateMarkup(orders);
      orderTableBody.innerHTML = markup;
    })
    .catch((err) => {
      console.log(err);
    });



    axios
    .get("/admin/ordersMakati", {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then((res) => {
      orderMakati = res.data;
      user = res.data;
      markupUser = generateMarkup(user);
      markupMakati = generateMarkup1(orderMakati);
      orderTableBodyMakati.innerHTML = markupMakati;
    })
    .catch((err) => {
      console.log(err);
    });

    axios
    .get("/admin/ortigasRider", {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then((res) => {
      riderOrderOrtigas = res.data;
      user = res.data;
      markupUser = generateMarkup(user);
      riderMarkupOrtigas = generateMarkup4(riderOrderOrtigas);
      rideOrderTableBodyOrtigas.innerHTML = riderMarkupOrtigas;
    })
    .catch((err) => {
      console.log(err);
    });

    axios
    .get("/admin/mainRider", {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then((res) => {
      riderOrderMain = res.data;
      user = res.data;
      markupUser = generateMarkup(user);
      riderMarkupMain = generateMarkup4(riderOrderMain);
      rideOrderTableBodyMain.innerHTML = riderMarkupMain;
    })
    .catch((err) => {
      console.log(err);
    });

    axios
    .get("/admin/makatiRider", {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then((res) => {
      riderOrderMakati = res.data;
      user = res.data;
      markupUser = generateMarkup(user);
      riderMarkupMakati = generateMarkup3(riderOrderMakati);
      rideOrderTableBodyMakati.innerHTML = riderMarkupMakati;
    })
    .catch((err) => {
      console.log(err);
    });

    axios
    .get("/admin/ordersOrtigas", {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then((res) => {
      orderOrtigas = res.data;
      user = res.data;
      markupUser = generateMarkup(user);
      markupOrtigas = generateMarkup2(orderOrtigas);
      orderTableBodyOrtigas.innerHTML = markupOrtigas;
    })
    .catch((err) => {
      console.log(err);
    });


  function renderItems(items) {
    let parsedItems = Object.values(items);
    return parsedItems
      .map((menuItem) => {
        var total = 40;
        total = menuItem.item.price * menuItem.qty;
        return `
            <div class="flex justify-between items-center">
               <div>
                <p></p>
                  <p><b>${menuItem.item.name}</b></p>
                   <p class="text-gray-700">${menuItem.qty}pcs</p>
                  </div>
                  <div>
                  <p class="text-gray-700">
                  ₱ ${menuItem.item.price * menuItem.qty}     
                  </p>
                </div>    
            </div>
            `
            ;
      })
      
      .join("");
  }

  function generateMarkup3(riderOrderMakati) {
    return riderOrderMakati
      .map((order) =>
      {
        var branchnew = order.address.branch;
        if(order.address.city == "Pasig" || order.address.city == "Cainta" || order.address.city == "Marikina" || order.address.city == "Pateros"){
          branchnew = "Main (Pasig Cainta)";
        }
        else if(order.address.city == "Mandaluyong" || order.address.city == "Quezon"){
          branchnew = "Ortigas"
        }
        else if(order.address.city == "Makati" || order.address.city == "Taguig"){
          branchnew = "Makati"
        }

        if(branchnew == "Makati"){
        return `<tr>
                <td class="border  border-l-0  px-4 py-2 text-green-900">
                    <p class="text-primary uppercase mb-1">${order._id}</p>
                    <div class="mb-1">${renderItems(order.items)}</div>
                    <div class="flex justify-between mt-1"><p><b>Shpping Fee:</b></p>
                    <p class="text-gray-700">₱40</p>
                  </div>
                    <div class="flex justify-between mt-1"><p><b>Total Amount:</b></p>
                      <p class="text-gray-700">₱${order.address.total}</p>
                    </div>
                </div>
                </td>
                <td class="border px-4 py-2">${order.address.firstName} ${order.address.lastName}</td>
                <td class="border px-4 py-2">${order.address.phone}</td>
                <td class="border px-4 py-2">${order.address.street_address}</td>
                <td class="border px-4 py-2">${order.address.city}</td>
                <td class="border px-4 py-2">${order.address.landmark}</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-40">
                    <form action="/admin/makatiRider/status" method="POST">
                    <input type="hidden" name="orderId" value="${ order._id }">
                    <select name="status" onchange="this.form.submit()"
                        class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline form-control">

                        <option value="delivered" ${ order.status === 'delivered' ? 'selected' : '' }>
                            Delivered
                        </option>
                    </select>
                    </form>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class="border px-4 py-2">${branchnew}</td>
                <td class="border px-4 py-2">
                    ${moment(order.createdAt).format("Do MMM YYYY, h:mm A")}
                </td>

                
            </tr>`;
          }})
      .join("");
  }

  function generateMarkup4(riderOrderOrtigas) {
    return riderOrderOrtigas
      .map((order) =>
      {
        var branchnew = order.address.branch;
        if(order.address.city == "Pasig" || order.address.city == "Cainta" || order.address.city == "Marikina" || order.address.city == "Pateros"){
          branchnew = "Main (Pasig Cainta)";
        }
        else if(order.address.city == "Mandaluyong" || order.address.city == "Quezon"){
          branchnew = "Ortigas"
        }
        else if(order.address.city == "Makati" || order.address.city == "Taguig"){
          branchnew = "Makati"
        }

        if(branchnew == "Ortigas"){
        return `<tr>
                <td class="border  border-l-0  px-4 py-2 text-green-900">
                    <p class="text-primary uppercase mb-1">${order._id}</p>
                    <div class="mb-1">${renderItems(order.items)}</div>
                    <div class="flex justify-between mt-1"><p><b>Shpping Fee:</b></p>
                    <p class="text-gray-700">₱40</p>
                  </div>
                    <div class="flex justify-between mt-1"><p><b>Total Amount:</b></p>
                      <p class="text-gray-700">₱${order.address.total}</p>
                    </div>
                </div>
                </td>
                <td class="border px-4 py-2">${order.address.firstName} ${order.address.lastName}</td>
                <td class="border px-4 py-2">${order.address.phone}</td>
                <td class="border px-4 py-2">${order.address.street_address}</td>
                <td class="border px-4 py-2">${order.address.city}</td>
                <td class="border px-4 py-2">${order.address.landmark}</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-40">
                    <form action="/admin/ortigasRider/status" method="POST">
                    <input type="hidden" name="orderId" value="${ order._id }">
                    <select name="status" onchange="this.form.submit()"
                        class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline form-control">

                        <option value="delivered" ${ order.status === 'delivered' ? 'selected' : '' }>
                            Delivered
                        </option>
                    </select>
                    </form>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class="border px-4 py-2">${branchnew}</td>
                <td class="border px-4 py-2">
                    ${moment(order.createdAt).format("Do MMM YYYY, h:mm A")}
                </td>

                
            </tr>`;
          }})
      .join("");
  }

  function generateMarkup4(riderOrderMain) {
    return riderOrderMain
      .map((order) =>
      {
        var branchnew = order.address.branch;
        if(order.address.city == "Pasig" || order.address.city == "Cainta" || order.address.city == "Marikina" || order.address.city == "Pateros"){
          branchnew = "Main (Pasig Cainta)";
        }
        else if(order.address.city == "Mandaluyong" || order.address.city == "Quezon"){
          branchnew = "Ortigas"
        }
        else if(order.address.city == "Makati" || order.address.city == "Taguig"){
          branchnew = "Makati"
        }

        if(branchnew == "Main (Pasig Cainta)"){
        return `<tr>
                <td class="border  border-l-0  px-4 py-2 text-green-900">
                    <p class="text-primary uppercase mb-1">${order._id}</p>
                    <div class="mb-1">${renderItems(order.items)}</div>
                    <div class="flex justify-between mt-1"><p><b>Shpping Fee:</b></p>
                    <p class="text-gray-700">₱40</p>
                  </div>
                    <div class="flex justify-between mt-1"><p><b>Total Amount:</b></p>
                      <p class="text-gray-700">₱${order.address.total}</p>
                    </div>
                </div>
                </td>
                <td class="border px-4 py-2">${order.address.firstName} ${order.address.lastName}</td>
                <td class="border px-4 py-2">${order.address.phone}</td>
                <td class="border px-4 py-2">${order.address.street_address}</td>
                <td class="border px-4 py-2">${order.address.city}</td>
                <td class="border px-4 py-2">${order.address.landmark}</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-40">
                    <form action="/admin/mainRider/status" method="POST">
                    <input type="hidden" name="orderId" value="${ order._id }">
                    <select name="status" onchange="this.form.submit()"
                        class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline form-control">

                        <option value="delivered" ${ order.status === 'delivered' ? 'selected' : '' }>
                            Delivered
                        </option>
                    </select>
                    </form>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class="border px-4 py-2">${branchnew}</td>
                <td class="border px-4 py-2">
                    ${moment(order.createdAt).format("Do MMM YYYY, h:mm A")}
                </td>

                
            </tr>`;
          }})
      .join("");
  }


  function generateMarkup2(orderOrtigas) {
    return orderOrtigas
      .map((order) =>
      {
        var branchnew = order.address.branch;
        if(order.address.city == "Pasig" || order.address.city == "Cainta" || order.address.city == "Marikina" || order.address.city == "Pateros"){
          branchnew = "Main (Pasig Cainta)";
        }
        else if(order.address.city == "Mandaluyong" || order.address.city == "Quezon"){
          branchnew = "Ortigas"
        }
        else if(order.address.city == "Makati" || order.address.city == "Taguig"){
          branchnew = "Makati"
        }

        if(branchnew == "Ortigas"){
        return `<tr>
                <td class="border  border-l-0  px-4 py-2 text-green-900">
                    <p class="text-primary uppercase mb-1">${order._id}</p>
                    <div class="mb-1">${renderItems(order.items)}</div>
                    <div class="flex justify-between mt-1"><p><b>Shpping Fee:</b></p>
                    <p class="text-gray-700">₱40</p>
                  </div>
                    <div class="flex justify-between mt-1"><p><b>Total Amount:</b></p>
                      <p class="text-gray-700">₱${order.address.total}</p>
                    </div>
                </div>
                </td>
                <td class="border px-4 py-2">${order.address.firstName} ${order.address.lastName}</td>
                <td class="border px-4 py-2">${order.address.phone}</td>
                <td class="border px-4 py-2">${order.address.street_address}</td>
                <td class="border px-4 py-2">${order.address.city}</td>
                <td class="border px-4 py-2">${order.address.landmark}</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-40">
                    <form action="/admin/orderOrtigas/status" method="POST">
                    <input type="hidden" name="orderId" value="${ order._id }">
                    <select name="status" onchange="this.form.submit()"
                        class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                        <option value="order_placed" ${ order.status === "order_placed" ? "selected" : "" }>
                            Placed
                        </option>
                        <option value="prepared" ${ order.status === 'prepared' ? 'selected' : '' }>
                            Prepared
                        </option>
                        <option value="in_transit" ${ order.status === "in_transit" ? "selected" : "" }>
                            In Transit
                        </option>

                    </select>
                    </form>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class="border px-4 py-2">${branchnew}</td>
                <td class="border px-4 py-2">
                    ${moment(order.createdAt).format("Do MMM YYYY, h:mm A")}
                </td>

                
            </tr>`;
          }})
      .join("");
  }





  function generateMarkup1(orderMakati) {
    return orderMakati
      .map((order) =>
      {
        var branchnew = order.address.branch;
        if(order.address.city == "Pasig" || order.address.city == "Cainta" || order.address.city == "Marikina" || order.address.city == "Pateros"){
          branchnew = "Main (Pasig Cainta)";
        }
        else if(order.address.city == "Mandaluyong" || order.address.city == "Quezon"){
          branchnew = "Ortigas"
        }
        else if(order.address.city == "Makati" || order.address.city == "Taguig"){
          branchnew = "Makati"
        }

        if(branchnew == "Makati"){
        return `<tr>
                <td class="border  border-l-0  px-4 py-2 text-green-900">
                    <p class="text-primary uppercase mb-1">${order._id}</p>
                    <div class="mb-1">${renderItems(order.items)}</div>
                    <div class="flex justify-between mt-1"><p><b>Shpping Fee:</b></p>
                    <p class="text-gray-700">₱40</p>
                  </div>
                    <div class="flex justify-between mt-1"><p><b>Total Amount:</b></p>
                      <p class="text-gray-700">₱${order.address.total}</p>
                    </div>
                </div>
                </td>
                <td class="border px-4 py-2">${order.address.firstName} ${order.address.lastName}</td>
                <td class="border px-4 py-2">${order.address.phone}</td>
                <td class="border px-4 py-2">${order.address.street_address}</td>
                <td class="border px-4 py-2">${order.address.city}</td>
                <td class="border px-4 py-2">${order.address.landmark}</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-40">
                    <form action="/admin/orderMakati/status" method="POST">
                    <input type="hidden" name="orderId" value="${ order._id }">
                    <select name="status" onchange="this.form.submit()"
                      class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                      <option value="order_placed" ${ order.status === "order_placed" ? "selected" : "" }>
                          Placed
                      </option>
                      <option value="prepared" ${ order.status === 'prepared' ? 'selected' : '' }>
                          Prepared
                      </option>
                      <option value="in_transit" ${ order.status === "in_transit" ? "selected" : "" }>
                          In Transit
                      </option>

                    </select>
                    </form>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class="border px-4 py-2">${branchnew}</td>
                <td class="border px-4 py-2">
                    ${moment(order.createdAt).format("Do MMM YYYY, h:mm A")}
                </td>

                
            </tr>`;
          }})
      .join("");
  }

  function generateMarkup(order) {
    return order
      .map((order) =>
      {
        var branchnew = order.address.branch;
        if(order.address.city == "Pasig" || order.address.city == "Cainta" || order.address.city == "Marikina" || order.address.city == "Pateros"){
          branchnew = "Main (Pasig Cainta)";
        }
        else if(order.address.city == "Mandaluyong" || order.address.city == "Quezon"){
          branchnew = "Ortigas"
        }
        else if(order.address.city == "Makati" || order.address.city == "Taguig"){
          branchnew = "Makati"
        }

        if(branchnew == "Main (Pasig Cainta)"){
        return `<tr>
                <td class="border  border-l-0  px-4 py-2 text-green-900">
                    <p class="text-primary uppercase mb-1">${order._id}</p>
                    <div class="mb-1">${renderItems(order.items)}</div>
                    <div class="flex justify-between mt-1"><p><b>Shpping Fee:</b></p>
                    <p class="text-gray-700">₱40</p>
                  </div>
                    <div class="flex justify-between mt-1"><p><b>Total Amount:</b></p>
                      <p class="text-gray-700">₱${order.address.total}</p>
                    </div>
                </div>
                </td>
                <td class="border px-4 py-2">${order.address.firstName} ${order.address.lastName}</td>
                <td class="border px-4 py-2">${order.address.phone}</td>
                <td class="border px-4 py-2">${order.address.street_address}</td>
                <td class="border px-4 py-2">${order.address.city}</td>
                <td class="border px-4 py-2">${order.address.landmark}</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-40">
                    <form action="/admin/order/status" method="POST">
                    <input type="hidden" name="orderId" value="${ order._id }">
                    <select name="status" onchange="this.form.submit()"
                        class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                        <option value="order_placed" ${ order.status === "order_placed" ? "selected" : "" }>
                            Placed
                        </option>
                        <option value="prepared" ${ order.status === 'prepared' ? 'selected' : '' }>
                            Prepared
                        </option>
                        <option value="in_transit" ${ order.status === "in_transit" ? "selected" : "" }>
                            In Transit
                        </option>

                    </select>
                    </form>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class="border px-4 py-2">${branchnew}</td>
                <td class="border px-4 py-2">
                    ${moment(order.createdAt).format("Do MMM YYYY, h:mm A")}
                </td>

                
            </tr>`;
          }})
      .join("");
  }
  module.exports = admin;

 
  // Socket
  socket.on("orderPlaced", (order) => {
    new Noty({
      text: "New order!",
      type: "success",
      timeout: 1000,
      progressBar: false,
    }).show();
    orders.unshift(order);
    orderTableBody.innerHTML = "";
    orderTableBody.innerHTML = generateMarkup(orders);
  });
}

