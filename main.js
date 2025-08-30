let order = [];
let total = 0;
const orderList = document.getElementById("order-list");
const orderTotal = document.getElementById("order-total");
const phoneNumber = "15615021743"; // bakery number

// Function to update PayPal total dynamically
function updatePayPalTotal() {
  totalAmount = total.toFixed(2); // update PayPal total
}

// Add item to cart
function addItemToCart(item, price, qty) {
  order.push(`${item} x${qty} - $${(price*qty).toFixed(2)}`);
  total += price*qty;
  const li = document.createElement("li");
  li.textContent = `${item} x${qty} - $${(price*qty).toFixed(2)}`;
  orderList.appendChild(li);
  orderTotal.textContent = total.toFixed(2);
  updatePayPalTotal();
}

// WhatsApp order
document.getElementById("send-order").addEventListener("click", () => {
  const name = document.getElementById("customer-name").value.trim();
  if(!name || order.length === 0){ alert("Name/order required"); return; }
  const msg = `Hello! My name is ${name}. I'd like to order:\n\n${order.join("\n")}\n\nTotal: $${total.toFixed(2)}`;
  window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`, "_blank");
});

// SMS order
document.getElementById("send-sms").addEventListener("click", () => {
  const name = document.getElementById("customer-name").value.trim();
  if(!name || order.length === 0){ alert("Name/order required"); return; }
  const msg = `Hello! My name is ${name}. I'd like to order:\n\n${order.join("\n")}\n\nTotal: $${total.toFixed(2)}`;
  window.open(`sms:${phoneNumber}?&body=${encodeURIComponent(msg)}`, "_blank");
});

// Clear cart
document.getElementById("clear-order").addEventListener("click", () => {
  order = [];
  total = 0;
  orderList.innerHTML = "";
  orderTotal.textContent = "0.00";
  document.getElementById("customer-name").value = "";
  updatePayPalTotal();
});

// PayPal integration
let totalAmount = total.toFixed(2); // initial total

paypal.Buttons({
  createOrder: (data, actions) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: totalAmount
        }
      }]
    });
  },
  onApprove: (data, actions) => {
    return actions.order.capture().then(details => {
      alert(`Transaction completed by ${details.payer.name.given_name}!`);
      // Clear cart after successful payment
      order = [];
      total = 0;
      orderList.innerHTML = "";
      orderTotal.textContent = "0.00";
      document.getElementById("customer-name").value = "";
      updatePayPalTotal();
    });
  }
}).render('#paypal-button-container');
