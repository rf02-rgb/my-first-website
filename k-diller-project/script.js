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
/* 从产品详情页传数据到购物车 */
/* ========================= */

/* 默认选择 W27，如果用户没有点尺码，就使用这个默认值 */
let selectedSize = "W27";

const sizeButtons = document.querySelectorAll(".size-options button");
const addToBagBtn = document.getElementById("addToBagBtn");

/* 给每个尺码按钮添加点击事件 */
sizeButtons.forEach(function(button) {
  button.addEventListener("click", function() {

    /* 先移除所有尺码按钮的 active 状态 */
    sizeButtons.forEach(function(btn) {
      btn.classList.remove("active");
    });

    /* 给当前点击的按钮添加 active 状态 */
    button.classList.add("active");

    /* 保存用户选择的尺码，例如 W24 / W27 / W34 */
    selectedSize = button.textContent.trim();
  });
});

/* 点击 ADD TO BAG 时执行 */
if (addToBagBtn) {
  addToBagBtn.addEventListener("click", function() {

    /* 创建一个产品数据对象，用来存储购物车需要的信息 */
    const productData = {
      name: "Drifter Low Rise Straight Leg Jeans in Painter Wash",
      price: 235,
      size: selectedSize,
      quantity: 1,
      image: "images/product1-front view.jpg"
    };

    /* 使用 localStorage 保存产品数据
       这样跳转到 cart.html 后，购物车页面还能读取到这些信息 */
    localStorage.setItem("cartProduct", JSON.stringify(productData));

    /* 保存后跳转到购物车页面 */
    window.location.href = "cart.html";
  });
}


/* ========================= */
/* CART PAGE UPDATE */
/* 购物车页面实时更新 */
/* ========================= */

/* 获取购物车页面中的元素 */
const cartProductName = document.getElementById("cartProductName");
const cartProductPrice = document.getElementById("cartProductPrice");
const cartProductSize = document.getElementById("cartProductSize");
const cartQuantity = document.getElementById("cartQuantity");
const cartCount = document.getElementById("cartCount");
const subtotalPrice = document.getElementById("subtotalPrice");
const totalPrice = document.getElementById("totalPrice");
const cartMainImage = document.getElementById("cartMainImage");

/* 获取数量按钮和 remove 按钮 */
const increaseQty = document.getElementById("increaseQty");
const decreaseQty = document.getElementById("decreaseQty");
const removeItem = document.getElementById("removeItem");

/* 从 localStorage 读取刚刚在产品详情页保存的产品数据 */
let cartProduct = JSON.parse(localStorage.getItem("cartProduct"));

/* 如果没有读取到数据，就使用默认产品数据
   这样即使用户直接打开 cart.html，页面也不会报错 */
if (!cartProduct) {
  cartProduct = {
    name: "Drifter Low Rise Straight Leg Jeans in Painter Wash",
    price: 235,
    size: "W27",
    quantity: 1,
    image: "images/product1-front view.jpg"
  };
}

/* 这个 function 负责把 cartProduct 数据显示到页面上 */
function updateCartDisplay() {

  /* 如果当前页面不是 cart.html，就直接停止
     因为其他页面没有 cartProductName 这个元素 */
  if (!cartProductName) return;

  /* 更新产品名称、价格、尺码、数量 */
  cartProductName.textContent = cartProduct.name;
  cartProductPrice.textContent = "$" + cartProduct.price;
  cartProductSize.textContent = cartProduct.size;
  cartQuantity.textContent = cartProduct.quantity;
  cartCount.textContent = cartProduct.quantity;

  /* 计算总价：单价 × 数量 */
  const total = cartProduct.price * cartProduct.quantity;

  /* 更新 subtotal 和 total */
  subtotalPrice.textContent = "$" + total.toFixed(2);
  totalPrice.textContent = "$" + total.toFixed(2);

  /* 更新购物车图片 */
  if (cartMainImage) {
    cartMainImage.src = cartProduct.image;
  }

  /* 每次数量改变后，都重新保存到 localStorage */
  localStorage.setItem("cartProduct", JSON.stringify(cartProduct));
}

/* 如果当前是购物车页面，就先显示一次购物车数据 */
if (cartProductName) {
  updateCartDisplay();
}

/* 点击 + 时，数量增加 1，并更新价格 */
if (increaseQty) {
  increaseQty.addEventListener("click", function() {
    cartProduct.quantity += 1;
    updateCartDisplay();
  });
}

/* 点击 - 时，数量减少 1
   但最低不能小于 1 */
if (decreaseQty) {
  decreaseQty.addEventListener("click", function() {
    if (cartProduct.quantity > 1) {
      cartProduct.quantity -= 1;
      updateCartDisplay();
    }
  });
}

/* 点击 Remove 时，清空购物车数据，并返回产品详情页 */
if (removeItem) {
  removeItem.addEventListener("click", function() {
    localStorage.removeItem("cartProduct");
    window.location.href = "product-1.html";
  });
}