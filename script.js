let cart = [];

function addToCart(button) {
  const productDiv = button.parentElement;
  const name = productDiv.dataset.name;
  const price = parseFloat(productDiv.dataset.price);
  const quantity = parseInt(productDiv.querySelector("input").value);

  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ name, price, quantity });
  }

  updateCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function clearCart() {
  cart = [];
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const totalDisplay = document.getElementById("total");
  const whatsappButton = document.getElementById("whatsapp-button");

  cartItems.innerHTML = "";
  let total = 0;
  let message = "Olá eu gostaria de fazer um pedido:%0A%0A";

  // Conta total de picolés no carrinho
  let totalPicolés = cart
    .filter(item => item.name.toLowerCase().includes("picolé"))
    .reduce((sum, item) => sum + item.quantity, 0);

  cart.forEach((item, index) => {
    let itemPrice = item.price;

    // Aplica desconto progressivo para picolés
    if (item.name.toLowerCase().includes("picolé")) {
      if (totalPicolés >= 25) {
        itemPrice = 1.50;
      } else if (totalPicolés >= 10) {
        itemPrice = 1.80;
      } else {
        itemPrice = 2.50;
      }
    }

    const itemTotal = item.quantity * itemPrice;
    total += itemTotal;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.quantity}x - ${item.name}
      <button onclick="removeFromCart(${index})" style="margin-left: 10px; background: red; color: white; border: none; border-radius: 3px; padding: 2px 6px; cursor: pointer;">X</button>
    `;
    cartItems.appendChild(li);

    message += `${item.quantity}x - ${item.name}%0A`;
  });

  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  totalDisplay.textContent = `Total: R$ ${total.toFixed(2)}`;
  message += `%0A total: R$ ${total.toFixed(2)}`;
  whatsappButton.href = `https://wa.me/5527999183240?text=${message}`;
}

function toggleCart() {
  const cartBox = document.getElementById("cart");
  cartBox.style.display = cartBox.style.display === "block" ? "none" : "block";
}
