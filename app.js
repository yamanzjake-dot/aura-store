// ⚠️ الرابط الجديد الذي زودتني به
const API_URL = "https://script.google.com/macros/s/AKfycbwhp-xUXRfgU0shX-ub04QOecukLzcrGEo-B9RWe4FL0w48MlU4_-cU9byuDBBMXnEGiw/exec";

let state = { products: [], cart: [], currentProduct: null, currentImages: [], zoomIndex: 0, variantTracker: {}, mainQty: 1 };
let slideInterval; 
let fuse; 

const sitePolicies = {
    privacy: {
        title: "🔒 سياسة الخصوصية",
        content: `<div style="text-align: right; line-height: 1.8;">نحن في Aura & Luxe نلتزم بحماية خصوصيتك. نقوم بجمع اسمك، رقم هاتفك، وعنوانك فقط لغايات توصيل الطلب.</div>`
    },
    shipping: {
        title: "📦 الشحن والتوصيل",
        content: `<div style="text-align: right; line-height: 1.8;">نقوم بالتوصيل لجميع محافظات المملكة.<br>عمان والزرقاء: 24-48 ساعة.<br>باقي المحافظات: 48-72 ساعة.<br>رسوم التوصيل: 3 دنانير تضاف عند إتمام الطلب.</div>`
    },
    refund: {
        title: "🔄 الاستبدال والاسترجاع",
        content: `<div style="text-align: right; line-height: 1.8;">يحق للعميل فتح الطرد ومعاينة المنتج قبل الدفع. في حال وجود عيب مصنعي، يتم الاستبدال مجاناً خلال 3 أيام.</div>`
    },
    contact: {
        title: "📞 معلومات التواصل",
        content: `<div style="text-align: right; line-height: 1.8;"><strong>رقم المدير / خدمة العملاء:</strong><br><a href="tel:962781808198" style="color:var(--primary);">0781808198</a><br><br><strong>البريد الإلكتروني:</strong><br><a href="mailto:babyandtoddlerss@gmail.com" style="color:var(--primary);">babyandtoddlerss@gmail.com</a></div>`
    },
    terms: {
        title: "⚖️ شروط الاستخدام",
        content: `<div style="text-align: right; line-height: 1.8;">الأسعار نهائية وتشمل الضريبة. يحق للمتجر إلغاء الطلب في حال عدم الرد على الهاتف.<br><br><strong>Disclaimer:</strong> This site is not a part of the Facebook website or Facebook Inc.</div>`
    }
};

window.onload = async () => {
    try {
        const res = await fetch(`${API_URL}?action=products`);
        state.products = await res.json();
        initSearchEngine();
        initApp();
        document.getElementById('loader').style.display = 'none';
        
        // 🌟 تشغيل مراقب السكرول (Animation Observer) 🌟
        setupScrollObserver();
    } catch(e) { 
        console.error(e);
        document.getElementById('loader').style.display = 'none';
    }
};

// 🌟 وظيفة Scroll Reveal (الزحلقة عند التمرير)
function setupScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    // نراقب الكروت والعناوين
    document.querySelectorAll('.card, .section-title, .hidden-stock-section').forEach(el => {
        el.classList.add('reveal'); // إضافة كلاس الإخفاء
        observer.observe(el);
    });
}

function initSearchEngine() {
    const options = { includeScore: true, threshold: 0.4, keys: ["name", "description", "models.name"] };
    fuse = new Fuse(state.products, options);
}

