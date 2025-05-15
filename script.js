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

  cartItems.innerHTML = "";
  let total = 0;

  let totalPicolés = cart
    .filter(item => item.name.toLowerCase().includes("picolé"))
    .reduce((sum, item) => sum + item.quantity, 0);

  cart.forEach((item, index) => {
    let itemPrice = item.price;

    if (item.name.toLowerCase().includes("picolé")) {
      if (totalPicolés >= 25) itemPrice = 1.50;
      else if (totalPicolés >= 10) itemPrice = 1.80;
      else itemPrice = 2.50;
    }

    const itemTotal = item.quantity * itemPrice;
    total += itemTotal;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.quantity}x - ${item.name}
      <button onclick="removeFromCart(${index})" style="margin-left: 10px; background: red; color: white; border: none; border-radius: 3px; padding: 2px 6px; cursor: pointer;">X</button>
    `;
    cartItems.appendChild(li);
  });

  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  totalDisplay.textContent = `Total: R$ ${total.toFixed(2)}`;
}

function toggleCart() {
  const cartBox = document.getElementById("cart");
  cartBox.style.display = cartBox.style.display === "block" ? "none" : "block";
}

function abrirPopup() {
  const popup = document.getElementById("dados-popup");
  popup.style.display = "flex";
}

function fecharPopup() {
  const popup = document.getElementById("dados-popup");
  popup.style.display = "none";
}

// Verifica se está dentro do horário de funcionamento
function estaDentroDoHorario() {
  const agora = new Date();
  const dia = agora.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
  const hora = agora.getHours();
  const minutos = agora.getMinutes();

  const horaAtual = hora + minutos / 60;

  if (dia >= 1 && dia <= 5) {
    // Segunda a sexta - das 16:30 às 20:00
    return horaAtual >= 16.5 && horaAtual <= 20;
  } else {
    // Sábado e Domingo - das 09:00 às 20:00
    return horaAtual >= 9 && horaAtual <= 20;
  }
}

function enviarPedidoWhatsApp() {
  if (!estaDentroDoHorario()) {
    alert("Pedidos só podem ser feitos durante o horário de funcionamento:\n\nSegunda a Sexta: 16:30 às 20:00\nSábado e Domingo: 09:00 às 20:00");
    return;
  }

  const nome = document.getElementById("cliente-nome").value.trim();
  const rua = document.getElementById("cliente-rua").value.trim();
  const numero = document.getElementById("cliente-numero").value.trim();
  const bairro = document.getElementById("cliente-bairro").value.trim();

  if (!nome || !rua || !numero || !bairro) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  let message = "Olá eu gostaria de fazer um pedido:%0A%0A";
  let total = 0;

  let totalPicolés = cart
    .filter(item => item.name.toLowerCase().includes("picolé"))
    .reduce((sum, item) => sum + item.quantity, 0);

  cart.forEach(item => {
    let itemPrice = item.price;

    if (item.name.toLowerCase().includes("picolé")) {
      if (totalPicolés >= 25) itemPrice = 1.50;
      else if (totalPicolés >= 10) itemPrice = 1.80;
      else itemPrice = 2.50;
    }

    total += itemPrice * item.quantity;
    message += `${item.quantity}x - ${item.name}%0A`;
  });

  message += `%0A------------------%0A`;
  message += `Nome: ${nome}%0A`;
  message += `Endereço: ${rua}, Nº ${numero}, Bairro ${bairro}%0A`;
  message += `%0ATotal: R$ ${total.toFixed(2)}`;

  const url = `https://wa.me/5527999183240?text=${message}`;
  window.open(url, '_blank');

  fecharPopup();
}
