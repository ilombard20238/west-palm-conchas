// ====== CART STATE ======
let order = JSON.parse(localStorage.getItem("cartOrder")) || [];

const orderList = document.getElementById("order-list");
const orderTotal = document.getElementById("order-total");
const bubbleTotal = document.getElementById("bubble-total");
const phoneNumber = "15615021743";

// ====== SAVE ======
function saveCart() {
    localStorage.setItem("cartOrder", JSON.stringify(order));
}

// ====== CALCULATE TOTAL ======
function getTotal() {
    return order.reduce((sum, item) => {
        return sum + (item.price * item.qty);
    }, 0);
}

// ====== RENDER ======
function renderCart() {
    if (orderList) orderList.innerHTML = "";

    order.forEach(item => {
        if (orderList) {
            const li = document.createElement("li");
            li.textContent = `${item.qty}x ${item.name} - $${(item.price * item.qty).toFixed(2)}`;
            orderList.appendChild(li);
        }
    });

    const total = getTotal();

    if (orderTotal) orderTotal.textContent = total.toFixed(2);
    if (bubbleTotal) bubbleTotal.textContent = total.toFixed(2);
}

// ====== ADD ITEM ======
function addItemToCart(name, price, qty) {
    const existing = order.find(i => i.name === name);

    if (existing) {
        existing.qty += qty;
    } else {
        order.push({ name, price, qty });
    }

    saveCart();
    renderCart();
}

// ====== BUTTONS ======
document.querySelectorAll(".add-to-order").forEach(btn => {
    btn.addEventListener("click", () => {

        let name = btn.dataset.item;
        let price = parseFloat(btn.dataset.price) || 0;
        let qty = 1;

        const input = btn.previousElementSibling;
        if (input && input.tagName === "INPUT") {
            qty = parseInt(input.value) || 1;
        }

        // flavor dropdown
        if (btn.dataset.flavorSelect) {
            const select = document.getElementById(btn.dataset.flavorSelect);
            if (select) {
                const opt = select.options[select.selectedIndex];
                name = `${name} (${opt.value})`;
                price = parseFloat(opt.dataset.price);
            }
        }

        addItemToCart(name, price, qty);
    });
});

// ====== LOAD ======
renderCart();
