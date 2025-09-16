document.addEventListener("DOMContentLoaded", () => {
  const addButtons = document.querySelectorAll(".add-to-cart");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  addButtons.forEach(btn => {
    const product = btn.closest(".product");
    const id = product.dataset.id;

    if (cart.some(item => item.id === id)) {
      btn.textContent = "Товар в корзине";
      btn.disabled = true;
    }

    btn.addEventListener("click", () => {
      addToCart(product);
      btn.textContent = "Товар в корзине";
      btn.disabled = true;
    });
  });

function addToCart(product) {
  const id = product.dataset.id;
  const title = product.dataset.title;
  const price = parseInt(product.dataset.price);
  const image = product.dataset.image;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart.some(item => item.id === id)) {
    cart.push({ id, title, price, image });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}
