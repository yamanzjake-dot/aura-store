// 🔥 الرابط الخاص فيك لجوجل سكربت
const API_URL = "https://script.google.com/macros/s/AKfycbw-KXbFMuPGj1FT0BkmKZk9IyOyPFbpM-UYTGHZl1ox-o6tfz0RdHcjbj54-S8jWPT2lA/exec";

let state = { products: [], banners: [], cart: [], currentProduct: null, studioImages: [], realImages: [], currentImages: [], viewMode: 'studio', zoomIndex: 0, variantTracker: {}, mainQty: 1 };
let slideInterval; let heroInterval; let fuse; 

const sitePolicies = {
    privacy: { title: "🔒 سياسة الخصوصية", content: `<div style="text-align: right; line-height: 1.8; font-size: 0.95rem; color: #444;"><p><strong>1. مقدمة:</strong><br>نحن في <strong>Aura & Luxe</strong> نولي اهتماماً كبيراً لخصوصية زوارنا وعملائنا. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك الشخصية.</p><p><strong>2. المعلومات التي نجمعها:</strong><br>عند إتمام الطلب، نقوم بجمع المعلومات التالية فقط لغايات التوصيل:<br>- الاسم الكامل.<br>- رقم الهاتف.<br>- العنوان التفصيلي (المدينة، المنطقة، المعلم القريب).</p><p><strong>3. استخدام المعلومات:</strong><br>نستخدم بياناتك حصراً لـ:<br>- معالجة طلبك وتوصيله إليك.<br>- التواصل معك في حال وجود تحديثات حول الطلب.<br>- تحسين تجربة المستخدم في موقعنا.</p><p><strong>4. مشاركة البيانات:</strong><br>نحن لا نقوم ببيع أو تأجير أو مشاركة بياناتك مع أي طرف ثالث لأغراض تسويقية. تتم مشاركة العنوان ورقم الهاتف فقط مع <strong>شركة الشحن</strong> المعتمدة لدينا لضمان وصول الطلب.</p><p><strong>5. ملفات تعريف الارتباط (Cookies):</strong><br>يستخدم موقعنا ملفات تعريف الارتباط (مثل Facebook Pixel) لتحسين تجربتك الإعلانية وتحليل أداء الموقع، دون الوصول إلى بياناتك الشخصية الحساسة.</p></div>` },
    shipping: { title: "📦 سياسة الشحن والتوصيل", content: `<div style="text-align: right; line-height: 1.8; font-size: 0.95rem; color: #444;"><p><strong>1. مناطق التوصيل:</strong><br>نقوم بالتوصيل إلى جميع محافظات المملكة الأردنية الهاشمية (شمال، وسط، جنوب).</p><p><strong>2. مدة التوصيل:</strong><br>- <strong>عمان والزرقاء:</strong> خلال 24 - 48 ساعة من تأكيد الطلب.<br>- <strong>باقي المحافظات:</strong> خلال 48 - 72 ساعة.</p><p><strong>3. رسوم التوصيل:</strong><br>رسوم التوصيل ثابتة (3 دنانير) تضاف تلقائياً إلى فاتورتك النهائية عند إتمام الطلب.</p><p><strong>4. عملية التسليم:</strong><br>سيقوم مندوب التوصيل بالاتصال بك قبل الوصول. في حال عدم الرد لأكثر من مرة، قد يتم إلغاء الطلب أو تأجيله لليوم التالي.</p></div>` },
    refund: { title: "🔄 سياسة الاستبدال والاسترجاع", content: `<div style="text-align: right; line-height: 1.8; font-size: 0.95rem; color: #444;"><p><strong>1. حق المعاينة :</strong><br>يحق للعميل فتح الطرد ومعاينة المنتج بالكامل أمام المندوب <strong>قبل الدفع</strong>. إذا لم يعجبك المنتج أو كان غير مطابق، يمكنك رفض استلامه ودفع رسوم التوصيل فقط للمندوب.</p><p><strong>2. وجود عيب مصنعي:</strong><br>في حال اكتشاف عيب مصنعي بعد الاستلام، يحق لك طلب استبدال المنتج مجاناً خلال <strong>3 أيام</strong> من تاريخ الاستلام، بشرط أن يكون المنتج بحالته الأصلية ومع كامل ملحقاته.</p><p><strong>3. الاستبدال برغبة العميل:</strong><br>إذا رغبت في استبدال المنتج لسبب غير متعلق بعيب مصنعي (تغيير رأي)، يتم ذلك خلال 3 أيام مع تحمل العميل رسوم التوصيل الإضافية.</p><p><strong>4. في حال وجود ممنوع المعاينة :</strong><br>في حال وجود ملاحظة (ممنوع المعاينة)، يقتصر حق العميل على التأكد من دقة اللون والنمط الظاهري فقط وبحضور المندوب، دون فتح التغليف الداخلي أو تجربة المنتج. وبمجرد استلام المنتج وانصراف المندوب، يعتبر ذلك إقراراً من العميل بمطابقة اللون والمواصفات الشكلية، ولا يقبل المتجر أي اعتراض بخصوصها لاحقاً. علماً أن التبديل لأي أسباب أخرى يخضع لسياسة المتجر خلال 3 أيام عمل..</p></div>` },
    contact: { title: "📞 معلومات التواصل والدعم", content: `<div style="text-align: right; line-height: 1.8; font-size: 0.95rem; color: #444;"><p>فريق خدمة العملاء جاهز لمساعدتكم على مدار الساعة.</p><hr style="border:0; border-top:1px solid #eee; margin:10px 0;"><p><strong>📱 رقم الهاتف / واتساب:</strong><br><a href="tel:962781591754" style="color:var(--primary); font-weight:bold; font-size:1.1rem;">0781591754</a></p><p><strong>📧 البريد الإلكتروني:</strong><br><a href="mailto:babyandtoddlerss@gmail.com" style="color:var(--primary); font-weight:bold;">babyandtoddlerss@gmail.com</a></p><p><strong>📍 العنوان:</strong><br>الأردن - متجر إلكتروني (Online Store)</p></div>` },
    terms: { title: "⚖️ شروط الاستخدام وإخلاء المسؤولية", content: `<div style="text-align: right; line-height: 1.8; font-size: 0.95rem; color: #444;"><p><strong>1. الأسعار والدفع:</strong><br>جميع الأسعار المعروضة بالدينار الأردني (JOD) وهي نهائية. الدفع يتم نقداً عند الاستلام (Cash on Delivery).</p><p><strong>2. المصداقية في الطلب:</strong><br>تأكيدك للطلب عبر الموقع يعتبر التزاماً بالشراء. الطلبات الوهمية تسبب ضرراً للمتجر وقد تعرض صاحبها للمساءلة.</p><p><strong>3. إخلاء مسؤولية فيسبوك (Facebook Disclaimer):</strong><br><span style="font-size:0.8rem; color:#666;">This site is not a part of the Facebook website or Facebook Inc. Additionally, This site is NOT endorsed by Facebook in any way. FACEBOOK is a trademark of FACEBOOK, Inc.</span></p><p>نحن نستخدم منصة فيسبوك للإعلان فقط، ولا نمثل شركة فيسبوك بشكل رسمي.</p></div>` }
};

