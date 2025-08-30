// ====== Cart Setup ======
let order = [];
let total = 0;

const orderList = document.getElementById("order-list");
const orderTotal = document.getElementById("order-total");
const bubbleTotal = document.getElementById("bubble-total");
const phoneNumber = "15615021743"; // bakery number

// ====== Add to Cart Function ======
function addItemToCart(item, price, qty) {
  order.push(`${item} x${qty} - $${(price*qty).toFixed(2)}`);
  total += price * qty;

  // Update cart page list if exists
  if(orderList) {
    const li = document.createElement("li");
    li.textContent = `${item} x${qty} - $${(price*qty).toFixed(2)}`;
    orderList.appendChild(li);
    orderTotal.textContent = total.toFixed(2);
  }

  // Update floating bubble
  if(bubbleTotal) bubbleTotal.textContent = total.toFixed(2);
}

// ====== Animate Buttons & Handle Flavor Selection ======
document.querySelectorAll(".add-to-order").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.add("clicked");
    setTimeout(() => btn.classList.remove("clicked"), 200);

    let item = btn.dataset.item;
    let price = parseFloat(btn.dataset.price);
    let qty = parseInt(btn.previousElementSibling.value || 1);

    // Handle items with flavor select (like Butter Croissant)
    if(btn.dataset.flavorSelect) {
      const flavorSelect = document.getElementById(btn.dataset.flavorSelect);
      if(flavorSelect) {
        const selectedOption = flavorSelect.options[flavorSelect.selectedIndex];
        const flavor = selectedOption.value;
        price = parseFloat(selectedOption.dataset.price);
        item = `${item} (${flavor})`;
      }
    }

    addItemToCart(item, price, qty);
  });
});

// ====== WhatsApp Order ======
const sendOrderBtn = document.getElementById("send-order");
if(sendOrderBtn) {
  sendOrderBtn.addEventListener("click", () => {
    const name = document.getElementById("customer-name").value.trim();
    if(!name || order.length === 0) { alert("Name/order required"); return; }

    const msg = `Hello! My name is ${name}. I'd like to order:\n\n${order.join("\n")}\n\nTotal: $${total.toFixed(2)}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  });
}

// ====== SMS Order ======
const sendSMSBtn = document.getElementById("send-sms");
if(sendSMSBtn) {
  sendSMSBtn.addEventListener("click", () => {
    const name = document.getElementById("customer-name").value.trim();
    if(!name || order.length === 0) { alert("Name/order required"); return; }

    const msg = `Hello! My name is ${name}. I'd like to order:\n\n${order.join("\n")}\n\nTotal: $${total.toFixed(2)}`;
    window.open(`sms:${phoneNumber}?&body=${encodeURIComponent(msg)}`, "_blank");
  });
}

// ====== Clear Cart ======
const clearOrderBtn = document.getElementById("clear-order");
if(clearOrderBtn) {
  clearOrderBtn.addEventListener("click", () => {
    order = [];
    total = 0;
    if(orderList) orderList.innerHTML = "";
    if(orderTotal) orderTotal.textContent = "0.00";
    if(bubbleTotal) bubbleTotal.textContent = "0.00";
    const customerName = document.getElementById("customer-name");
    if(customerName) customerName.value = "";
  });
}

// ====== PayPal Checkout ======
if(document.getElementById("paypal-button-container")) {
  paypal.Buttons({
    createOrder: (data, actions) => {
      return actions.order.create({ purchase_units: [{ amount: { value: total.toFixed(2) } }] });
    },
    onApprove: (data, actions) => {
      return actions.order.capture().then(details => {
        alert(`Transaction completed by ${details.payer.name.given_name}!`);
        order = [];
        total = 0;
        if(orderList) orderList.innerHTML = "";
        if(orderTotal) orderTotal.textContent = "0.00";
        if(bubbleTotal) bubbleTotal.textContent = "0.00";
        const customerName = document.getElementById("customer-name");
        if(customerName) customerName.value = "";
      });
    }
  }).render('#paypal-button-container');
}
