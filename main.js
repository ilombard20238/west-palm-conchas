let order = [];
let total = 0;
const orderList = document.getElementById("order-list");
const orderTotal = document.getElementById("order-total");
const phoneNumber = "15615021743"; // bakery number

// Add to Order buttons
document.querySelectorAll(".add-to-order").forEach(btn => {
  btn.addEventListener("click", () => {
    let item = btn.dataset.item;
    let price = parseFloat(btn.dataset.price);
    let qty = parseInt(btn.previousElementSibling.value || 1);
    if(qty>0){ addItemToCart(item, price, qty); }
  });
});

// Croissant buttons
document.querySelectorAll(".croissant-option").forEach(btn=>{
  btn.addEventListener("click",()=>{
    let item = btn.dataset.item;
    let price = parseFloat(btn.dataset.price);
    addItemToCart(item, price, 1);
  });
});

function addItemToCart(item, price, qty){
  order.push(`${item} x${qty} - $${(price*qty).toFixed(2)}`);
  total+= price*qty;
  let li = document.createElement("li");
  li.textContent = `${item} x${qty} - $${(price*qty).toFixed(2)}`;
  orderList.appendChild(li);
  orderTotal.textContent = total.toFixed(2);
}

// WhatsApp
document.getElementById("send-order").addEventListener("click",()=>{
  const name = document.getElementById("customer-name").value.trim();
  if(!name || order.length===0){alert("Name/order required"); return;}
  let msg = `Hello! My name is ${name}. I'd like to order:\n\n${order.join("\n")}\n\nTotal: $${total.toFixed(2)}`;
  window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`,"_blank");
});

// SMS
document.getElementById("send-sms").addEventListener("click",()=>{
  const name = document.getElementById("customer-name").value.trim();
  if(!name || order.length===0){alert("Name/order required"); return;}
  let msg = `Hello! My name is ${name}. I'd like to order:\n\n${order.join("\n")}\n\nTotal: $${total.toFixed(2)}`;
  window.open(`sms:${phoneNumber}?&body=${encodeURIComponent(msg)}`,"_blank");
});

// Clear
document.getElementById("clear-order").addEventListener("click",()=>{
  order=[]; total=0; orderList.innerHTML=""; orderTotal.textContent="0.00";
  document.getElementById("customer-name").value="";
});

// PayPal
paypal.Buttons({
  createOrder:(data,actions)=>{
    return actions.order.create({ purchase_units:[{amount:{value:total.toFixed(2)}}] });
  },
  onApprove:(data,actions)=>{
    return actions.order.capture().then(details=>{
      alert(`Transaction completed by ${details.payer.name.given_name}!`);
      order=[]; total=0; orderList.innerHTML=""; orderTotal.textContent="0.00";
    });
  }
}).render('#paypal-button-container');