window.onload = async () => {
    try {
        const res = await fetch(`data.json?v=${new Date().getTime()}`);
        const rawData = await res.json();
        
        state.banners = rawData.filter(item => item.category && item.category.trim().toLowerCase() === 'banner');
        state.products = rawData.filter(item => !item.category || item.category.trim().toLowerCase() !== 'banner');
        
        setTimeout(() => initSearchEngine(), 100);
        initApp();
        
        document.getElementById('loader').style.display = 'none';
        setupScrollObserver();

        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        const trackId = urlParams.get('track');

        if (urlParams.has('track')) {
            setTimeout(() => {
                openTrackingModal(trackId);
                if(trackId && trackId.trim() !== '') trackOrder();
            }, 800);
        } else if (productId) {
            const p = state.products.find(x => x.id == productId);
            if (p) openProduct(productId);
        }

    } catch(e) { 
        console.error("Error loading data:", e);
        document.getElementById('loader').innerHTML = '<div style="color:white;text-align:center;">جاري تجهيز المنتجات، قم بتحديث الموقع من السبريد شيت 🚀</div>';
    }
};

function setupScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.card, .section-title, .hidden-stock-section').forEach(el => {
        el.classList.add('reveal'); observer.observe(el);
    });
}

function initSearchEngine() { fuse = new Fuse(state.products, { includeScore: true, threshold: 0.4, keys: ["name", "description", "models.name"] }); }

function handleSearch(query) {
    const suggestionsBox = document.getElementById('search-suggestions');
    if (!query.trim()) {
        renderGrid('all');
        document.getElementById('main-products-title').innerText = "✨ جميع المنتجات";
        document.getElementById('exclusive-section').style.display = 'block';
        document.getElementById('best-seller-section').style.display = 'block';
        suggestionsBox.style.display = 'none'; setupScrollObserver(); return;
    }
    const results = fuse.search(query);
    const filteredProducts = results.map(r => r.item);
    document.getElementById('exclusive-section').style.display = 'none';
    document.getElementById('best-seller-section').style.display = 'none';
    document.getElementById('main-products-title').innerText = `🔍 نتائج البحث عن: ${query}`;
    if (filteredProducts.length > 0) {
        document.getElementById('products-grid').innerHTML = filteredProducts.map(p => productCard(p)).join('');
        suggestionsBox.innerHTML = results.slice(0, 5).map(r => {
            let matchText = "";
            if (r.matches && r.matches.length > 0 && r.matches[0].key === "models.name") matchText = `<span class="s-match">(موديل: ${r.matches[0].value})</span>`;
            return `<div class="suggestion-item" onclick="selectSuggestion(${r.item.id})"><img src="${fixUrl(r.item.main_image)}" class="s-img"><div class="s-info"><span class="s-name">${r.item.name}</span>${matchText}</div></div>`;
        }).join('');
        suggestionsBox.style.display = 'block';
    } else {
        document.getElementById('products-grid').innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:20px; color:#666;">لا توجد نتائج مطابقة 😕</div>`;
        suggestionsBox.style.display = 'none';
    }
    setupScrollObserver();
}

