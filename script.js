/* Contoh data produk */
const products = [
  { id: 1, name: 'Lipstick Velvet', price: 95000, category: 'Lips', image: 'https://via.placeholder.com/400x300?text=Lipstick' },
  { id: 2, name: 'Foundation Matte', price: 125000, category: 'Face', image: 'https://via.placeholder.com/400x300?text=Foundation' },
  { id: 3, name: 'Blush Sheer', price: 65000, category: 'Face', image: 'https://via.placeholder.com/400x300?text=Blush' },
  { id: 4, name: 'Eyeshadow Palette', price: 150000, category: 'Eyes', image: 'https://via.placeholder.com/400x300?text=Eyeshadow' },
  { id: 5, name: 'Mascara Lash', price: 85000, category: 'Eyes', image: 'https://via.placeholder.com/400x300?text=Mascara' },
  { id: 6, name: 'Highlighter Glow', price: 80000, category: 'Face', image: 'https://via.placeholder.com/400x300?text=Highlighter' }
];

/* State */
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

/* DOM */
const productsEl = document.getElementById('products');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const searchEl = document.getElementById('search');
const categoryFilter = document.getElementById('categoryFilter');

/* Utils */
function formatCurrency(n){
  return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
}

/* Render category options */
function populateCategories(){
  const cats = ['all', ...new Set(products.map(p=>p.category))];
  categoryFilter.innerHTML = cats.map(c=>`<option value="${c}">${c==='all' ? 'Semua Kategori' : c}</option>`).join('');
}

/* Render products */
function renderProducts(filterText='', category='all'){
  const filtered = products.filter(p=>{
    const matchText = p.name.toLowerCase().includes(filterText.toLowerCase());
    const matchCat = category === 'all' ? true : p.category === category;
    return matchText && matchCat;
  });

  productsEl.innerHTML = filtered.map(p=>`
    <article class="product-card">
      <img src="${p.image}" alt="${p.name}">
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${formatCurrency(p.price)}</div>
        <button class="btn add-btn" data-id="${p.id}">Tambah ke Keranjang</button>
      </div>
    </article>
  `).join('');
}

/* Cart handling */
function saveCart(){
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount(){
  const total = cart.reduce((s,i)=>s+i.quantity,0);
  cartCount.textContent = total;
}

function openCart_sidebar(){
  cartSidebar.classList.remove('hidden');
  cartSidebar.setAttribute('aria-hidden','false');
  renderCartItems();
}

function closeCart_sidebar(){
  cartSidebar.classList.add('hidden');
  cartSidebar.setAttribute('aria-hidden','true');
}

function addToCart(id){
  const prod = products.find(p=>p.id==id);
  const existing = cart.find(i=>i.id==id);
  if(existing){ existing.quantity++ } else { cart.push({...prod, quantity:1}) }
  saveCart();
  updateCartCount();
}

function renderCartItems(){
  cartItemsEl.innerHTML = cart.map(item=>`
    <li class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div style="flex:1">
        <div style="font-weight:600">${item.name}</div>
        <div>${formatCurrency(item.price)} x ${item.quantity}</div>
      </div>
      <div>
        <button class="btn" data-action="minus" data-id="${item.id}">-</button>
        <button class="btn" data-action="plus" data-id="${item.id}">+</button>
        <button class="btn" data-action="remove" data-id="${item.id}">Hapus</button>
      </div>
    </li>
  `).join('') || '<p>Keranjang kosong</p>';

  const total = cart.reduce((s,i)=>s+i.price*i.quantity,0);
  cartTotalEl.textContent = formatCurrency(total);
}

function changeQuantity(id, delta){
  const item = cart.find(i=>i.id==id);
  if(!item) return;
  item.quantity += delta;
  if(item.quantity <= 0){ cart = cart.filter(i=>i.id!=id) }
  saveCart();
  renderCartItems();
  updateCartCount();
}

function removeItem(id){
  cart = cart.filter(i=>i.id!=id);
  saveCart();
  renderCartItems();
  updateCartCount();
}

/* Events */
productsEl.addEventListener('click', e=>{
  if(e.target.matches('.add-btn')){
    const id = e.target.dataset.id;
    addToCart(Number(id));
  }
});

cartBtn.addEventListener('click', openCart_sidebar);
closeCart.addEventListener('click', closeCart_sidebar);

cartItemsEl.addEventListener('click', e=>{
  const id = Number(e.target.dataset.id);
  const action = e.target.dataset.action;
  if(!id) return;
  if(action === 'plus') changeQuantity(id, 1);
  if(action === 'minus') changeQuantity(id, -1);
  if(action === 'remove') removeItem(id);
});

checkoutBtn.addEventListener('click', ()=>{
  if(cart.length === 0){ alert('Keranjang kosong'); return }
  alert('Terima kasih! Pesananmu berhasil diproses (simulasi).');
  cart = [];
  saveCart();
  renderCartItems();
  updateCartCount();
  closeCart_sidebar();
});

searchEl.addEventListener('input', ()=>{
  renderProducts(searchEl.value, categoryFilter.value);
});

categoryFilter.addEventListener('change', ()=>{
  renderProducts(searchEl.value, categoryFilter.value);
});

/* Init */
populateCategories();
renderProducts();
renderCartItems();
updateCartCount();

// Simple accessibility: close cart on ESC
window.addEventListener('keydown', e=>{ if(e.key==='Escape') closeCart_sidebar() });