function handleSearch(query) {
    const suggestionsBox = document.getElementById('search-suggestions');
    if (!query.trim()) {
        renderGrid('all');
        document.getElementById('main-products-title').innerText = "✨ جميع المنتجات";
        document.getElementById('exclusive-section').style.display = 'block';
        document.getElementById('best-seller-section').style.display = 'block';
        suggestionsBox.style.display = 'none';
        setupScrollObserver(); // إعادة تفعيل الانيميشن
        return;
    }
    const results = fuse.search(query);
    const filteredProducts = results.map(r => r.item);
    document.getElementById('exclusive-section').style.display = 'none';
    document.getElementById('best-seller-section').style.display = 'none';
    document.getElementById('main-products-title').innerText = `🔍 نتائج البحث عن: ${query}`;
    
    if (filteredProducts.length > 0) {
        document.getElementById('products-grid').innerHTML = filteredProducts.map(p => productCard(p)).join('');
        const suggestionsHtml = results.slice(0, 5).map(r => {
            let matchText = "";
            if (r.matches && r.matches.length > 0) {
                const key = r.matches[0].key;
                if (key === "models.name") matchText = `<span class="s-match">(يوجد موديل: ${r.matches[0].value})</span>`;
            }
            return `<div class="suggestion-item" onclick="selectSuggestion(${r.item.id})"><img src="${fixUrl(r.item.main_image)}" class="s-img"><div class="s-info"><span class="s-name">${r.item.name}</span>${matchText}</div></div>`;
        }).join('');
        suggestionsBox.innerHTML = suggestionsHtml;
        suggestionsBox.style.display = 'block';
    } else {
        document.getElementById('products-grid').innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:20px; color:#666;">لا توجد نتائج مطابقة 😕</div>`;
        suggestionsBox.style.display = 'none';
    }
    setupScrollObserver(); // تفعيل الانيميشن للنتائج
}
function selectSuggestion(id) { document.getElementById('search-suggestions').style.display = 'none'; openProduct(id); }
document.addEventListener('click', function(e) { if (!document.querySelector('.search-container').contains(e.target)) document.getElementById('search-suggestions').style.display = 'none'; });

function initApp() { renderCategories(); renderSpecialSections(); renderGrid('all'); initHeroSlider(); }
function initHeroSlider() { const slides = document.querySelectorAll('.hero-slide'); let i = 0; if(slides.length > 1) { setInterval(() => { slides[i].classList.remove('active'); i = (i + 1) % slides.length; slides[i].classList.add('active'); }, 4000); } }
function renderCategories() { const cats = ['الكل', ...new Set(state.products.map(p => p.category).filter(c => c))]; document.getElementById('categories-nav').innerHTML = cats.map(c => `<button class="cat-btn ${c==='الكل'?'active':''}" onclick="filterByCat(this, '${c}')">${c}</button>`).join(''); }
function filterByCat(btn, cat) { if(btn) { document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); } if (cat === 'all' || cat === 'الكل') { renderGrid('all'); document.getElementById('main-products-title').innerText = "✨ جميع المنتجات"; } else { if(cat === 'offers') { scrollToSection('exclusive-section'); } else { renderGrid(cat); document.getElementById('main-products-title').innerText = `✨ قسم ${cat}`; document.getElementById('products-grid').scrollIntoView({ behavior: 'smooth', block: 'start' }); } } setupScrollObserver(); }
function renderSpecialSections() { 
    const offers = state.products.filter(p => String(p.is_offer).toLowerCase() === 'true'); 
    const best = state.products.filter(p => String(p.best_seller).toLowerCase() === 'true'); 
    if(offers.length) { 
        document.getElementById('exclusive-section').style.display = 'block'; 
        // إضافة كلاس اللمعة (Shimmer) للعروض
        document.getElementById('exclusive-grid').innerHTML = offers.map(p => miniCard(p, true)).join(''); 
    } 
    if(best.length) { 
        document.getElementById('best-seller-section').style.display = 'block'; 
        document.getElementById('best-seller-grid').innerHTML = best.map(p => miniCard(p, false)).join(''); 
    } 
}
function renderGrid(cat) { const filtered = (cat === 'all' || cat === 'الكل') ? state.products : state.products.filter(p => p.category === cat); document.getElementById('products-grid').innerHTML = filtered.map(p => productCard(p)).join(''); }