function selectSuggestion(id) { document.getElementById('search-suggestions').style.display = 'none'; openProduct(id); }
document.addEventListener('click', function(e) { if (!document.querySelector('.search-container').contains(e.target)) document.getElementById('search-suggestions').style.display = 'none'; });

function initApp() { renderCategories(); renderSpecialSections(); renderGrid('all'); initHeroSlider(); }

function initHeroSlider() { 
    const sliderContainer = document.getElementById('hero-slider');
    if (state.banners.length > 0) {
        sliderContainer.innerHTML = state.banners.map((b, index) => {
            const linkAttr = (b.description && b.description.startsWith('http')) ? `onclick="window.open('${b.description}', '_blank')"` : '';
            const cursorStyle = (b.description && b.description.startsWith('http')) ? 'pointer' : 'default';
            return `<div class="hero-slide ${index === 0 ? 'active' : ''}" style="background-image: url('${fixUrl(b.main_image)}'); cursor: ${cursorStyle}" ${linkAttr}></div>`;
        }).join('');
        if(state.banners.length > 1) startHeroAutoSlide();
    } 
}

function startHeroAutoSlide() {
    const slides = document.querySelectorAll('.hero-slide'); let i = 0; 
    clearInterval(heroInterval); 
    heroInterval = setInterval(() => { slides[i].classList.remove('active'); i = (i + 1) % slides.length; slides[i].classList.add('active'); }, 4000); 
}

function renderCategories() { const cats = ['الكل', ...new Set(state.products.map(p => p.category).filter(c => c))]; document.getElementById('categories-nav').innerHTML = cats.map(c => `<button class="cat-btn ${c==='الكل'?'active':''}" onclick="filterByCat(this, '${c}')">${c}</button>`).join(''); }
function filterByCat(btn, cat) { 
    if(btn) { document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); } 
    if (cat === 'all' || cat === 'الكل') { renderGrid('all'); document.getElementById('main-products-title').innerText = "✨ جميع المنتجات"; } 
    else { if(cat === 'offers') { scrollToSection('exclusive-section'); } else { renderGrid(cat); document.getElementById('main-products-title').innerText = `✨ قسم ${cat}`; document.getElementById('products-grid').scrollIntoView({ behavior: 'smooth', block: 'start' }); } } 
    setupScrollObserver(); 
}
function renderSpecialSections() { 
    const offers = state.products.filter(p => String(p.is_offer).toLowerCase() === 'true'); 
    const best = state.products.filter(p => String(p.best_seller).toLowerCase() === 'true'); 
    if(offers.length) { document.getElementById('exclusive-section').style.display = 'block'; document.getElementById('exclusive-grid').innerHTML = offers.map(p => miniCard(p, true)).join(''); } 
    if(best.length) { document.getElementById('best-seller-section').style.display = 'block'; document.getElementById('best-seller-grid').innerHTML = best.map(p => miniCard(p, false)).join(''); } 
}
function renderGrid(cat) { const filtered = (cat === 'all' || cat === 'الكل') ? state.products : state.products.filter(p => p.category === cat); document.getElementById('products-grid').innerHTML = filtered.map(p => productCard(p)).join(''); }

function productCard(p) { let badgeHtml = ""; if (p.real_images && p.real_images.trim().length > 5) badgeHtml = `<div class="real-badge">📷 صور واقعية</div>`; return `<div class="card reveal" onclick="openProduct(${p.id})">${badgeHtml}<img src="${fixUrl(p.main_image)}" class="card-img" loading="lazy"><div class="card-body"><div class="card-title">${p.name}</div><div class="price-container">${getPriceHtml(p)}</div></div></div>`; }
function miniCard(p, isShimmer) { let badgeHtml = ""; if (p.real_images && p.real_images.trim().length > 5) badgeHtml = `<div class="real-badge">📷</div>`; return `<div class="card reveal ${isShimmer ? 'shimmer-effect' : ''}" style="min-width:145px;" onclick="openProduct(${p.id})">${badgeHtml}<img src="${fixUrl(p.main_image)}" style="width:100%; height:110px; object-fit:contain; padding:5px;"><div style="padding:8px; text-align:center;"><div style="font-size:0.8rem; font-weight:bold; margin-bottom:5px; height:35px; overflow:hidden;">${p.name}</div><div class="price-container">${getPriceHtml(p)}</div></div></div>`; }
function getPriceHtml(p) { if(p.old_price && Number(p.old_price) > Number(p.base_price)) return `<div class="old-price">${p.old_price} JOD</div><div class="price-red">${p.base_price} JOD</div>`; return `<div class="price-normal">${p.base_price} JOD</div>`; }

