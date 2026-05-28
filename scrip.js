const backupProducts = [
    { id: 1,  name: "Gọng Kính 210400",              category: "Kính gọng",               price: 400000,  img: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=400&q=80" },
    { id: 2,  name: "Gọng Kính Reeman 0455",          category: "Kính gọng",               price: 690000,  img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80" },
    { id: 3,  name: "Gọng Kính 93030",                category: "Kính gọng",               price: 450000,  img: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=400&q=80" },
    { id: 4,  name: "Gọng Kính Đa Giác H00216",       category: "Kính gọng",               price: 550000,  img: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=400&q=80" },
    { id: 5,  name: "Kính Thể Thao AD38 Đen Cam",     category: "Kính râm",                price: 380000,  img: "https://images.unsplash.com/photo-1589831377283-33cb1cc6ba5d?auto=format&fit=crop&w=400&q=80" },
    { id: 6,  name: "Gọng Kính 83116 Vàng Hồng",      category: "Kính gọng",               price: 380000,  img: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=400&q=80" },
    { id: 7,  name: "Gọng Kính Reeman RM3777",         category: "Kính cao cấp",            price: 1880000, img: "https://images.unsplash.com/photo-1582142339678-8318e8732eb8?auto=format&fit=crop&w=400&q=80" },
    { id: 8,  name: "Kính Râm Phi Công Classic",       category: "Kính râm",                price: 600000,  img: "https://images.unsplash.com/photo-1473496169904-658ba7574b0d?auto=format&fit=crop&w=400&q=80" },
    { id: 9,  name: "Kính Chống Ánh Sáng Xanh Pro",   category: "Chống ánh sáng xanh",     price: 350000,  img: "https://images.unsplash.com/photo-1536924430914-91f9e2041b83?auto=format&fit=crop&w=400&q=80" },
    { id: 10, name: "Kính Râm Oversized Retro",        category: "Kính râm",                price: 520000,  img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=400&q=80" },
    { id: 11, name: "Gọng Kính Acetate Tortoise",      category: "Kính cao cấp",            price: 950000,  img: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=400&q=80" },
    { id: 12, name: "Kính Chống UV400 Sport",          category: "Kính râm",                price: 420000,  img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=400&q=80" }
];


let products = [];
let activeFilter = 'all';

// Hàm bổ trợ định dạng tiền tệ (Sử dụng chung cho cả UI và Giỏ hàng)
const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n) + ' đ';

// FEATURE UI: Xử lý bộ lọc sản phẩm khi click vào danh mục
function setFilter(cat) {
    activeFilter = cat;
    document.querySelectorAll('.filter-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.cat === cat)
    );
    renderProducts();
}

// FEATURE UI: Hiển thị danh sách sản phẩm theo bộ lọc ra màn hình
function renderProducts() {
    const list = activeFilter === 'all'
        ? products
        : products.filter(p => p.category === activeFilter);

    const grid = document.getElementById('product-list');
    if (!grid) return;

    grid.innerHTML = list.map(p => `
        <div class="product-card" id="card-${p.id}">
            <div class="product-img-wrap">
                <img src="${p.img}" alt="${p.name}"
                     onerror="this.src='https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=400&q=80'">
                <span class="product-badge">${p.category}</span>
            </div>
            <div class="product-body">
                <p class="product-title">${p.name}</p>
                <p class="product-price">${fmt(p.price)}</p>
                <button class="btn-add" id="btn-${p.id}" onclick="addToCart(${p.id})">
                    🛒 Thêm vào giỏ
                </button>
            </div>
        </div>
    `).join('');
}

// FEATURE UI: Render thanh danh mục lọc tự động (Tất cả, Gọng kính, Kính râm...)
function renderFilters() {
    const cats = ['all', ...new Set(products.map(p => p.category))];
    const bar = document.getElementById('filter-bar');
    if (!bar) return;
    const labels = { all: 'Tất cả' };
    bar.innerHTML = '<span>🔖 Lọc theo:</span>' + cats.map(c => `
        <button class="filter-btn ${c === 'all' ? 'active' : ''}"
                data-cat="${c}" onclick="setFilter('${c}')">
            ${labels[c] || c}
        </button>
    `).join('');
}

// FEATURE UI: Fetch API đọc file JSON sản phẩm
function loadProducts() {
    fetch('./products.json')
        .then(res => {
            if (!res.ok) throw new Error('Không đọc được JSON');
            return res.json();
        })
        .then(data => {
            products = data;
            renderFilters();
            renderProducts();
            console.log('✅ [UI] Tải dữ liệu thành công.');
        })
        .catch(err => {
            console.warn('⚠️ [UI] Dùng dữ liệu dự phòng:', err.message);
            products = backupProducts; // Biến mảng dự phòng nếu có
            renderFilters();
            renderProducts();
        });
}

window.addEventListener('DOMContentLoaded', loadProducts);

let cart = [];

// FEATURE CART: Hiển thị thông báo Toast nhanh khi có tương tác hành động
function showToast(msg) {
    let t = document.getElementById('toast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'toast';
        t.className = 'toast';
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

// FEATURE CART: Thêm sản phẩm vào giỏ hàng & tạo hiệu ứng đổi chữ trên Button
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(i => i.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    // Hiệu ứng tương tác UI đổi trạng thái nút thêm
    const btn = document.getElementById(`btn-${productId}`);
    if (btn) {
        btn.classList.add('added');
        btn.textContent = '✔ Đã thêm!';
        setTimeout(() => {
            btn.classList.remove('added');
            btn.innerHTML = '🛒 Thêm vào giỏ';
        }, 1200);
    }

    showToast(`✅ Đã thêm "${product.name}" vào giỏ!`);
    renderCart();
}

// FEATURE CART: Thay đổi số lượng tăng/giảm mặt hàng ngay trong giỏ
function changeQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }
    renderCart();
}

// FEATURE CART: Làm trống giỏ hàng
function clearCart() {
    if (cart.length === 0) return;
    if (!confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) return;
    cart = [];
    renderCart();
}

// FEATURE CART: Vẽ lại giỏ hàng và thực hiện tính toán tổng tiền
function renderCart() {
    const container  = document.getElementById('cart-items');
    const footer     = document.getElementById('cart-footer');
    const totalEl    = document.getElementById('cart-total-price');
    const countEl    = document.getElementById('cart-count');
    if (!container) return;

    const totalQty   = cart.reduce((s, i) => s + i.quantity, 0);
    const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    if (countEl) countEl.textContent = totalQty;

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart">🛍️ Chưa có sản phẩm nào trong giỏ.</p>';
        if (footer) footer.style.display = 'none';
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img class="cart-item-img" src="${item.img}" alt="${item.name}"
                 onerror="this.src='https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=100&q=60'">
            <div class="cart-item-info">
                <p class="cart-item-title">${item.name}</p>
                <p class="cart-item-price">${fmt(item.price * item.quantity)}</p>
            </div>
            <div class="qty-controls">
                <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
                <span class="qty-num">${item.quantity}</span>
                <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
            </div>
        </div>
    `).join('');

    if (totalEl)  totalEl.textContent  = fmt(totalPrice);
    if (footer)   footer.style.display = 'block';
}

// FEATURE CART: Xử lý thông báo Checkout khi bấm đặt hàng
function checkout() {
    if (cart.length === 0) return;
    const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const items = cart.map(i => `${i.name} x${i.quantity}`).join('\n');
    alert(`🎉 Đặt hàng thành công!\n\nSản phẩm:\n${items}\n\nTổng tiền: ${fmt(totalPrice)}\n\nCảm ơn bạn đã mua sắm! 🛍️`);
    cart = [];
    renderCart();
}