// إضافة كلاس reveal للكروت عند الإنشاء
function productCard(p) { return `<div class="card reveal" onclick="openProduct(${p.id})"><img src="${fixUrl(p.main_image)}" class="card-img" loading="lazy"><div class="card-body"><div class="card-title">${p.name}</div><div class="price-container">${getPriceHtml(p)}</div></div></div>`; }
function miniCard(p, isShimmer) { return `<div class="card reveal ${isShimmer ? 'shimmer-effect' : ''}" style="min-width:145px;" onclick="openProduct(${p.id})"><img src="${fixUrl(p.main_image)}" style="width:100%; height:110px; object-fit:contain; padding:5px;"><div style="padding:8px; text-align:center;"><div style="font-size:0.8rem; font-weight:bold; margin-bottom:5px; height:35px; overflow:hidden;">${p.name}</div><div class="price-container">${getPriceHtml(p)}</div></div></div>`; }
function getPriceHtml(p) { if(p.old_price && Number(p.old_price) > Number(p.base_price)) { return `<div class="old-price">${p.old_price} JOD</div><div class="price-red">${p.base_price} JOD</div>`; } return `<div class="price-normal">${p.base_price} JOD</div>`; }

function openProduct(id) {
    const p = state.products.find(x => x.id == id);
    state.currentProduct = p;
    state.variantTracker = {};
    state.mainQty = 1;

    let allImages = [];
    if (p.main_image && String(p.main_image).trim()) allImages.push(String(p.main_image).trim());
    if (p.gallery) {
        let cleanGallery = String(p.gallery).replace(/(\r\n|\n|\r)/gm, ",");
        let galParts = cleanGallery.split(',').map(s => s.trim()).filter(s => s !== "");
        allImages = [...allImages, ...galParts];
    }
    if (p.models && p.models.length > 0) {
        p.models.forEach(m => {
            if (m.image && m.image.trim()) allImages.push(m.image.trim());
            state.variantTracker[m.name] = 0;
        });
    }

    state.currentImages = [...new Set(allImages)].filter(img => img.length > 5);
    const thumbnailsHtml = state.currentImages.map((img, i) => `<div class="thumb-box ${i === 0 ? 'active' : ''}" onclick="manualSwitch('${img}', this)"><img src="${fixUrl(img)}"></div>`).join('');

    let controlsHtml = '';
    if (p.models && p.models.length > 0) {
        const variantsList = p.models.map(m => `
            <div class="variant-row">
                <div class="variant-info" onclick="openZoomToSpecificImage('${m.image}')">
                    <img src="${fixUrl(m.image)}" class="variant-img">
                    <span class="variant-name">${m.name}</span>
                </div>
                <div class="variant-controls">
                    <button class="v-btn" onclick="updateVariantQty('${m.name}', -1)">-</button>
                    <span class="v-qty" id="qty-${m.name.replace(/\s/g, '')}">0</span>
                    <button class="v-btn" onclick="updateVariantQty('${m.name}', 1, '${m.image}')">+</button>
                </div>
            </div>
        `).join('');
        controlsHtml = `<div class="variants-list">${variantsList}</div>`;
    } else {
        controlsHtml = `<div class="main-qty-wrapper"><div class="main-qty-ctrl"><button class="mq-btn" onclick="updateMainQty(-1)">-</button><span id="main-qty-display" class="mq-display">1</span><button class="mq-btn" onclick="updateMainQty(1)">+</button></div></div>`;
    }

    let priceModalHtml = `<div class="price-normal" style="font-size:1.4rem; margin:10px 0;">${p.base_price} JOD</div>`;
    if(p.old_price && Number(p.old_price) > Number(p.base_price)) {
        priceModalHtml = `<div style="display:flex; align-items:center; justify-content:center; gap:10px; margin:10px 0;"><span style="text-decoration:line-through; color:#999; font-size:1.1rem;">${p.old_price} JOD</span><span style="font-size:1.5rem; font-weight:900; color:#D32F2F;">${p.base_price} JOD</span></div>`;
    }

    document.getElementById('modal-sheet-content').innerHTML = `
        <div class="modal-header-sticky"><h3 style="font-family:'Marhey'; font-size:1rem; margin:0;">تفاصيل المنتج</h3><button class="close-sheet-btn" onclick="closeModal()">✕</button></div>
        <div class="modal-scroll-content">
            <div class="gallery-wrapper"><div class="main-img-container"><button class="preview-btn" onclick="openZoom()">🔍</button><img id="main-preview" src="${fixUrl(state.currentImages[0])}" class="main-img-view" onclick="openZoom()"></div><div class="thumbnails-strip">${thumbnailsHtml}</div></div>
            <h2 style="font-family:'Marhey'; color:var(--primary);">${p.name}</h2>
            ${priceModalHtml}
            <div style="background:#f9f9f9; padding:15px; border-radius:10px; margin-bottom:15px; text-align:right;"><p style="color:#555; line-height:1.7; font-size:0.9rem;">${p.description || 'لا يوجد وصف متاح.'}</p></div>
            <h3 style="font-size:1rem; margin-bottom:10px;">اختر الكمية والموديل:</h3>${controlsHtml}
            <div class="action-area-wrapper" id="action-buttons"><button class="order-submit" onclick="addToCart()">إضافة للسلة 🛒</button></div>
        </div>
    `;
    checkIfInCart();
    document.getElementById('product-modal').classList.add('active');
    if (state.currentImages.length > 1) startProductAutoSlide();
}