function openProduct(id) {
    const p = state.products.find(x => x.id == id);
    if (!p) return;
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?id=' + id;
    window.history.pushState({ path: newUrl }, '', newUrl);

    state.currentProduct = p; state.variantTracker = {}; state.mainQty = 1; state.viewMode = 'studio'; 

    if (typeof fbq !== 'undefined') fbq('track', 'ViewContent', { content_name: p.name, content_ids: [p.id], content_type: 'product', value: p.base_price, currency: 'JOD' });

    let sImgs = [];
    if (p.main_image && String(p.main_image).trim()) sImgs.push(String(p.main_image).trim());
    if (p.gallery) sImgs = [...sImgs, ...String(p.gallery).replace(/(\r\n|\n|\r)/gm, ",").split(',').map(s => s.trim()).filter(s => s !== "")];
    if (p.models && p.models.length > 0) p.models.forEach(m => { if (m.image && m.image.trim()) sImgs.push(m.image.trim()); state.variantTracker[m.name] = 0; });
    state.studioImages = [...new Set(sImgs)].filter(img => img.length > 5);

    state.realImages = [];
    if (p.real_images && String(p.real_images).trim()) state.realImages = String(p.real_images).replace(/(\r\n|\n|\r)/gm, ",").split(',').map(s => s.trim()).filter(s => s.length > 5);
    state.currentImages = state.studioImages;
    let toggleHtml = state.realImages.length > 0 ? `<div class="reality-switch-container"><div class="reality-toggle-wrapper"><button class="rt-btn active" onclick="switchViewMode('studio', this)">💎 صور العرض</button><button class="rt-btn" onclick="switchViewMode('real', this)">📸 صور واقعية</button></div></div>` : '';
    
    renderProductModal(p, toggleHtml); checkIfInCart(); document.getElementById('product-modal').classList.add('active');
    if (state.currentImages.length > 1) startProductAutoSlide();
}

function renderProductModal(p, toggleHtml) {
    const thumbnailsHtml = state.currentImages.map((img, i) => `<div class="thumb-box ${i === 0 ? 'active' : ''}" onclick="manualSwitch('${img}', this)"><img src="${fixUrl(img)}"></div>`).join('');
    let controlsHtml = '';
    if (p.models && p.models.length > 0) {
        controlsHtml = `<div class="variants-list">${p.models.map(m => `<div class="variant-row"><div class="variant-info" onclick="openZoomToSpecificImage('${m.image}')"><img src="${fixUrl(m.image)}" class="variant-img"><span class="variant-name">${m.name}</span></div><div class="variant-controls"><button class="v-btn" onclick="updateVariantQty('${m.name}', -1)">-</button><span class="v-qty" id="qty-${m.name.replace(/\s/g, '')}">${state.variantTracker[m.name] || 0}</span><button class="v-btn" onclick="updateVariantQty('${m.name}', 1, '${m.image}')">+</button></div></div>`).join('')}</div>`;
    } else {
        controlsHtml = `<div class="main-qty-wrapper"><div class="main-qty-ctrl"><button class="mq-btn" onclick="updateMainQty(-1)">-</button><span id="main-qty-display" class="mq-display">${state.mainQty}</span><button class="mq-btn" onclick="updateMainQty(1)">+</button></div></div>`;
    }
    let priceModalHtml = (p.old_price && Number(p.old_price) > Number(p.base_price)) ? `<div style="display:flex; align-items:center; justify-content:center; gap:10px; margin:10px 0;"><span style="text-decoration:line-through; color:#999; font-size:1.1rem;">${p.old_price} JOD</span><span style="font-size:1.5rem; font-weight:900; color:#D32F2F;">${p.base_price} JOD</span></div>` : `<div class="price-normal" style="font-size:1.4rem; margin:10px 0;">${p.base_price} JOD</div>`;
    
    document.getElementById('modal-sheet-content').innerHTML = `
        <div class="modal-header-sticky"><h3>تفاصيل المنتج</h3><button class="close-sheet-btn" onclick="closeModal()">✕</button></div>
        <div class="modal-scroll-content">
            <div class="gallery-wrapper">${toggleHtml}<div class="main-img-container"><button class="preview-btn" onclick="openZoom()">🔍</button><img id="main-preview" src="${fixUrl(state.currentImages[0])}" class="main-img-view" onclick="openZoom()"></div><div class="thumbnails-strip">${thumbnailsHtml}</div></div>
            <h2 style="font-family:'Marhey'; color:var(--primary);">${p.name}</h2>
            ${priceModalHtml}
            <div style="background:#f9f9f9; padding:15px; border-radius:10px; margin-bottom:15px; text-align:right;">
                <p style="color:#555; line-height:1.7; font-size:1.1rem;">${p.description || 'لا يوجد وصف متاح.'}</p>
            </div>
            <h3 style="font-size:1rem; margin-bottom:10px;">اختر الكمية والموديل:</h3>${controlsHtml}
        </div>
        <div class="modal-footer-sticky" id="action-buttons"><button class="order-submit" onclick="addToCart()">إضافة للسلة 🛒</button></div>
    `;
}

