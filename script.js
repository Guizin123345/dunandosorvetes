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
  const totalPicolesDiv = document.getElementById("total-picoles");

  cartItems.innerHTML = "";
  let total = 0;

  const totalPicoles = cart
    .filter(item => item.name.toLowerCase().includes("picolé"))
    .reduce((sum, item) => sum + item.quantity, 0);

  cart.forEach((item, index) => {
    let itemPrice = item.price;

    if (item.name.toLowerCase().includes("picolé")) {
      if (totalPicoles >= 25) itemPrice = 1.50;
      else if (totalPicoles >= 10) itemPrice = 1.80;
      else itemPrice = 2.50;
    }

    const itemTotal = item.quantity * itemPrice;
    total += itemTotal;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.quantity}x - ${item.name}
      <button onclick="removeFromCart(${index})"
        style="margin-left: 10px; background: red; color: white; border: none;
        border-radius: 3px; padding: 2px 6px; cursor: pointer;">X</button>
    `;
    cartItems.appendChild(li);
  });

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  totalDisplay.textContent = `Total: R$ ${total.toFixed(2)}`;
  if (totalPicolesDiv) {
    totalPicolesDiv.textContent = `Total de picolés: ${totalPicoles}`;
  }

  atualizarEntrega(totalPicoles);
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

function estaDentroDoHorario() {
  const agora = new Date();
  const dia = agora.getDay();
  const hora = agora.getHours();
  const minutos = agora.getMinutes();
  const horaAtual = hora + minutos / 60;

  if (dia >= 1 && dia <= 5) {
    return horaAtual >= 15.5 && horaAtual <= 20;
  } else {
    return horaAtual >= 9 && horaAtual <= 20;
  }
}

function enviarPedidoWhatsApp() {
  if (!estaDentroDoHorario()) {
    alert("Pedidos só podem ser feitos durante o horário de funcionamento:\n\nSegunda a Sexta: 16:30 às 20:00\nSábado e Domingo: 09:00 às 20:00");
    return;
  }

  const nome = document.getElementById("cliente-nome").value.trim();
  const entrega = document.getElementById("cliente-entrega").value;
  const pagamento = document.getElementById("cliente-pagamento").value;
  const rua = document.getElementById("cliente-rua").value.trim();
  const numero = document.getElementById("cliente-numero").value.trim();
  const bairro = document.getElementById("cliente-bairro").value.trim();

  if (!nome || entrega === "" || pagamento === "") {
    alert("Por favor, preencha o nome, selecione a forma de entrega e a forma de pagamento.");
    return;
  }

  if (entrega !== "retirada" && (!rua || !numero || !bairro)) {
    alert("Por favor, preencha os campos de endereço para entrega.");
    return;
  }

  const totalPicoles = cart
    .filter(item => item.name.toLowerCase().includes("picolé"))
    .reduce((sum, item) => sum + item.quantity, 0);

  let total = 0;
  let notaFiscal = `*DUNANDO SORVETES - NOTA FISCAL*\n`;
  notaFiscal += `----------------------------------\n`;
  notaFiscal += `*Itens do Pedido:*\n`;

  cart.forEach(item => {
    let precoFinal = item.price;

    if (item.name.toLowerCase().includes("picolé")) {
      if (totalPicoles >= 25) precoFinal = 1.50;
      else if (totalPicoles >= 10) precoFinal = 1.80;
      else precoFinal = 2.50;
    }

    const valorItem = item.quantity * precoFinal;
    total += valorItem;

    notaFiscal += `• ${item.quantity}x ${item.name}\n`;
    notaFiscal += `  R$ ${precoFinal.toFixed(2)} x ${item.quantity} = *R$ ${valorItem.toFixed(2)}*\n`;
  });

  notaFiscal += `----------------------------------\n`;
  notaFiscal += `*Total de Picolés:* ${totalPicoles}\n`;
  notaFiscal += `*Valor Total:* *R$ ${total.toFixed(2)}*\n`;
  notaFiscal += `----------------------------------\n`;
  notaFiscal += `*Cliente:* ${nome}\n`;
  notaFiscal += `*Entrega:* ${entrega === "retirada" ? "Retirada na loja" : entrega === "regiao5" ? "Região 5" : "Demais regiões"}\n`;

  if (entrega !== "retirada") {
    notaFiscal += `*Endereço:* ${rua}, Nº ${numero}, Bairro ${bairro}\n`;
  }

  notaFiscal += `*Forma de Pagamento:* ${pagamento}\n`;

  const agora = new Date();
  notaFiscal += `----------------------------------\n`;
  notaFiscal += `*Data:* ${agora.toLocaleDateString()}\n`;
  notaFiscal += `*Hora:* ${agora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n`;
  notaFiscal += `----------------------------------\n`;
  notaFiscal += `Pedido gerado via site dunandosorvetes.com.br`;

  const url = `https://wa.me/5527999183240?text=${encodeURIComponent(notaFiscal)}`;
  window.open(url, '_blank');
  fecharPopup();
}



function atualizarEntrega(totalPicoles) {
  const entregaSelect = document.getElementById("cliente-entrega");
  entregaSelect.innerHTML = '<option value="">Selecione...</option>';

  if (totalPicoles <= 24) {
    entregaSelect.innerHTML += '<option value="retirada">Retirada na loja</option>';
  } else if (totalPicoles <= 39) {
    entregaSelect.innerHTML += '<option value="retirada">Retirada na loja</option>';
    entregaSelect.innerHTML += '<option value="regiao5">Entrega para região 5</option>';
  } else {
    entregaSelect.innerHTML += '<option value="retirada">Retirada na loja</option>';
    entregaSelect.innerHTML += '<option value="regiao5">Entrega para região 5</option>';
    entregaSelect.innerHTML += '<option value="outras">Entrega para demais regiões de Vila Velha</option>';
  }

  entregaSelect.onchange = function () {
    const entrega = entregaSelect.value;
    const camposEndereco = ["cliente-rua", "cliente-numero", "cliente-bairro"];

    if (entrega === "retirada" || entrega === "") {
      camposEndereco.forEach(id => {
        const campo = document.getElementById(id);
        campo.disabled = true;
        campo.required = false;
        campo.value = "";
      });
    } else {
      camposEndereco.forEach(id => {
        const campo = document.getElementById(id);
        campo.disabled = false;
        campo.required = true;
      });
    }
  };

  entregaSelect.dispatchEvent(new Event('change'));
}

function changeQuantity(button, delta) {
  const input = button.parentElement.querySelector("input[type=number]");
  let currentValue = parseInt(input.value) || 1;
  currentValue += delta;
  if (currentValue < 1) currentValue = 1;
  input.value = currentValue;
}