function startProductAutoSlide() {
    clearInterval(slideInterval);
    let idx = 0;
    slideInterval = setInterval(() => {
        idx = (idx + 1) % state.currentImages.length;
        const imgEl = document.getElementById('main-preview');
        if(imgEl) { imgEl.style.opacity = '0'; setTimeout(() => { imgEl.src = fixUrl(state.currentImages[idx]); imgEl.style.opacity = '1'; highlightThumbnail(idx); }, 200); }
    }, 3000);
}

function manualSwitch(src, thumbEl) {
    clearInterval(slideInterval);
    document.getElementById('main-preview').src = fixUrl(src);
    if(thumbEl) { document.querySelectorAll('.thumb-box').forEach(t => t.classList.remove('active')); thumbEl.classList.add('active'); } 
    else { const index = state.currentImages.findIndex(img => fixUrl(img) === fixUrl(src)); if (index !== -1) highlightThumbnail(index); }
}
function highlightThumbnail(index) { const thumbs = document.querySelectorAll('.thumb-box'); thumbs.forEach(t => t.classList.remove('active')); if(thumbs[index]) { thumbs[index].classList.add('active'); thumbs[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); } }

function openZoomToSpecificImage(url) { if(!url) return; const fixedUrl = fixUrl(url); const index = state.currentImages.findIndex(img => fixUrl(img) === fixedUrl); state.zoomIndex = (index !== -1) ? index : 0; updateZoomView(); document.getElementById('zoom-modal').classList.add('active'); }
function updateVariantQty(name, change, imgUrl) { if(change > 0 && imgUrl) manualSwitch(imgUrl); if (!state.variantTracker[name]) state.variantTracker[name] = 0; state.variantTracker[name] += change; if (state.variantTracker[name] < 0) state.variantTracker[name] = 0; const elId = `qty-${name.replace(/\s/g, '')}`; if(document.getElementById(elId)) document.getElementById(elId).innerText = state.variantTracker[name]; }
function updateMainQty(change) { state.mainQty += change; if (state.mainQty < 1) state.mainQty = 1; document.getElementById('main-qty-display').innerText = state.mainQty; }