function switchViewMode(mode, btn) {
    if (mode === state.viewMode) return; state.viewMode = mode; state.currentImages = (mode === 'real') ? state.realImages : state.studioImages;
    document.querySelectorAll('.rt-btn').forEach(b => b.classList.remove('active', 'real'));
    btn.classList.add('active'); if (mode === 'real') btn.classList.add('real');
    document.querySelector('.thumbnails-strip').innerHTML = state.currentImages.map((img, i) => `<div class="thumb-box ${i === 0 ? 'active' : ''}" onclick="manualSwitch('${img}', this)"><img src="${fixUrl(img)}"></div>`).join('');
    manualSwitch(state.currentImages[0], null); startProductAutoSlide();
}

function startProductAutoSlide() {
    clearInterval(slideInterval); let idx = 0;
    slideInterval = setInterval(() => {
        idx = (idx + 1) % state.currentImages.length; const imgEl = document.getElementById('main-preview');
        if(imgEl) { imgEl.style.opacity = '0'; setTimeout(() => { imgEl.src = fixUrl(state.currentImages[idx]); imgEl.style.opacity = '1'; highlightThumbnail(idx, true); }, 200); }
    }, 3000);
}

function manualSwitch(src, thumbEl, skipScroll) {
    clearInterval(slideInterval); document.getElementById('main-preview').src = fixUrl(src);
    if(thumbEl) { document.querySelectorAll('.thumb-box').forEach(t => t.classList.remove('active')); thumbEl.classList.add('active'); } 
    else { const index = state.currentImages.findIndex(img => fixUrl(img) === fixUrl(src)); if (index !== -1) highlightThumbnail(index, skipScroll); }
}

function highlightThumbnail(index, skipScroll) { 
    const thumbs = document.querySelectorAll('.thumb-box'); thumbs.forEach(t => t.classList.remove('active')); 
    if(thumbs[index]) { thumbs[index].classList.add('active'); if (!skipScroll) thumbs[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); } 
}

function openZoomToSpecificImage(url) { if(!url) return; const fixedUrl = fixUrl(url); const index = state.currentImages.findIndex(img => fixUrl(img) === fixedUrl); state.zoomIndex = (index !== -1) ? index : 0; updateZoomView(); document.getElementById('zoom-modal').classList.add('active'); }
function updateVariantQty(name, change, imgUrl) { if(change > 0 && imgUrl) manualSwitch(imgUrl, null, true); if (!state.variantTracker[name]) state.variantTracker[name] = 0; state.variantTracker[name] += change; if (state.variantTracker[name] < 0) state.variantTracker[name] = 0; if(document.getElementById(`qty-${name.replace(/\s/g, '')}`)) document.getElementById(`qty-${name.replace(/\s/g, '')}`).innerText = state.variantTracker[name]; }
function updateMainQty(change) { state.mainQty += change; if (state.mainQty < 1) state.mainQty = 1; document.getElementById('main-qty-display').innerText = state.mainQty; }

function addToCart() {
    const p = state.currentProduct; let itemsAddedCount = 0;
    if (p.models && p.models.length > 0) {
        let hasSelection = false;
        for (const [modName, qty] of Object.entries(state.variantTracker)) {
            if (qty > 0) {
                hasSelection = true; const cartItemId = `${p.id}-${modName}`; const existingItem = state.cart.find(x => x.cartId === cartItemId);
                if (existingItem) existingItem.qty += qty; else state.cart.push({ ...p, cartId: cartItemId, name: `${p.name} (${modName})`, qty: qty, price: p.base_price });
                itemsAddedCount += qty;
            }
        }
        if (!hasSelection) return showToast("⚠️ يرجى اختيار كمية لموديل واحد على الأقل");
    } else {
        const cartItemId = `${p.id}-default`; const existingItem = state.cart.find(x => x.cartId === cartItemId);
        if (existingItem) existingItem.qty += state.mainQty; else state.cart.push({ ...p, cartId: cartItemId, qty: state.mainQty });
        itemsAddedCount = state.mainQty;
    }
    updateBadge(); showToast(`✅ تمت إضافة ${itemsAddedCount} قطعة للسلة!`); 
    const cartBtn = document.querySelector('.cart-btn'); cartBtn.classList.add('shake'); setTimeout(() => cartBtn.classList.remove('shake'), 500); 
    checkIfInCart();
    
    if (itemsAddedCount > 0 && typeof fbq !== 'undefined') {
        fbq('track', 'AddToCart', { content_name: p.name, content_ids: [p.id], content_type: 'product', value: p.base_price * itemsAddedCount, currency: 'JOD' });
    }
}

