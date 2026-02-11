
document.addEventListener('DOMContentLoaded', () => {
    initializeCart();
    injectCartModal();
    injectFloatingButtons();
    updateCartCount();
});

function initializeCart() {
    if (!localStorage.getItem('speakingPartnerCart')) {
        localStorage.setItem('speakingPartnerCart', JSON.stringify([]));
    }
}

function addToCart(name, price, period) {
    const cart = JSON.parse(localStorage.getItem('speakingPartnerCart'));
    cart.push({ name, price, period, id: Date.now() });
    localStorage.setItem('speakingPartnerCart', JSON.stringify(cart));
    updateCartCount();
    showToast('Program berhasil ditambahkan ke keranjang!');

    // Animate cart button
    const cartBtn = document.querySelector('.fab-cart');
    if (cartBtn) {
        cartBtn.classList.add('animate-bounce');
        setTimeout(() => cartBtn.classList.remove('animate-bounce'), 1000);
    }
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('speakingPartnerCart'));
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('speakingPartnerCart', JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('speakingPartnerCart'));
    const count = cart.length;
    const badges = document.querySelectorAll('.cart-count-badge');
    badges.forEach(badge => {
        badge.textContent = count;
        if (count > 0) {
            badge.classList.remove('hidden', 'scale-0');
            badge.classList.add('scale-100');
        } else {
            badge.classList.add('hidden', 'scale-0');
            badge.classList.remove('scale-100');
        }
    });
}

function openCartModal() {
    const modal = document.getElementById('cartModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    renderCartItems();
}

function closeCartModal() {
    const modal = document.getElementById('cartModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem('speakingPartnerCart'));
    const container = document.getElementById('cartItemsContainer');
    const totalElement = document.getElementById('cartTotal');

    if (cart.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-400 py-8">Keranjang Anda kosong</div>';
        totalElement.textContent = '$0';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map(item => {
        const priceNum = parseInt(item.price.replace(/[^0-9]/g, ''));
        total += priceNum;
        return `
            <div class="flex justify-between items-center bg-[#252a33] p-4 rounded-lg border border-white/10 mb-3">
                <div>
                    <h4 class="font-bold text-white">${item.name}</h4>
                    <p class="text-xs text-gray-400">${item.period}</p>
                    <p class="text-primary font-bold mt-1">${item.price}</p>
                </div>
                <button onclick="removeFromCart(${item.id})" class="text-gray-400 hover:text-red-500 transition">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        `;
    }).join('');

    totalElement.textContent = `$${total}`;
}

function checkout() {
    const cart = JSON.parse(localStorage.getItem('speakingPartnerCart'));
    if (cart.length === 0) return;

    let message = "Halo, saya ingin mendaftar untuk program berikut:%0A%0A";
    let total = 0;

    cart.forEach(item => {
        message += `- ${item.name} (${item.period}): ${item.price}%0A`;
        total += parseInt(item.price.replace(/[^0-9]/g, ''));
    });

    message += `%0A*Total: $${total}*`;
    message += "%0A%0AMohon info metode pembayarannya. Terima kasih!";

    window.open(`https://wa.me/6281946604721?text=${message}`, '_blank');
}

function showToast(message) {
    // Check if toast container exists, if not create it
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-[110] flex flex-col gap-2 pointer-events-none';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'bg-[#10b981] text-white px-6 py-3 rounded-full shadow-lg text-sm font-bold flex items-center gap-2 animate-fade-in-down pointer-events-auto';
    toast.innerHTML = `
        <span class="material-symbols-outlined text-[20px]">check_circle</span>
        ${message}
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-[-10px]');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function injectFloatingButtons() {
    if (document.getElementById('floatingButtons')) return;

    const buttonsHTML = `
        <div id="floatingButtons" class="fixed bottom-1/2 translate-y-1/2 right-6 flex flex-col gap-4 z-[90]">
            <!-- WhatsApp General -->
            <a href="https://wa.me/6281946604721" target="_blank" 
                class="group flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#128C7E] hover:scale-110 transition-all duration-300 relative">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" class="w-8 h-8 brightness-0 invert">
                <span class="absolute right-16 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-md pointer-events-none">
                    Hubungi Kami
                </span>
            </a>


            <!-- Scroll to Top -->
            <button onclick="window.scrollTo({top: 0, behavior: 'smooth'})" 
                class="group flex items-center justify-center w-14 h-14 bg-gray-600 text-white rounded-full shadow-lg hover:bg-gray-500 hover:scale-110 transition-all duration-300 relative">
                <span class="material-symbols-outlined text-[28px]">arrow_upward</span>
                <span class="absolute right-16 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-md pointer-events-none">
                    Kembali ke Atas
                </span>
            </button>

            <!-- Cart -->
            <button onclick="openCartModal()" 
                class="fab-cart group flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-blue-600 hover:scale-110 transition-all duration-300 relative">
                <span class="material-symbols-outlined text-[28px]">shopping_cart</span>
                <span class="cart-count-badge hidden absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#111621] transform scale-0 transition-transform duration-200">
                    0
                </span>
                <span class="absolute right-16 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-md pointer-events-none">
                    Keranjang
                </span>
            </button>
        </div>
        <style>
            @keyframes animate-fade-in-down {
                0% { opacity: 0; transform: translate(-50%, -20px); }
                100% { opacity: 1; transform: translate(-50%, 0); }
            }
            .animate-fade-in-down {
                animation: animate-fade-in-down 0.3s ease-out forwards;
            }
        </style>
    `;
    document.body.insertAdjacentHTML('beforeend', buttonsHTML);
}

function injectCartModal() {
    if (document.getElementById('cartModal')) return;

    const modalHTML = `
        <div id="cartModal" class="hidden fixed inset-0 z-[100] bg-black/80 items-center justify-center p-4 backdrop-blur-sm transition-opacity">
            <div class="bg-[#1c1f26] rounded-xl w-full max-w-md border border-white/10 shadow-2xl flex flex-col max-h-[90vh] transform scale-95 transition-transform duration-200" id="cartModalContent">
                <div class="p-6 border-b border-white/10 flex justify-between items-center bg-[#111621] rounded-t-xl">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-primary">shopping_cart</span>
                        <h2 class="text-xl font-bold text-white">Keranjang Saya</h2>
                    </div>
                    <button onclick="closeCartModal()" class="text-gray-400 hover:text-white transition">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div id="cartItemsContainer" class="p-6 overflow-y-auto flex-grow custom-scroll">
                    <!-- Items will be injected here -->
                </div>

                <div class="p-6 border-t border-white/10 bg-[#111621] rounded-b-xl">
                    <div class="flex justify-between items-center mb-6">
                        <span class="text-gray-400">Total Estimasi</span>
                        <span id="cartTotal" class="text-2xl font-bold text-white">$0</span>
                    </div>
                    <button onclick="checkout()" class="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 transform active:scale-95">
                         <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" class="h-6 w-6 brightness-0 invert">
                        Checkout via WhatsApp
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Animate modal open
    const modal = document.getElementById('cartModal');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('flex')) {
                const content = document.getElementById('cartModalContent');
                if (content) {
                    content.classList.remove('scale-95');
                    content.classList.add('scale-100');
                }
            } else {
                const content = document.getElementById('cartModalContent');
                if (content) {
                    content.classList.remove('scale-100');
                    content.classList.add('scale-95');
                }
            }
        });
    });
    observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
}