function addToCart() {
    const p = state.currentProduct;
    let itemsAddedCount = 0;
    if (p.models && p.models.length > 0) {
        let hasSelection = false;
        for (const [modName, qty] of Object.entries(state.variantTracker)) {
            if (qty > 0) {
                hasSelection = true;
                const cartItemId = `${p.id}-${modName}`;
                const existingItem = state.cart.find(x => x.cartId === cartItemId);
                if (existingItem) { existingItem.qty += qty; } else { state.cart.push({ ...p, cartId: cartItemId, name: `${p.name} (${modName})`, qty: qty, price: p.base_price }); }
                itemsAddedCount += qty;
                state.variantTracker[modName] = 0;
                const elId = `qty-${modName.replace(/\s/g, '')}`;
                if(document.getElementById(elId)) document.getElementById(elId).innerText = "0";
            }
        }
        if (!hasSelection) return showToast("⚠️ يرجى اختيار كمية لموديل واحد على الأقل");
    } else {
        const cartItemId = `${p.id}-default`;
        const existingItem = state.cart.find(x => x.cartId === cartItemId);
        if (existingItem) { existingItem.qty += state.mainQty; } else { state.cart.push({ ...p, cartId: cartItemId, qty: state.mainQty }); }
        itemsAddedCount = state.mainQty;
        state.mainQty = 1;
        document.getElementById('main-qty-display').innerText = "1";
    }
    updateBadge(); 
    showToast(`✅ تمت إضافة ${itemsAddedCount} قطعة للسلة!`); 
    
    // 🌟 تفعيل هزة السلة 🌟
    const cartBtn = document.querySelector('.cart-btn');
    cartBtn.classList.add('shake');
    setTimeout(() => cartBtn.classList.remove('shake'), 500);
    
    checkIfInCart();
}

function openPolicy(type) {
    const policy = sitePolicies[type];
    if (policy) {
        document.getElementById('p-title').innerText = policy.title;
        document.getElementById('p-text').innerHTML = policy.content;
        document.getElementById('policy-modal').classList.add('active');
        document.getElementById('sidebar').classList.remove('active');
        document.getElementById('sidebar-overlay').classList.remove('active');
    }
}