function checkIfInCart() { const container = document.getElementById('action-buttons'); let html = `<button class="order-submit" onclick="addToCart()">إضافة للسلة 🛒</button>`; if (state.cart.length > 0) html += `<button class="go-cart-btn" onclick="openCheckout()">الذهاب للسلة الآن ⬅️</button>`; container.innerHTML = html; }
function openPolicy(type) { const policy = sitePolicies[type]; if (policy) { document.getElementById('p-title').innerText = policy.title; document.getElementById('p-text').innerHTML = policy.content; document.getElementById('policy-modal').classList.add('active'); document.getElementById('sidebar').classList.remove('active'); document.getElementById('sidebar-overlay').classList.remove('active'); } }
function updateCartQty(index, change) { state.cart[index].qty += change; if (state.cart[index].qty <= 0) state.cart.splice(index, 1); updateBadge(); openCheckout(); }
function updateBadge() { const b = document.getElementById('cart-badge'); const totalQty = state.cart.reduce((s, i) => s + i.qty, 0); b.innerText = totalQty; b.style.display = totalQty > 0 ? 'flex' : 'none'; }

function openCheckout() { 
    if(!state.cart.length) { document.getElementById('cart-content-wrapper').innerHTML = `<div class="empty-cart-view"><span class="empty-icon">🛒</span><div class="empty-text">سلتك فارغة</div><button class="shop-now-btn" onclick="closeCheckout()">تسوّق الآن</button></div>`; document.getElementById('checkout-modal').classList.add('active'); return; } 
    let subtotal = state.cart.reduce((s, i) => s + (Number(i.base_price) * i.qty), 0); let shipping = 3; let total = subtotal + shipping;
    document.getElementById('cart-content-wrapper').innerHTML = `
        <div class="delivery-note">🚚 التوصيل خلال 24-48 ساعة</div>
        <div id="cart-items" class="cart-list">${state.cart.map((i, idx) => `<div class="cart-item"><div class="cart-info"><span style="font-weight:bold;color:#555;">${i.name}</span><div class="cart-qty-ctrl"><button class="cart-mini-btn" onclick="updateCartQty(${idx}, -1)">-</button><span class="cart-mini-qty">${i.qty}</span><button class="cart-mini-btn" onclick="updateCartQty(${idx}, 1)">+</button></div></div><span style="font-weight:bold;color:#2B2D42;">${(i.base_price * i.qty).toFixed(2)}</span></div>`).join('')}</div>
        <div id="total-box" class="total-display" style="background:#f9f9f9; padding:15px; border-radius:10px; margin-top:15px;"><div style="display:flex; justify-content:space-between; margin-bottom:5px; color:#666;"><span>مجموع المنتجات:</span><span>${subtotal.toFixed(2)} JOD</span></div><div style="display:flex; justify-content:space-between; margin-bottom:10px; color:#666; border-bottom:1px dashed #ddd; padding-bottom:10px;"><span>+ رسوم التوصيل:</span><span>${shipping.toFixed(2)} JOD</span></div><div style="display:flex; justify-content:space-between; align-items:center; font-size:1.2rem; font-weight:bold; color:var(--primary);"><span>المجموع الكلي:</span><span>${total.toFixed(2)} JOD</span></div></div>
        <form onsubmit="submitOrder(event)">
            <input type="text" id="cust-name" placeholder="الاسم" required class="form-input">
            <input type="tel" id="cust-phone" placeholder="الهاتف" required class="form-input">
            <select id="cust-city" required class="form-input"><option value="" disabled selected>المحافظة...</option><option>عمان</option><option>إربد</option><option>الزرقاء</option><option>السلط</option><option>العقبة</option><option>مادبا</option><option>جرش</option><option>عجلون</option><option>الكرك</option><option>الطفيلة</option><option>معان</option><option>المفرق</option></select>
            <textarea id="cust-address" placeholder="العنوان بالتفصيل..." required class="form-input address-input"></textarea>
            <textarea id="order-note" placeholder="ملاحظات إضافية (اختياري)..." class="form-input" style="height:70px; resize:none;"></textarea>
            <button type="submit" id="submit-btn" class="order-submit">تأكيد الطلب (${total.toFixed(2)} JOD) 🚀</button>
            <button type="button" class="continue-btn" onclick="closeCheckout()">متابعة التسوق لإضافة المزيد ➕</button>
        </form>
    `; 
    document.getElementById('checkout-modal').classList.add('active'); 
}

