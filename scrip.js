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