function checkIfInCart() { const container = document.getElementById('action-buttons'); let html = `<button class="order-submit" onclick="addToCart()">إضافة للسلة 🛒</button>`; if (state.cart.length > 0) html += `<button class="go-cart-btn" onclick="openCheckout()">الذهاب للسلة الآن ⬅️</button>`; container.innerHTML = html; }
function updateCartQty(index, change) { state.cart[index].qty += change; if (state.cart[index].qty <= 0) state.cart.splice(index, 1); updateBadge(); openCheckout(); }
function updateBadge() { const b = document.getElementById('cart-badge'); const totalQty = state.cart.reduce((s, i) => s + i.qty, 0); b.innerText = totalQty; b.style.display = totalQty > 0 ? 'flex' : 'none'; }
function openCheckout() { if(!state.cart.length) { document.getElementById('cart-content-wrapper').innerHTML = `<div class="empty-cart-view"><span class="empty-icon">🛒</span><div class="empty-text">سلتك فارغة</div><button class="shop-now-btn" onclick="closeCheckout()">تسوّق الآن</button></div>`; document.getElementById('checkout-modal').classList.add('active'); return; } let total = state.cart.reduce((s, i) => s + (Number(i.base_price) * i.qty), 0); document.getElementById('cart-content-wrapper').innerHTML = `<div class="delivery-note">🚚 التوصيل خلال 24-48 ساعة</div><div id="cart-items" class="cart-list">${state.cart.map((i, idx) => `<div class="cart-item"><div class="cart-info"><span style="font-weight:bold;color:#555;">${i.name}</span><div class="cart-qty-ctrl"><button class="cart-mini-btn" onclick="updateCartQty(${idx}, -1)">-</button><span class="cart-mini-qty">${i.qty}</span><button class="cart-mini-btn" onclick="updateCartQty(${idx}, 1)">+</button></div></div><span style="font-weight:bold;color:#2B2D42;">${(i.base_price * i.qty).toFixed(2)}</span></div>`).join('')}</div><div id="total-box" class="total-display"><div style="margin-top:10px;padding-top:10px;border-top:2px dashed #ddd;">الإجمالي: <span style="font-size:1.3rem;">${(total+3).toFixed(2)} JOD</span></div></div><form onsubmit="submitOrder(event)"><input type="text" id="cust-name" placeholder="الاسم" required class="form-input"><input type="tel" id="cust-phone" placeholder="الهاتف" required class="form-input"><select id="cust-city" required class="form-input"><option value="" disabled selected>المحافظة...</option><option>عمان</option><option>إربد</option><option>الزرقاء</option><option>السلط</option><option>العقبة</option><option>مادبا</option><option>جرش</option><option>عجلون</option><option>الكرك</option><option>الطفيلة</option><option>معان</option><option>المفرق</option></select><textarea id="cust-address" placeholder="العنوان..." required class="form-input address-input"></textarea><button type="submit" id="submit-btn" class="order-submit">تأكيد الطلب 🚀</button></form>`; document.getElementById('checkout-modal').classList.add('active'); }
function submitOrder(e) { e.preventDefault(); const btn = document.getElementById('submit-btn'); btn.innerText = "جاري الإرسال..."; btn.disabled = true; const data = { name: document.getElementById('cust-name').value, phone: document.getElementById('cust-phone').value, city: document.getElementById('cust-city').value, address: document.getElementById('cust-address').value, cart: state.cart, total: document.getElementById('total-box').innerText.replace('الإجمالي:', '').trim() }; fetch(API_URL + "?action=order", { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).catch(console.error); let items = state.cart.map(i => `- ${i.name} (x${i.qty})`).join('%0A'); window.open(`https://wa.me/962781591754?text=*طلب جديد 🛒*%0A%0A👤 ${data.name}%0A📱 ${data.phone}%0A📍 ${data.city}%0A🏠 ${data.address}%0A%0A📦 *الطلبات:*%0A${items}%0A%0A💰 *${data.total}*`, '_blank'); btn.innerText = "تأكيد الطلب 🚀"; btn.disabled = false; state.cart = []; updateBadge(); closeCheckout(); }
function closeModal() { document.getElementById('product-modal').classList.remove('active'); clearInterval(slideInterval); }
function closeCheckout() { document.getElementById('checkout-modal').classList.remove('active'); }
function closePolicy() { document.getElementById('policy-modal').classList.remove('active'); }
function showPolicy(t,x) { document.getElementById('p-title').innerText=t; document.getElementById('p-text').innerText=x; document.getElementById('policy-modal').classList.add('active'); toggleSidebar(); }
function scrollToSection(id) { toggleSidebar(); const el = document.getElementById(id); if(el) { el.style.display = 'block'; el.scrollIntoView({ behavior: 'smooth' }); } }
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('active'); document.getElementById('sidebar-overlay').classList.toggle('active'); }
function fixUrl(url) { if(!url) return ''; if(url.includes('drive')) return `https://drive.google.com/uc?export=view&id=${url.split('id=')[1]||url.split('/d/')[1].split('/')[0]}`; return url; }
function openHiddenRequest() { window.open(`https://wa.me/962781591754?text=مرحباً، تصفحت الموقع وأبحث عن منتج غير معروض..`, '_blank'); }
function openZoom() { if(state.currentImages.length === 0) return; state.zoomIndex = 0; updateZoomView(); document.getElementById('zoom-modal').classList.add('active'); }
function zoomNavigate(dir) { state.zoomIndex += dir; if (state.zoomIndex < 0) state.zoomIndex = state.currentImages.length - 1; if (state.zoomIndex >= state.currentImages.length) state.zoomIndex = 0; updateZoomView(); }
function updateZoomView() { document.getElementById('zoom-img').src = fixUrl(state.currentImages[state.zoomIndex]); document.getElementById('zoom-counter').innerText = `${state.zoomIndex + 1} / ${state.currentImages.length}`; }
function closeZoom() { document.getElementById('zoom-modal').classList.remove('active'); }
function showToast(msg) { const t = document.createElement('div'); t.className = 'toast-msg'; t.innerText = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2500); }