function submitOrder(e) { 
    e.preventDefault(); const btn = document.getElementById('submit-btn'); const originalText = btn.innerText;
    btn.innerText = "جاري حفظ الطلب... ⏳"; btn.disabled = true; btn.style.background = "#ccc";
    const subtotal = state.cart.reduce((s, i) => s + (Number(i.base_price) * i.qty), 0); const grandTotal = subtotal + 3;
    const orderId = "AURA-" + Math.floor(100000 + Math.random() * 900000);
    const data = { orderId: orderId, name: document.getElementById('cust-name').value, phone: document.getElementById('cust-phone').value, city: document.getElementById('cust-city').value, address: document.getElementById('cust-address').value, note: document.getElementById('order-note').value, cart: state.cart, total: grandTotal.toFixed(2) + " JOD" }; 

    if (typeof fbq !== 'undefined') fbq('track', 'Purchase', { value: grandTotal, currency: 'JOD', num_items: state.cart.length, content_type: 'product' });

    fetch(API_URL + "?action=order", { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
    .then(() => { showSuccessModal(data); state.cart = []; updateBadge(); })
    .catch((error) => { console.error('Error:', error); alert("حدث خطأ بسيط، حاول مرة أخرى."); btn.innerText = originalText; btn.disabled = false; btn.style.background = "var(--accent)"; });
}

function showSuccessModal(data) {
    document.getElementById('cart-content-wrapper').innerHTML = `
        <div style="text-align:center; padding:20px 10px; animation: fadeInUp 0.5s;">
            <div style="font-size:4rem; margin-bottom:10px;">🎉</div>
            <h2 style="color:var(--primary); font-family:'Marhey'; margin-bottom:15px;">تم استلام طلبك بنجاح!</h2>
            <p style="color:#555; line-height:1.6; margin-bottom:15px; font-size:1.1rem;">شكراً لك يا <strong>${data.name}</strong>.<br></p>
            <div style="background:#fff3cd; padding:15px; border-radius:10px; margin-bottom:20px; border: 1px dashed #ffeeba;">
                <span style="display:block; font-size:0.9rem; color:#856404; margin-bottom:5px;">رقم طلبك هو:</span>
                <span id="order-id-display" onclick="copyOrderId('${data.orderId}')" style="font-size:1.6rem; font-weight:900; color:#D32F2F; letter-spacing:1px; cursor:pointer; display:inline-block; padding:5px 15px; background:#fff; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.05);">${data.orderId} 📋</span>
                <div style="font-size:0.8rem; color:#666; margin-top:5px;">(اضغط على الرقم لنسخه)</div>
            </div>
            <button class="order-submit" onclick="openTrackingModal('${data.orderId}')" style="margin-bottom:10px;">📦 تتبع طلبي الآن</button>
            <button class="continue-btn" onclick="closeCheckout()">العودة للتسوق</button>
        </div>
    `;
}

function copyOrderId(id) { navigator.clipboard.writeText(id).then(() => showToast("✅ تم نسخ رقم الطلب بنجاح!")); }

// ==========================================
// 🔥 أكواد التتبع الذكية مع الرابط المباشر والأنيميشن الكرتوني والمنتجات 🔥
// ==========================================
function openTrackingModal(prefillId = '') {
    closeCheckout(); 
    if(document.getElementById('sidebar').classList.contains('active')) toggleSidebar();
    
    document.getElementById('track-modal').classList.add('active');
    if (prefillId) document.getElementById('track-input').value = prefillId;
    document.getElementById('track-result').innerHTML = '';

    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?track=' + (prefillId || '');
    window.history.pushState({ path: newUrl }, '', newUrl);
}

function closeTrackingModal() {
    document.getElementById('track-modal').classList.remove('active');
    const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.pushState({ path: cleanUrl }, '', cleanUrl);
}

async function trackOrder() {
    const query = document.getElementById('track-input').value.trim();
    const btn = document.getElementById('track-btn');
    const resultDiv = document.getElementById('track-result');

    if (!query) { showToast("⚠️ يرجى إدخال رقم الطلب أو رقم الهاتف"); return; }

    btn.innerText = "جاري البحث... ⏳"; btn.disabled = true; resultDiv.innerHTML = '';

    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?track=' + query;
    window.history.pushState({ path: newUrl }, '', newUrl);

    try {
        const res = await fetch(`${API_URL}?action=track&query=${encodeURIComponent(query)}`);
        const data = await res.json();

        if (data.success) {
            const order = data.order;
            
            // إعداد الأيقونات والرسومات المبرمجة
            let iconHtml = "📦"; let iconClass = "icon-prep"; let sColor = "#f39c12"; let sDesc = "طلبك قيد التجهيز في مستودعاتنا، وسيتم تسليمه لشركة الشحن قريباً.";
            
            if (order.status.includes("مندوب") || order.status.includes("توصيل") || order.status.includes("طريق")) {
                iconHtml = "🚚"; iconClass = "icon-delivery"; sColor = "var(--primary)"; sDesc = "طلبك الآن مع المندوب وفي طريقه إليك! يرجى إبقاء هاتفك متاحاً.";
            } else if (order.status.includes("تم") || order.status.includes("تسليم") || order.status.includes("نجاح")) {
                iconHtml = "🎉"; iconClass = "icon-success"; sColor = "#2ecc71"; sDesc = "تم تسليم الطلب بنجاح. نتمنى أن ينال إعجابكم!";
            }

            let cleanItems = String(order.items || "").replace(/\n/g, '<br>• ');

            resultDiv.innerHTML = `
                <style>
                    @keyframes bounceBox { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-15px) rotate(5deg); } }
                    .icon-prep { animation: bounceBox 1.5s infinite ease-in-out; display:inline-block; font-size:4.5rem; margin-bottom:10px; }
                    @keyframes driveTruck { 0% { transform: translateX(20px); opacity: 0; } 20% { opacity: 1; transform: translateX(10px); } 80% { opacity: 1; transform: translateX(-10px); } 100% { transform: translateX(-20px); opacity: 0; } }
                    .icon-delivery { animation: driveTruck 2.5s infinite linear; display:inline-block; font-size:4.5rem; margin-bottom:10px; }
                    @keyframes popSuccess { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.2); } 100% { transform: scale(1); opacity: 1; } }
                    .icon-success { animation: popSuccess 0.6s ease-out forwards; display:inline-block; font-size:4.5rem; margin-bottom:10px; }
                </style>

                <div style="background:#f9f9f9; border:2px solid ${sColor}; border-radius:12px; padding:20px; text-align:center; margin-top:20px; animation: fadeInUp 0.4s;">
                    <div class="${iconClass}">${iconHtml}</div>
                    <h3 style="color:${sColor}; margin-bottom:10px; font-family:'Marhey';">${order.status}</h3>
                    <p style="color:#555; font-size:0.95rem; line-height:1.6; margin-bottom:15px;">${sDesc}</p>
                    
                    <div style="background:#fff; border-radius:8px; padding:15px; border:1px solid #eee; text-align:right; margin-bottom:15px;">
                        <div style="color:#888; font-size:0.85rem; margin-bottom:5px;">المنتجات المطلوبة:</div>
                        <div style="color:#333; font-size:0.9rem; font-weight:bold; line-height:1.5;">• ${cleanItems}</div>
                        <div style="margin-top:10px; padding-top:10px; border-top:1px dashed #ddd; display:flex; justify-content:space-between; font-weight:bold; color:var(--primary);">
                            <span>المجموع الكلي:</span>
                            <span>${order.total || '-'}</span>
                        </div>
                    </div>

                    <div style="font-size:0.85rem; color:#777;">
                        رقم الطلب: <strong>${order.orderId}</strong> | الاسم: <strong>${order.name}</strong>
                    </div>
                    
                    <div style="margin-top:15px;">
                        <a href="https://wa.me/962781591754?text=مرحباً، أستفسر بخصوص الطلب رقم: ${order.orderId}" target="_blank" style="color:#bbb; text-decoration:underline; font-size:0.85rem;">هل تواجه مشكلة بالطلب؟ تواصل معنا</a>
                    </div>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <div style="background:#ffeeee; border:2px solid #ffcccc; border-radius:12px; padding:20px; text-align:center; margin-top:20px; animation: fadeInUp 0.4s;">
                    <div style="font-size:3rem; margin-bottom:10px;">❌</div>
                    <h3 style="color:#D32F2F; margin-bottom:10px; font-family:'Marhey';">لم يتم العثور على الطلب</h3>
                    <p style="color:#555; font-size:0.95rem; line-height:1.6;">تأكد من إدخال رقم الطلب أو الهاتف بشكل صحيح.</p>
                </div>
            `;
        }
    } catch (err) { console.error(err); resultDiv.innerHTML = `<div style="color:red; text-align:center; padding:10px; margin-top:10px;">حدث خطأ في الاتصال، يرجى المحاولة لاحقاً.</div>`; }

    btn.innerText = "ابحث عن طلبي 🚀"; btn.disabled = false;
}

// ==========================================

function closeModal() { document.getElementById('product-modal').classList.remove('active'); clearInterval(slideInterval); const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname; window.history.pushState({ path: cleanUrl }, '', cleanUrl); }
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
