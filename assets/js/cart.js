// Cart State
let cart = JSON.parse(localStorage.getItem('sangam_cart')) || [];

function saveCart() {
    localStorage.setItem('sangam_cart', JSON.stringify(cart));
}

function renderCart() {
    const list = document.querySelector('.cart-items');
    const badge = document.querySelector('.cart-badge');
    const totalEl = document.querySelector('.cart-total-price');
    
    if(!list || !badge || !totalEl) return; // Cart UI not on this page

    list.innerHTML = '';
    let total = 0;
    let itemCount = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        itemCount += item.quantity;

        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">₹${item.price}</div>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn minus" onclick="updateCartItem(${index}, -1)"><i class="fa-solid fa-minus"></i></button>
                <span>${item.quantity}</span>
                <button class="qty-btn plus" onclick="updateCartItem(${index}, 1)"><i class="fa-solid fa-plus"></i></button>
            </div>
        `;
        list.appendChild(itemEl);
    });

    badge.innerText = itemCount;
    totalEl.innerText = `₹${total}`;
    
    // Toggle empty message
    const emptyMsg = document.querySelector('.cart-empty-message');
    if (cart.length === 0) {
        list.style.display = 'none';
        emptyMsg.style.display = 'block';
    } else {
        list.style.display = 'flex';
        emptyMsg.style.display = 'none';
    }
}

function addToCart(name, price) {
    const existing = cart.find(i => i.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price: parseInt(price), quantity: 1 });
    }
    saveCart();
    renderCart();

    // Trigger cart drawer open
    const drawer = document.querySelector('.cart-drawer');
    const overlay = document.querySelector('.cart-drawer-overlay');
    if (drawer && overlay && !drawer.classList.contains('open')) {
        drawer.classList.add('open');
        overlay.classList.add('open');
    }
}

function updateCartItem(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        // Remove item
        cart.splice(index, 1);
    }
    saveCart();
    renderCart();
}

document.addEventListener('DOMContentLoaded', () => {
    
    // Setup Cart Drawer UI globally if running
    const body = document.querySelector('body');
    const cartHTML = `
        <button class="cart-toggle-btn">
            <i class="fa-solid fa-cart-shopping"></i>
            <span class="cart-badge">0</span>
        </button>
        <div class="cart-drawer-overlay"></div>
        <div class="cart-drawer">
            <div class="cart-header">
                <h3><i class="fa-solid fa-basket-shopping"></i> Your Order</h3>
                <button class="close-cart"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="cart-items">
                <!-- Javascript will inject items here -->
            </div>
            <div class="cart-empty-message">
                <i class="fa-solid fa-plate-wheat" style="font-size:3rem; color:var(--primary-green); margin-bottom:1rem;"></i>
                <p>Your banana leaf is empty.</p>
                <p style="font-size:0.9rem;">Add some delicious items from our menu!</p>
            </div>
            <div class="cart-footer">
                <div class="cart-total">
                    <span>Total Estimate:</span>
                    <span class="cart-total-price">₹0</span>
                </div>
                <button class="btn btn-primary checkout-btn" onclick="alert('Checkout integration is disabled for this prototype. Proceed to counter!')">Proceed to Order</button>
            </div>
        </div>
    `;
    body.insertAdjacentHTML('beforeend', cartHTML);

    const toggleBtn = document.querySelector('.cart-toggle-btn');
    const closeBtn = document.querySelector('.close-cart');
    const drawer = document.querySelector('.cart-drawer');
    const overlay = document.querySelector('.cart-drawer-overlay');

    const toggleCart = () => {
        drawer.classList.toggle('open');
        overlay.classList.toggle('open');
    };

    if (toggleBtn) toggleBtn.addEventListener('click', toggleCart);
    if (closeBtn) closeBtn.addEventListener('click', toggleCart);
    if (overlay) overlay.addEventListener('click', toggleCart);

    // Initial Render
    renderCart();

    // Set up add to cart buttons for menu items
    const addBtns = document.querySelectorAll('.add-to-cart-btn');
    addBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = e.currentTarget.getAttribute('data-name');
            const price = e.currentTarget.getAttribute('data-price');
            addToCart(name, price);
        });
    });

    // ================================= //
    // ANIMATION OBSERVER logic
    // ================================= //
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                // Remove class when scrolling away to allow re-animation on scroll back
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });
});
