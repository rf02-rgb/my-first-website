/* ========================= */
/* SEARCH DROPDOWN */
/* 搜索框下拉菜单 */
/* ========================= */

const searchInput = document.getElementById("searchInput");
const searchDropdown = document.getElementById("searchDropdown");

/* 先判断页面上是否存在 searchInput 和 searchDropdown
   因为不是每个页面都有搜索框，避免 JavaScript 报错 */
if (searchInput && searchDropdown) {

  /* 点击搜索框时，显示下拉菜单 */
  searchInput.addEventListener("click", function(event) {
    event.stopPropagation(); // 阻止点击事件传到 document
    searchDropdown.classList.add("active"); // 添加 active class，让 dropdown 显示
  });

  /* 点击下拉菜单本身时，不让它马上关闭 */
  searchDropdown.addEventListener("click", function(event) {
    event.stopPropagation();
  });

  /* 点击页面其他地方时，关闭下拉菜单 */
  document.addEventListener("click", function() {
    searchDropdown.classList.remove("active");
  });
}


/* ========================= */
/* PRODUCT DETAIL ACCORDION */
/* 产品详情页折叠信息栏 */
/* ========================= */

const accordionHeaders = document.querySelectorAll(".accordion-header");

/* 找到所有 accordion header，并给每一个添加点击事件 */
accordionHeaders.forEach(function(header) {
  header.addEventListener("click", function() {

    const item = header.parentElement; // 当前点击的 accordion item
    item.classList.toggle("active");   // 点击时打开/关闭内容

    const icon = header.querySelector("span:last-child"); // 找到右边的 + / -

    /* 如果 item 有 active，说明已展开，符号变成 -
       否则恢复成 + */
    if (item.classList.contains("active")) {
      icon.textContent = "-";
    } else {
      icon.textContent = "+";
    }
  });
});


/* ========================= */
/* PRODUCT DETAIL → CART */
/* ========================= */

let selectedSize = "W27";

const sizeButtons = document.querySelectorAll(".size-options button");
const addToBagBtn = document.getElementById("addToBagBtn");

sizeButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    sizeButtons.forEach(function(btn) {
      btn.classList.remove("active");
    });

    button.classList.add("active");
    selectedSize = button.textContent.trim();
  });
});

if (addToBagBtn) {
  addToBagBtn.addEventListener("click", function() {
    const productPage = document.querySelector(".product-detail-page");

    const newItem = {
      id: productPage.dataset.productId,
      name: productPage.dataset.productName,
      price: Number(productPage.dataset.productPrice),
      size: selectedSize,
      quantity: 1,
      image: productPage.dataset.productImage
    };

    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    const existingItem = cartItems.find(function(item) {
      return item.id === newItem.id && item.size === newItem.size;
    });

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push(newItem);
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    window.location.href = "cart.html";
  });
}


/* ========================= */
/* CART PAGE UPDATE */
/* ========================= */

const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartCount = document.getElementById("cartCount");
const subtotalPrice = document.getElementById("subtotalPrice");
const totalPrice = document.getElementById("totalPrice");

let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

function updateCartDisplay() {
  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";

  let totalQuantity = 0;
  let totalAmount = 0;

  cartItems.forEach(function(item, index) {
    totalQuantity += item.quantity;
    totalAmount += item.price * item.quantity;

    const cartProduct = document.createElement("div");
    cartProduct.classList.add("cart-product");

    cartProduct.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-main-image">

      <div class="cart-product-info">
        <h2>${item.name}</h2>
        <p class="cart-item-price">$${item.price}</p>
        <p>${item.size}</p>

        <div class="cart-actions">
          <div class="quantity-box">
            <button type="button" class="decreaseQty" data-index="${index}">−</button>
            <span>${item.quantity}</span>
            <button type="button" class="increaseQty" data-index="${index}">+</button>
          </div>

          <button type="button" class="remove-btn removeItem" data-index="${index}">Remove</button>
        </div>
      </div>
    `;

    cartItemsContainer.appendChild(cartProduct);
  });

  cartCount.textContent = totalQuantity;
  subtotalPrice.textContent = "$" + totalAmount.toFixed(2);
  totalPrice.textContent = "$" + totalAmount.toFixed(2);

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

if (cartItemsContainer) {
  updateCartDisplay();

  cartItemsContainer.addEventListener("click", function(event) {
    const index = event.target.dataset.index;

    if (event.target.classList.contains("increaseQty")) {
      cartItems[index].quantity += 1;
      updateCartDisplay();
    }

    if (event.target.classList.contains("decreaseQty")) {
      if (cartItems[index].quantity > 1) {
        cartItems[index].quantity -= 1;
      }
      updateCartDisplay();
    }

    if (event.target.classList.contains("removeItem")) {
      cartItems.splice(index, 1);
      updateCartDisplay();
    }
  });
}

/* ========================= */
/* CHECKOUT PAGE DATA */
/* ========================= */

const checkoutItemsContainer = document.getElementById("checkoutItemsContainer");
const checkoutHeaderTotal = document.getElementById("checkoutHeaderTotal");
const checkoutSubtotal = document.getElementById("checkoutSubtotal");
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutItemCount = document.getElementById("checkoutItemCount");

if (checkoutItemsContainer) {
  const checkoutItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  let checkoutQuantity = 0;
  let checkoutAmount = 0;

  checkoutItemsContainer.innerHTML = "";

  checkoutItems.forEach(function(item) {
    checkoutQuantity += item.quantity;
    checkoutAmount += item.price * item.quantity;

    const itemElement = document.createElement("div");
    itemElement.classList.add("checkout-item");

    itemElement.innerHTML = `
      <div class="checkout-item-img">
        <img src="${item.image}" alt="${item.name}">
        <span>${item.quantity}</span>
      </div>

      <div>
        <h3>${item.name}</h3>
        <p>${item.size} / White</p>
      </div>

      <p class="checkout-item-price">$${item.price.toFixed(2)}</p>
    `;

    checkoutItemsContainer.appendChild(itemElement);
  });

  checkoutHeaderTotal.textContent = "$" + checkoutAmount.toFixed(2);
  checkoutSubtotal.textContent = "$" + checkoutAmount.toFixed(2);
  checkoutTotal.textContent = "$" + checkoutAmount.toFixed(2);
  checkoutItemCount.textContent = checkoutQuantity;
}

