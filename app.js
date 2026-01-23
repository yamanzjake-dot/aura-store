// 👇👇 ضع الرابط الخاص بك هنا 👇👇
const API_URL = "https://script.google.com/macros/s/AKfycbzkqmS5KOpP03G4724EPrkint1jdFTmEIT9NXVtqaLOsSVjvrs7dSEXH-5tGsZ_qEGDBQ/exec";

let state = { products: [], cart: [], current: null, selection: {} };

window.onload = async () => {
    try {
        const res = await fetch(`${API_URL}?action=products`);
        const data = await res.json();
        
        if (Array.isArray(data) && data.length > 0) {
            state.products = data;
            initApp();
        } else {
            document.getElementById('products-grid').innerHTML = '<p style="text-align:center; padding:20px;">لا يوجد منتجات.. تأكد من تعبئة ملف الإكسل</p>';
        }
    } catch(e) {
        console.error(e);
        document.getElementById('products-grid').innerHTML = '<p style="text-align:center; padding:20px;">خطأ في الاتصال بالسيرفر</p>';
    }

    document.getElementById('c-phone').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
};

function initApp() {
    renderCategories();
    renderExclusiveOffers(); // 🔥 تشغيل العروض الحصرية
    renderBestSellers();
    renderGrid('all');
}

/* ✅ دالة إصلاح روابط الصور */
function fixImgUrl(url) {
    if (!url) return 'https://via.placeholder.com/300?text=No+Image';
    url = url.trim();
    if (url.includes('drive.google.com')) {
        let id = null;
        let match1 = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match1 && match1[1]) id = match1[1];
        else {
            let match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
            if (match2 && match2[1]) id = match2[1];
        }
        if (id) return `https://drive.google.com/uc?export=view&id=${id}`;
    }
    return url;
}

function setMainImage(url) {
    if(url) document.querySelector('.detail-img').src = fixImgUrl(url);
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function openPolicy(modalId) { document.getElementById(modalId).classList.add('active'); }
function closePolicy(modalId) { document.getElementById(modalId).classList.remove('active'); }

function renderCategories() {
    const cats = ['الكل', ...new Set(state.products.map(p => p.category).filter(c => c && c.trim() !== ''))];
    const nav = document.getElementById('categories-nav');
    nav.innerHTML = cats.map(c => `
        <button class="cat-btn ${c === 'الكل' ? 'active' : ''}" onclick="filterByCat(this, '${c}')">
            ${c}
        </button>
    `).join('');
}

function filterByCat(btn, category) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderGrid(category);
}

function renderGrid(filter) {
    const grid = document.getElementById('products-grid');
    const title = document.getElementById('main-title');
    
    let filtered = state.products;
    if (filter !== 'all' && filter !== 'الكل') {
        filtered = state.products.filter(p => p.category === filter);
        title.innerText = `✨ ${filter}`;
    } else {
        title.innerText = `✨ كل المنتجات`;
    }

    if(filtered.length === 0) {
        grid.innerHTML = '<p style="text-align:center; grid-column:1/-1;">لا يوجد منتجات في هذا القسم</p>';
        return;
    }

    grid.innerHTML = filtered.map(p => `
        <div class="card" onclick="openProduct(${p.id})">
            <img src="${fixImgUrl(p.main_image)}" class="card-img" loading="lazy" referrerpolicy="no-referrer">
            <div class="card-body">
                <div class="card-title">${p.name}</div>
                <div class="card-price">${p.base_price} JOD</div>
            </div>
        </div>
    `).join('');
}

