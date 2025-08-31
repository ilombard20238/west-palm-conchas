// ====== Cart Setup ======
let order = JSON.parse(localStorage.getItem("cartOrder")) || [];
let total = parseFloat(localStorage.getItem("cartTotal")) || 0;

const orderList = document.getElementById("order-list");
const orderTotal = document.getElementById("order-total");
const bubbleTotal = document.getElementById("bubble-total");
const phoneNumber = "15615021743";

// ====== Update Cart Display ======
function renderCart() {
    orderList.innerHTML = '';
    total = 0;

    order.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        orderList.appendChild(li);

        const match = item.match(/\$([0-9.]+)/);
        if (match) total += parseFloat(match[1]);
    });

    orderTotal.textContent = total.toFixed(2);
    bubbleTotal.textContent = total.toFixed(2);
}

renderCart();

// ====== Add to Cart Function ======
function addItemToCart(item, price, qty) {
    const line = `${item} x${qty} - $${(price*qty).toFixed(2)}`;
    order.push(line);
    localStorage.setItem("cartOrder", JSON.stringify(order));
    localStorage.setItem("cartTotal", (total + price*qty).toFixed(2));
    renderCart();
}

// ====== WhatsApp & SMS ======
document.getElementById("send-order")?.addEventListener("click", () => {
    const name = document.getElementById("customer-name").value.trim();
    if(!name || order.length === 0){ alert("Name/order required"); return; }
    const msg = `Hello! My name is ${name}. I'd like to order:\n\n${order.join("\n")}\n\nTotal: $${total.toFixed(2)}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`, "_blank");
});

document.getElementById("send-sms")?.addEventListener("click", () => {
    const name = document.getElementById("customer-name").value.trim();
    if(!name || order.length === 0){ alert("Name/order required"); return; }
    const msg = `Hello! My name is ${name}. I'd like to order:\n\n${order.join("\n")}\n\nTotal: $${total.toFixed(2)}`;
    window.open(`sms:${phoneNumber}?&body=${encodeURIComponent(msg)}`, "_blank");
});

// ====== Clear Cart ======
document.getElementById("clear-order")?.addEventListener("click", () => {
    order = [];
    total = 0;
    localStorage.removeItem("cartOrder");
    localStorage.removeItem("cartTotal");
    renderCart();
    document.getElementById("customer-name").value = "";
});

// ====== PayPal Checkout ======
if(document.getElementById("paypal-button-container")) {
    paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
        createOrder: (data, actions) => {
            if(total <= 0){
                alert("Add items to cart first!");
                return;
            }
            return actions.order.create({
                purchase_units: [{
                    amount: { value: total.toFixed(2) }
                }]
            });
        },
        onApprove: (data, actions) => {
            return actions.order.capture().then(details => {
                alert(`Thank you ${details.payer.name.given_name}! Your payment of $${total.toFixed(2)} was successful.`);
                order = [];
                total = 0;
                localStorage.removeItem("cartOrder");
                localStorage.removeItem("cartTotal");
                renderCart();
                document.getElementById("customer-name").value = "";
            });
        },
        onError: (err) => {
            console.error(err);
            alert("Payment could not be completed. Try again or use another device.");
        }
    }).render('#paypal-button-container');
}
