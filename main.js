// ====== Cart Setup ======
let order = JSON.parse(localStorage.getItem("cartOrder")) || [];
let total = parseFloat(localStorage.getItem("cartTotal")) || 0;

const orderList = document.getElementById("order-list");
const orderTotal = document.getElementById("order-total");
const bubbleTotal = document.getElementById("bubble-total");
const phoneNumber = "15615021743";

// ====== Render Cart ======
function renderCart() {
    if(orderList) orderList.innerHTML = '';

    total = 0;
    order.forEach(item => {
        if(orderList){
            const li = document.createElement("li");
            li.textContent = item;
            orderList.appendChild(li);
        }

        const match = item.match(/\$([0-9.]+)/);
        if(match) total += parseFloat(match[1]);
    });

    if(orderTotal) orderTotal.textContent = total.toFixed(2);
    if(bubbleTotal) bubbleTotal.textContent = total.toFixed(2);
}

renderCart();

// ====== Add Item to Cart ======
function addItemToCart(item, price, qty) {
    const line = `${item} x${qty} - $${(price*qty).toFixed(2)}`;
    order.push(line);
    localStorage.setItem("cartOrder", JSON.stringify(order));
    localStorage.setItem("cartTotal", (total + price*qty).toFixed(2));
    renderCart();
}

// ====== Add-to-Order Button Logic ======
document.querySelectorAll(".add-to-order").forEach(btn => {
    btn.addEventListener("click", () => {
        btn.classList.add("clicked");
        setTimeout(() => btn.classList.remove("clicked"), 200);

        let item = btn.dataset.item;
        let price = parseFloat(btn.dataset.price) || 0;
        let qty = 1;

        // Check quantity input
        const input = btn.previousElementSibling;
        if(input && input.tagName === "INPUT") {
            qty = parseInt(input.value) || 1;
        }

        // Handle flavor selection
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
document.getElementById("send-order")?.addEventListener("click", () => {
    const name = document.getElementById("customer-name").value.trim();
    if(!name || order.length === 0){ alert("Name/order required"); return; }

    const msg = `Hello! My name is ${name}. I'd like to order:\n\n${order.join("\n")}\n\nTotal: $${total.toFixed(2)}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`, "_blank");
});

// ====== SMS Order ======
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
function renderPayPal() {
    if(!document.getElementById("paypal-button-container")) return;

    // Clear existing buttons if any
    document.getElementById("paypal-button-container").innerHTML = '';

    paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
        createOrder: (data, actions) => {
            if(total <= 0){
                alert("Add items to your cart first!");
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

                // Clear cart after successful payment
                order = [];
                total = 0;
                localStorage.removeItem("cartOrder");
                localStorage.removeItem("cartTotal");
                renderCart();
                document.getElementById("customer-name").value = "";

                // Re-render PayPal button (disabled because total is now 0)
                renderPayPal();
            });
        },
        onError: (err) => {
            console.error(err);
            alert("Payment could not be completed. Try again or use another device.");
        }
    }).render('#paypal-button-container');
}

// Initial PayPal render
renderPayPal();

// ====== Update PayPal button whenever cart changes ======
const observer = new MutationObserver(renderPayPal);
if(orderList) observer.observe(orderList, { childList: true });