/* ⭐ دالة عرض العروض الحصرية الجديدة ⭐ */
function renderExclusiveOffers() {
    // تصفية المنتجات التي لها is_offer = true
    const offers = state.products.filter(p => String(p.is_offer).toLowerCase() === 'true');
    
    if(offers.length > 0) {
        document.getElementById('exclusive-section').style.display = 'block';
        const container = document.getElementById('exclusive-grid');
        
        container.innerHTML = offers.map(p => `
            <div class="best-card" onclick="openProduct(${p.id})">
                <div class="sale-badge">SALE %</div>
                <img src="${fixImgUrl(p.main_image)}" style="width:100%; height:140px; object-fit:contain; background:#fff;" referrerpolicy="no-referrer">
                <div style="padding:8px;">
                    <div style="font-weight:bold; font-size:0.8rem; margin-bottom:4px; white-space:nowrap; overflow:hidden;">${p.name}</div>
                    
                    <div class="price-box">
                        <span class="old-price">${p.old_price || ''} JOD</span>
                        <span class="new-price">${p.base_price} JOD</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function renderBestSellers() {
    const best = state.products.filter(p => String(p.best_seller).toLowerCase() === 'true');
    if(best.length > 0) {
        document.getElementById('best-seller-section').style.display = 'block';
        const container = document.getElementById('best-seller-grid');
        container.innerHTML = best.map(p => `
            <div class="best-card" onclick="openProduct(${p.id})">
                <div class="fire-tag">🔥 الأكثر طلباً</div>
                <img src="${fixImgUrl(p.main_image)}" style="width:100%; height:140px; object-fit:contain; background:#fff;" referrerpolicy="no-referrer">
                <div style="padding:8px;">
                    <div style="font-weight:bold; font-size:0.8rem; margin-bottom:4px; white-space:nowrap; overflow:hidden;">${p.name}</div>
                    <div style="color:var(--primary-dark); font-weight:bold;">${p.base_price} JOD</div>
                </div>
            </div>
        `).join('');
    }
}

function openProduct(id) {
    state.current = state.products.find(p => p.id == id);
    state.selection = {};

    let variantsHtml = '';
    
    if (state.current.variants_list && state.current.variants_list.length > 0) {
        state.current.variants_list.forEach(v => state.selection[v.variant_name] = 0);
        variantsHtml = `
            <div style="font-weight:bold; margin-bottom:10px; color:#555;">اختر الموديلات المطلوبة:</div>
            <div class="variants-list">
                ${state.current.variants_list.map(v => `
                    <div class="variant-row">
                        <div class="v-info" onclick="setMainImage('${v.variant_image}')">
                            <img src="${fixImgUrl(v.variant_image)}" class="v-img" referrerpolicy="no-referrer">
                            <span class="v-name">${v.variant_name}</span>
                        </div>
                        <div class="mini-qty">
                            <button class="mq-btn" onclick="changeQty('${v.variant_name}', -1)">-</button>
                            <span id="qty-${v.variant_name.replace(/\s/g, '-')}" class="mq-val">0</span>
                            <button class="mq-btn" onclick="changeQty('${v.variant_name}', 1)">+</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        state.selection['Default'] = 1;
        variantsHtml = `<div style="margin:20px 0; text-align:center; color:#555;">هذا المنتج متوفر بقطعة واحدة</div>`;
    }

    const html = `
        <img src="${fixImgUrl(state.current.main_image)}" class="detail-img" referrerpolicy="no-referrer">
        <h2 class="detail-title">${state.current.name}</h2>
        <div class="detail-desc">${state.current.description || 'لا يوجد وصف'}</div>
        ${variantsHtml}
        <div style="border-top:1px solid #EEE; padding-top:15px; margin-top:10px;">
            <button id="add-btn" class="btn-primary" onclick="addToCart()">
                ${state.current.variants_list.length ? 'حدد الكمية لإضافتها' : 'أضف للسلة'}
            </button>
        </div>
    `;

    document.getElementById('modal-body').innerHTML = html;
    document.getElementById('product-modal').classList.add('active');
    
    if(state.current.variants_list.length > 0) updateBtnTotal();
}

function changeQty(name, delta) {
    let newVal = (state.selection[name] || 0) + delta;
    if (newVal < 0) newVal = 0;
    state.selection[name] = newVal;
    const safeId = name.replace(/\s/g, '-');
    const el = document.getElementById(`qty-${safeId}`);
    if(el) el.innerText = newVal;
    updateBtnTotal();
}

function updateBtnTotal() {
    let totalQty = 0;
    for (let k in state.selection) totalQty += state.selection[k];
    const total = (totalQty * state.current.base_price).toFixed(2);
    const btn = document.getElementById('add-btn');
    if (totalQty === 0) {
        btn.innerText = "يرجى تحديد الكمية";
        btn.style.opacity = "0.6";
    } else {
        btn.innerText = `أضف ${totalQty} قطع (${total} JOD)`;
        btn.style.opacity = "1";
    }
}

function addToCart() {
    let added = false;
    for (let [vName, qty] of Object.entries(state.selection)) {
        if (qty > 0) {
            const existingItem = state.cart.find(item => item.id == state.current.id && item.variant == vName);
            if (existingItem) {
                existingItem.qty += qty;
            } else {
                state.cart.push({
                    id: state.current.id, name: state.current.name, price: state.current.base_price, variant: vName, qty: qty
                });
            }
            added = true;
        }
    }
    
    if (!state.current.variants_list.length && !added) {
         const existingItem = state.cart.find(item => item.id == state.current.id && item.variant == 'Default');
         if (existingItem) { existingItem.qty += 1; } 
         else { state.cart.push({ id: state.current.id, name: state.current.name, price: state.current.base_price, variant: 'Default', qty: 1 }); }
         added = true;
    }

    if (added) {
        updateBadge(true);
        closeModal();
    }
}

function updateBadge(animate = false) {
    const count = state.cart.reduce((a,b) => a + b.qty, 0);
    const badge = document.getElementById('cart-badge');
    const btn = document.querySelector('.cart-btn');
    badge.innerText = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
    if (animate) {
        btn.classList.add('cart-animate');
        setTimeout(() => { btn.classList.remove('cart-animate'); }, 500);
    }
}

function openCheckout() {
    if(state.cart.length === 0) return alert("السلة فارغة");
    const form = document.getElementById('order-form');
    const old = form.querySelector('.cart-list');
    if(old) old.remove();

    let total = 0;
    let listHtml = `<div class="cart-list">`;
    state.cart.forEach((item, idx) => {
        total += item.price * item.qty;
        listHtml += `
            <div class="cart-item">
                <div>
                    <div style="font-weight:bold;">${item.name}</div>
                    <div class="cart-details">${item.variant} | عدد: ${item.qty}</div>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="font-weight:bold; color:var(--primary);">${(item.price*item.qty).toFixed(2)}</div>
                    <div class="delete-btn" onclick="removeItem(${idx})">✕</div>
                </div>
            </div>
        `;
    });
    listHtml += `</div>`;
    
    form.insertAdjacentHTML('afterbegin', listHtml);
    document.getElementById('bill-sub').innerText = total.toFixed(2);
    document.getElementById('bill-total').innerText = (total + 3).toFixed(2) + " JOD";
    document.getElementById('checkout-modal').classList.add('active');
}

function removeItem(idx) {
    state.cart.splice(idx, 1);
    updateBadge();
    state.cart.length === 0 ? closeCheckout() : openCheckout();
}

async function submitOrder(e) {
    e.preventDefault();
    const phone = document.getElementById('c-phone').value;
    if(phone.length !== 10) return alert("رقم الهاتف يجب أن يكون 10 خانات");

    document.getElementById('loader').style.display = 'flex';
    
    const order = {
        name: document.getElementById('c-name').value,
        phone: phone,
        city: document.getElementById('c-city').value,
        address: document.getElementById('c-address').value,
        note: document.getElementById('c-note').value,
        cart: state.cart,
        total: document.getElementById('bill-total').innerText
    };

    try {
        await fetch(API_URL, {
            method: 'POST', mode: 'no-cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(order)
        });
        document.getElementById('loader').style.display = 'none';
        state.cart = [];
        updateBadge();
        closeCheckout();
        alert("تم استلام طلبك بنجاح! سيتم التواصل معك قريباً ❤️");
    } catch(err) {
        document.getElementById('loader').style.display = 'none';
        alert("حدث خطأ في الاتصال");
    }
}

function closeModal() { document.getElementById('product-modal').classList.remove('active'); }
function closeCheckout() { document.getElementById('checkout-modal').classList.remove('active'); }