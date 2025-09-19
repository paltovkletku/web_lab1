document.addEventListener("DOMContentLoaded", () => {
  const addButtons = document.querySelectorAll(".add-to-cart");
  let cart = getCart();

  addButtons.forEach(btn => {
    const product = btn.closest(".product");
    const id = product.dataset.id;

    if (cart.some(item => item.id === id)) {
      btn.textContent = "Товар в корзине";
      btn.disabled = false;
      btn.classList.add("in-cart");
      btn.addEventListener("click", () => {
        window.location.href = "cart.html";
    });
    } else {
      btn.addEventListener("click", () => {
        addToCart(product);
        btn.textContent = "Товар в корзине";
        btn.disabled = false;
        btn.classList.add("in-cart");
        btn.addEventListener("click", () => {
          window.location.href = "cart.html";
      });

      });
    }
  });

  if (document.getElementById("cart-items")) {
    renderCart();
  }

  const orderForm = document.getElementById("order-form");
  if (orderForm) {
    orderForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const currentCart = getCart();
      if (currentCart.length === 0) {
        showEmptyModal();
        return;
      }
      localStorage.removeItem("cart");
      showOrderSuccess();
    });
  }

  const modal = document.getElementById("modal");
  const modalClose = document.getElementById("modal-close");
  if (modalClose) {
    modalClose.addEventListener("click", () => {
      modal.classList.remove("show");
      window.location.href = "index.html";
    });
  }
});

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function addToCart(product) {
  let cart = getCart();
  const id = product.dataset.id;
  const title = product.dataset.title;
  const price = parseInt(product.dataset.price);
  const image = product.dataset.image;

  if (!cart.some(item => item.id === id)) {
    cart.push({ id, title, price, quantity: 1, image });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  let cart = getCart();
  const cartContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  if (!cartContainer) return;

  cartContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartEmpty.style.display = "block";
    cartTotal.textContent = "";
    return;
  } else {
    cartEmpty.style.display = "none"; 
  }

  cart.forEach((item, index) => {
    const line = document.createElement("div");
    line.classList.add("cart-item");
    line.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="item-info">
        <strong>${item.title}</strong><br>
        ${item.price} руб.
      </div>
      <div class="qty-controls">
        <button class="minus" data-index="${index}">-</button>
        <span>${item.quantity}</span>
        <button class="plus" data-index="${index}">+</button>
      </div>
      <button class="remove-btn" data-index="${index}">Удалить</button>
    `;
    cartContainer.appendChild(line);
    total += item.price * item.quantity;
  });

  cartTotal.textContent = `Итого: ${total} руб.`;

  cartContainer.querySelectorAll(".plus").forEach(btn => {
    btn.addEventListener("click", e => {
      let cart = getCart();
      cart[e.target.dataset.index].quantity++;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });
  });

  cartContainer.querySelectorAll(".minus").forEach(btn => {
    btn.addEventListener("click", e => {
      let cart = getCart();
      let i = e.target.dataset.index;
      if (cart[i].quantity > 1) cart[i].quantity--;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });
  });

  cartContainer.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      let cart = getCart();
      cart.splice(e.target.dataset.index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });
  });
}

function showEmptyModal() {
  const modal = document.getElementById("modal");
  modal.classList.add("show");
}

function showOrderSuccess() {
  const successModal = document.getElementById("order-success");
  successModal.classList.add("show");
  setTimeout(() => {
    successModal.classList.remove("show");
    window.location.href = "index.html";
  }, 2000);
}
