
// ========== CART FUNCTIONALITY ==========

// let cart = []; // This will store all items in the cart
let cart = JSON.parse(localStorage.getItem('farrahCart')) || [];

// save cart to LOCAL STORAGE WHENEVER IT CHANGES
function saveCart() {
    localStorage.setItem('farrahCart', JSON.stringify(cart));

}

  function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);

  showToast('order #${order.id} placed successfully!');
}

// Elements
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.querySelector('.cart-count');
const cartItemCount = document.getElementById('cart-item-count');
const cartSubtotal = document.getElementById('cart-subtotal');
const emptyCartMsg = document.getElementById('empty-cart');

// Open / Close Cart
document.getElementById('open-cart').addEventListener('click', () => {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

document.getElementById('close-cart').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ========== ADD TO CART ==========
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        const stock = parseInt(card.dataset.stock);
            if (stock <= 0 ) {
              alert('Sorry, this product is out of stock!');
              return;
        
            }
        const product = {
            id: card.dataset.id,
            name: card.dataset.name,
            price: parseInt(card.dataset.price),
            img: card.dataset.img,
            quantity: 1
        };

        // Check if product already exists in cart
       const existing = cart.find(item => item.id === product.id);

            if (existing) {
              if (existing.quantity >= stock) {
                alert('You cannot add more than available stock!');
              return;
                
              }
                existing.quantity += 1;
            } else {
                cart.push(product);
            }

            updateCart();
        });
    });


// ========== UPDATE CART UI ==========
function updateCart() {
    // Clear current items
    cartItemsContainer.innerHTML = '';



    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;

            const cartItemHTML = `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="cart-price">₦${item.price.toLocaleString()}</p>
                        <div class="quantity">
                            <button class="qty-btn decrease">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn increase">+</button>
                        </div>
                    </div>
                    <button class="remove-item"><i class="fas fa-trash"></i></button>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
        });
    }

    // Update totals
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCount.textContent = totalItems;
    cartItemCount.textContent = `(${totalItems})`;
    cartSubtotal.textContent = `₦${totalPrice.toLocaleString()}`;

    if (totalItems === 0) {
       cartCount.style.display = 'none';
    }
    else {
 cartCount.style.display = 'flex';
    }
updateBottomCartCount(totalItems);
    // Add event listeners for + - and remove
    addCartEventListeners();
    saveCart();
}

// ========== QUANTITY & REMOVE ==========
function addCartEventListeners() {
    // Increase quantity
    document.querySelectorAll('.increase').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.cart-item').dataset.id;
            const item = cart.find(i => i.id === id);

            //  FIND THE PRODUCT STOCK
            const productCard = document.querySelector(`.product-card[data-id="${id}"]`);
            const stock = productCard ? parseInt(productCard.dataset.stock) : 999;

            if (item.quantity + 1 > stock) {
                alert(`Only ${stock} item(s) available in stock!`);
                return;
            }


            item.quantity++;
            updateCart();
        });
    });

    // Decrease quantity
    document.querySelectorAll('.decrease').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.cart-item').dataset.id;
            const item = cart.find(i => i.id === id);
            
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart = cart.filter(i => i.id !== id);
            }
            updateCart();
        });
    });

    // Remove item
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.cart-item').dataset.id;
            cart = cart.filter(i => i.id !== id);
            updateCart();
        });
    });
}

// ========== WISHLIST FUNCTIONALITY ==========

// ========== WISHLIST FUNCTIONALITY ==========

let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
// Clean wishlist - remove IDs that no longer exist
function cleanWishlist() {
    const adminProducts = JSON.parse(localStorage.getItem('farrahProducts')) || [];
    const pageIds = [...document.querySelectorAll('.product-card')].map(card => card.dataset.id);
    const allValidIds = [...adminProducts.map(p => p.id), ...pageIds];

    wishlist = wishlist.filter(id => allValidIds.includes(id));
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Run the cleaner
cleanWishlist();

// Elements
const wishlistSidebar = document.getElementById('wishlist-sidebar');
const wishlistOverlay = document.getElementById('wishlist-overlay');
const wishlistItemsContainer = document.getElementById('wishlist-items');
const wishlistCount = document.querySelector('.wishlist-count');
const wishlistItemCount = document.getElementById('wishlist-item-count');

// Open / Close Wishlist
document.getElementById('open-wishlist').addEventListener('click', () => {
    wishlistSidebar.classList.add('active');
    wishlistOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderWishlist();
});

document.getElementById('close-wishlist').addEventListener('click', closeWishlist);
wishlistOverlay.addEventListener('click', closeWishlist);

function closeWishlist() {
    wishlistSidebar.classList.remove('active');
    wishlistOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Load hearts on page load
function loadWishlist() {
    document.querySelectorAll('.product-card').forEach(card => {
        const id = card.dataset.id;
        const heartBtn = card.querySelector('.wishlist i');

        if (wishlist.includes(id)) {
            heartBtn.classList.remove('far');
            heartBtn.classList.add('fas');
            heartBtn.style.color = '#db2777';
        }
    });
    updateWishlistCount();
}

loadWishlist();
updateWishlistCount();

// Click on product heart buttons
document.querySelectorAll('.wishlist').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const card = e.target.closest('.product-card');
        const id = card.dataset.id;
        const heartIcon = button.querySelector('i');

        if (wishlist.includes(id)) {
            // Remove
            wishlist = wishlist.filter(item => item !== id);
            heartIcon.classList.remove('fas');
            heartIcon.classList.add('far');
            heartIcon.style.color = '';
        } else {
            // Add
            wishlist.push(id);
            heartIcon.classList.remove('far');
            heartIcon.classList.add('fas');
            heartIcon.style.color = '#db2777';
        }

        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        renderWishlist(); // update sidebar if open
    });
});

// Update header count
function updateWishlistCount() {
    const count = wishlist.length;

    const headerCount = document.querySelector('.wishlist-count');
    // const wishlistItemCountEl = document.getElementById('wishlist-item-count');

    if (headerCount) {
        headerCount.textContent = count;
          headerCount.style.display = count > 0 ? 'flex' : 'none' ;

 } 
    // bottom nav count 
    const bottomCount = document.querySelector('.bottom-wishlist-count');
    if ( bottomCount) {
         bottomCount.textContent = count;
          bottomCount.style.display = count > 0 ? 'flex' : 'none';
    }

    // sidebar title
    const sidebarCount = document.getElementById('wishlist-item-count');
    if (sidebarCount) {
      sidebarCount.textContent = `(${count})`;
    }
}


// Render items inside wishlist sidebar
function renderWishlist() {
    const container = document.getElementById('wishlist-items');
    if (!container) return;

    container.innerHTML = '';

    if (wishlist.length === 0) {
        container.innerHTML = `<p class="empty-cart">Your wishlist is empty</p>`;
        return;
    }

    // Get products from Admin (localStorage)
    const adminProducts = JSON.parse(localStorage.getItem('farrahProducts')) || [];

    // Also get products currently on the page
    const pageProducts = [];
    document.querySelectorAll('.product-card').forEach(card => {
        pageProducts.push({
            id: card.dataset.id,
            name: card.dataset.name,
            price: card.dataset.price,
            image: card.dataset.img
        });
    });

    // Combine both sources
    const allProducts = [...adminProducts, ...pageProducts];

    let foundAny = false;

    wishlist.forEach(id => {
        const product = allProducts.find(p => p.id === id);

        if (product) {
            foundAny = true;
            const html = `
                <div class="cart-item" data-id="${product.id}">
                    <img src="${product.image || product.img}" alt="${product.name}">
                    <div class="cart-item-info">
                        <h4>${product.name}</h4>
                        <p class="cart-price">₦${Number(product.price).toLocaleString()}</p>
                    </div>
                    <button class="remove-item remove-wishlist-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        }
    });

    if (!foundAny) {
        container.innerHTML = `<p class="empty-cart">Your wishlist is empty</p>`;
    }

    // Re-attach remove buttons
    document.querySelectorAll('.remove-wishlist-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = this.closest('.cart-item').dataset.id;
            wishlist = wishlist.filter(item => item !== id);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));

            // Update heart icon on the page
            const card = document.querySelector(`.product-card[data-id="${id}"]`);
            if (card) {
                const icon = card.querySelector('.wishlist i');
                if (icon) {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    icon.style.color = '';
                }
            }

            updateWishlistCount();
            renderWishlist();
        });
    });
}

// ========== SEARCH FUNCTIONALITY ==========
const searchInput = document.querySelector('.search-box input');

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const productCards = document.querySelectorAll('.product-card');

    let visibleCount = 0;

    productCards.forEach(card => {
        const productName = card.dataset.name.toLowerCase();

        if (productName.includes(searchTerm)) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Optional: Show a message when no products match
    let noResultsMsg = document.getElementById('no-results');
    
    if (visibleCount === 0 && searchTerm !== '') {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('p');
            noResultsMsg.id = 'no-results';
            noResultsMsg.textContent = 'No products found matching your search.';
            noResultsMsg.style.textAlign = 'center';
            noResultsMsg.style.padding = '40px';
            noResultsMsg.style.color = '#888';
            noResultsMsg.style.gridColumn = '1 / -1';
            document.querySelector('.products-grid').appendChild(noResultsMsg);
        }
    } else {
        if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }
});        


// ========== SMOOTH SCROLL FOR LINKS ==========

// View All Products
document.querySelector('.view-all').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.featured').scrollIntoView({ 
        behavior: 'smooth' 
    });
});

// Category cards
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.featured').scrollIntoView({ 
            behavior: 'smooth' 
        });
    });
});

// Navigation links (Home, Shop, About, Contact)
document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        const text = link.textContent.trim().toLowerCase();

        if (text === 'home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } 
        else if (text === 'shop') {
            e.preventDefault();
            document.querySelector('.featured').scrollIntoView({ behavior: 'smooth' });
        }
    });
});


// ========== MOBILE HAMBURGER MENU ==========
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Change icon between bars and times (X)
    const icon = hamburger.querySelector('i');
    if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close menu when a link is clicked
document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// ========== ACTIVE NAV ON SCROLL ==========
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ========== CONTACT FORM ==========
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon. 💖');
    this.reset();
});

// ========== BOTTOM NAV FUNCTIONALITY ==========

// Open wishlist from bottom nav
document.getElementById('bottom-wishlist')?.addEventListener('click', () => {
    document.getElementById('open-wishlist').click();

    
});

// Open cart from bottom nav
document.getElementById('bottom-cart')?.addEventListener('click', () => {
    document.getElementById('open-cart').click();
});

// Update bottom cart count
function updateBottomCartCount(totalItems) {
    const bottomCount = document.querySelector('.bottom-cart-count');
    if (bottomCount) {
        bottomCount.textContent = totalItems;
        bottomCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

document.querySelectorAll('.bottom-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        const text = link.textContent.trim().toLowerCase();

        if (text === 'home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } 
        else if (text === 'shop') {
            e.preventDefault();
            document.querySelector('.featured').scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========== BOTTOM NAV ACTIVE STATE ==========
const bottomNavItems = document.querySelectorAll('.bottom-nav-item');

function updateBottomNav() {
    const scrollPos = window.scrollY + 100;

    document.querySelectorAll('section[id]').forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
            bottomNavItems.forEach(item => {
                item.classList.remove('active');

                // Match the correct bottom nav item
                if (
                    (id === 'home' && item.querySelector('.fa-home')) ||
                    (id === 'shop' && item.querySelector('.fa-shopping-bag')) ||
                    (id === 'contact' && item.querySelector('.fa-user'))
                ) {
                    item.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateBottomNav);
updateBottomNav(); // run once on load

// ========== LOAD PRODUCTS FROM ADMIN (localStorage) ==========

function loadDynamicProducts() {
    const savedProducts = JSON.parse(localStorage.getItem('farrahProducts')) || [];
    const productsGrid = document.querySelector('.products-grid');

    // If no products have been added from admin, keep the original ones
    if (savedProducts.length === 0) {
        return;
    }

    // Clear the current products
    productsGrid.innerHTML = '';

    // Create product cards from localStorage
    savedProducts.forEach(product => {
        let badgeHTML = '';
        if (product.badge === 'new') {
            badgeHTML = `<span class="badge new">New</span>`;
        } else if (product.badge === 'bestseller') {
            badgeHTML = `<span class="badge bestseller">Best Seller</span>`;
        } else if (product.badge === 'sale') {
            badgeHTML = `<span class="badge sale">Sale</span>`;
        }

       const productHTML = `
   
    <div class="product-card" 
         data-id="${product.id}" 
         data-name="${product.name}" 
         data-price="${product.price}" 
         data-img="${product.image}"
         data-stock="${product.stock}"
         data-category="${product.category || ''}">
         
        <div class="product-img">
            ${badgeHTML}
            <button class="wishlist"><i class="far fa-heart"></i></button>
            <a href="product.html?id=${product.id}">
            <img src="${product.image}" alt="${product.name}">
            </a>
        </div>
        
        <div class="product-info">
            <h3>${product.name}</h3>
            <div class="rating">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star-half-alt"></i>
                <span>(4.8)</span>
            </div>
            <div class="price">₦${Number(product.price).toLocaleString()}</div>
            
            <p class="stock-info" style="font-size: 0.85rem; margin: 6px 0 10px; color: ${product.stock <= 5 ? '#dc2626' : '#16a34a'};">
                ${product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
            </p>

            <button class="add-to-cart" ${product.stock <= 0 ? 'disabled' : ''}>
                <i class="fas fa-shopping-cart"></i> 
                ${product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
    </div>
`;


        productsGrid.insertAdjacentHTML('beforeend', productHTML);
    });

    // Re-attach Add to Cart and Wishlist events for the new products
    attachProductEvents();
}

// Re-attach events after loading dynamic products
function attachProductEvents() {
    // Add to Cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const stock = parseInt(card.dataset.stock) || 0;

            if (stock <= 0 ) {
              alert('Sorry, this product is out of stock!');
              return;
            }

            const product = {
                id: card.dataset.id,
                name: card.dataset.name,
                price: parseInt(card.dataset.price),
                img: card.dataset.img,
                quantity: 1
            };

            const existing = cart.find(item => item.id === product.id);

            if (existing) {
              if (existing.quantity + 1 > stock) {
                alert(`Only ${stock} item(s) available in stock!`);
              return;
                
              }
                existing.quantity += 1;
            } else {
                cart.push(product);
            }

            updateCart();
            
        });
         });
    

    // Wishlist hearts
    document.querySelectorAll('.wishlist').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const card = button.closest('.product-card');
            const id = card.dataset.id;
            const icon = button.querySelector('i');

            if (wishlist.includes(id)) {
                wishlist = wishlist.filter(item => item !== id);
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
            } else {
                wishlist.push(id);
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#db2777';
            }

            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            updateWishlistCount();
            renderWishlist();
        });
    });

    // Load correct heart states
    loadWishlist();
}

// Run when page loads
loadDynamicProducts();

// ========== CHECKOUT → CREATE ==========
// ========== CHECKOUT MODAL ==========
const checkoutModal = document.getElementById('checkout-modal');
const checkoutOverlay = document.getElementById('checkout-overlay');
const checkoutTotal = document.getElementById('checkoutTotal');

// Open Checkout Modal
document.querySelector('.btn-checkout').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    checkoutTotal.textContent = `₦${total.toLocaleString()}`;

    // Show modal
    checkoutModal.classList.add('active');
    checkoutOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Close Checkout Modal
function closeCheckout() {
    checkoutModal.classList.remove('active');
    checkoutOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

document.getElementById('close-checkout').addEventListener('click', closeCheckout);
checkoutOverlay.addEventListener('click', closeCheckout);

// Handle Place Order
document.getElementById('checkoutForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const customerName = document.getElementById('checkoutName').value.trim();
    const customerPhone = document.getElementById('checkoutPhone').value.trim();
    const customerAddress = document.getElementById('checkoutAddress').value.trim();

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order
    const order = {
        id: Date.now().toString().slice(-6),
        customer: customerName,
        phone: customerPhone,
        address: customerAddress,
        items: [...cart],
        total: total,
        status: 'pending',
        date: new Date().toLocaleString()
    };

    // Save order
    let orders = JSON.parse(localStorage.getItem('farrahOrders')) || [];
    orders.unshift(order);
    localStorage.setItem('farrahOrders', JSON.stringify(orders));

    // Reduce stock
    let products = JSON.parse(localStorage.getItem('farrahProducts')) || [];
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product) {
            product.stock = Math.max(0, Number(product.stock) - cartItem.quantity);
        }
    });
    localStorage.setItem('farrahProducts', JSON.stringify(products));

  
    // Success
   
    // Reset
    cart = [];
    updateCart();
    closeCart();
    closeCheckout();
    this.reset();
    
    

    // Reload products to update stock display
    loadDynamicProducts();
});


// WHATSAPP ORDER BUTTON

document.getElementById('whatsappOrderBtn')?.addEventListener('click', function(e) {
    e.preventDefault();

    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
        
    }
    //  YOUR WHATSAPP NUMBER
    const phoneNumber= "2348012345678";

    let message = 'Hello Farrah Kiddies! 👋%0A%0AI would like to place an order:%0A%0AI';

    cart.forEach(item => {
        message += `• ${item.name} * ${item.quantity} = ₦${(item.price * item.quantity).toLocaleString()}%0A`;
   
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `%0A*Total: ₦${total.toLocaleString()}*%0A%0APlease confirm my order. Thank you!`;

    const whatsappURL= `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappURL, '_blank');
})

// ========== PRODUCT FILTERS ==========
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const clearFiltersBtn = document.getElementById('clearFilters');

function applyFilters() {
    const selectedCategory = categoryFilter.value;
    const selectedPrice = priceFilter.value;

    const products = document.querySelectorAll('.product-card');

    products.forEach(card => {
        const price = parseInt(card.dataset.price);
        const name = card.dataset.name.toLowerCase();

        // Category filter (basic version using product name for now)
        let categoryMatch = true;
        if (selectedCategory !== 'all') {
            const productCategory = card.dataset.category || '';


            categoryMatch = productCategory === selectedCategory;
        }

        // Price filter
        let priceMatch = true;
        if (selectedPrice !== 'all') {
            if (selectedPrice === '0-10000') priceMatch = price < 10000;
            else if (selectedPrice === '10000-20000') priceMatch = price >= 10000 && price <= 20000;
            else if (selectedPrice === '20000-50000') priceMatch = price > 20000 && price <= 50000;
            else if (selectedPrice === '50000+') priceMatch = price > 50000;
        }

        if (categoryMatch && priceMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

categoryFilter?.addEventListener('change', applyFilters);
priceFilter?.addEventListener('change', applyFilters);

clearFiltersBtn?.addEventListener('click', () => {
    categoryFilter.value = 'all';
    priceFilter.value = 'all';
    applyFilters();
});



// ========== CHECKOUT → CREATE ORDER + REDUCE STOCK ==========
// document.querySelector('.btn-checkout').addEventListener('click', () => {
//     if (cart.length === 0) {
//         alert('Your cart is empty!');
//         return;
//     }

//     const customerName = prompt('Enter your full name:');
//     if (!customerName) return;

//     const customerPhone = prompt('Enter your phone number (WhatsApp):');
//     if (!customerPhone) return;

//     const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

//     // Create order
//     const order = {
//         id: Date.now().toString().slice(-6),
//         customer: customerName,
//         phone: customerPhone,
//         items: [...cart],
//         total: total,
//         status: 'pending',
//         date: new Date().toLocaleString()
//     };

//     // Save order
//     let orders = JSON.parse(localStorage.getItem('farrahOrders')) || [];
//     orders.unshift(order);
//     localStorage.setItem('farrahOrders', JSON.stringify(orders));

//     // ===== REDUCE STOCK =====
//     let products = JSON.parse(localStorage.getItem('farrahProducts')) || [];

//     cart.forEach(cartItem => {
//         const product = products.find(p => p.id === cartItem.id);
//         if (product) {
//             product.stock = Math.max(0, Number(product.stock) - cartItem.quantity);
//         }
//     });

//     localStorage.setItem('farrahProducts', JSON.stringify(products));

//     // Success message
//     alert(`Thank you ${customerName}!\n\nYour order #${order.id} has been placed successfully.\nTotal: ₦${total.toLocaleString()}\n\nWe will contact you on WhatsApp shortly.`);

    // Clear cart
    cart = [];
    updateCart();
    closeCart();

// // ========== CART FUNCTIONALITY ==========

// // let cart = []; // This will store all items in the cart
// let cart = JSON.parse(localStorage.getItem('farrahCart')) || [];

// // save cart to LOCAL STORAGE WHENEVER IT CHANGES
// function saveCart() {
//     localStorage.setItem('farrahCart', JSON.stringify(cart));

// }

//   function showToast(message) {
//   const toast = document.getElementById('toast');
//   toast.textContent = message;
//   toast.classList.add('show');

//   setTimeout(() => {
//     toast.classList.remove('show');
//   }, 3500);

//   showToast('order #${order.id} placed successfully!');
// }

// // Elements
// const cartSidebar = document.getElementById('cart-sidebar');
// const cartOverlay = document.getElementById('cart-overlay');
// const cartItemsContainer = document.getElementById('cart-items');
// const cartCount = document.querySelector('.cart-count');
// const cartItemCount = document.getElementById('cart-item-count');
// const cartSubtotal = document.getElementById('cart-subtotal');
// const emptyCartMsg = document.getElementById('empty-cart');

// // Open / Close Cart
// document.getElementById('open-cart').addEventListener('click', () => {
//     cartSidebar.classList.add('active');
//     cartOverlay.classList.add('active');
//     document.body.style.overflow = 'hidden';
// });

// document.getElementById('close-cart').addEventListener('click', closeCart);
// cartOverlay.addEventListener('click', closeCart);

// function closeCart() {
//     cartSidebar.classList.remove('active');
//     cartOverlay.classList.remove('active');
//     document.body.style.overflow = '';
// }

// // ========== ADD TO CART ==========
// document.querySelectorAll('.add-to-cart').forEach(button => {
//     button.addEventListener('click', (e) => {
//         const card = e.target.closest('.product-card');
//         const stock = parseInt(card.dataset.stock);
//             if (stock <= 0 ) {
//               alert('Sorry, this product is out of stock!');
//               return;
        
//             }
//         const product = {
//             id: card.dataset.id,
//             name: card.dataset.name,
//             price: parseInt(card.dataset.price),
//             img: card.dataset.img,
//             quantity: 1
//         };

//         // Check if product already exists in cart
//        const existing = cart.find(item => item.id === product.id);

//             if (existing) {
//               if (existing.quantity >= stock) {
//                 alert('You cannot add more than available stock!');
//               return;
                
//               }
//                 existing.quantity += 1;
//             } else {
//                 cart.push(product);
//             }

//             updateCart();
//         });
//     });


// // ========== UPDATE CART UI ==========
// function updateCart() {
//     // Clear current items
//     cartItemsContainer.innerHTML = '';



//     if (cart.length === 0) {
//         cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
//     } else {
//         cart.forEach(item => {
//             const itemTotal = item.price * item.quantity;

//             const cartItemHTML = `
//                 <div class="cart-item" data-id="${item.id}">
//                     <img src="${item.img}" alt="${item.name}">
//                     <div class="cart-item-info">
//                         <h4>${item.name}</h4>
//                         <p class="cart-price">₦${item.price.toLocaleString()}</p>
//                         <div class="quantity">
//                             <button class="qty-btn decrease">-</button>
//                             <span>${item.quantity}</span>
//                             <button class="qty-btn increase">+</button>
//                         </div>
//                     </div>
//                     <button class="remove-item"><i class="fas fa-trash"></i></button>
//                 </div>
//             `;
//             cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
//         });
//     }

//     // Update totals
//     const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
//     const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

//     cartCount.textContent = totalItems;
//     cartItemCount.textContent = `(${totalItems})`;
//     cartSubtotal.textContent = `₦${totalPrice.toLocaleString()}`;

//     if (totalItems === 0) {
//        cartCount.style.display = 'none';
//     }
//     else {
//  cartCount.style.display = 'flex';
//     }
// updateBottomCartCount(totalItems);
//     // Add event listeners for + - and remove
//     addCartEventListeners();
//     saveCart();
// }

// // ========== QUANTITY & REMOVE ==========
// function addCartEventListeners() {
//     // Increase quantity
//     document.querySelectorAll('.increase').forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             const id = e.target.closest('.cart-item').dataset.id;
//             const item = cart.find(i => i.id === id);

//             //  FIND THE PRODUCT STOCK
//             const productCard = document.querySelector(`.product-card[data-id="${id}"]`);
//             const stock = productCard ? parseInt(productCard.dataset.stock) : 999;

//             if (item.quantity + 1 > stock) {
//                 alert(`Only ${stock} item(s) available in stock!`);
//                 return;
//             }


//             item.quantity++;
//             updateCart();
//         });
//     });

//     // Decrease quantity
//     document.querySelectorAll('.decrease').forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             const id = e.target.closest('.cart-item').dataset.id;
//             const item = cart.find(i => i.id === id);
            
//             if (item.quantity > 1) {
//                 item.quantity--;
//             } else {
//                 cart = cart.filter(i => i.id !== id);
//             }
//             updateCart();
//         });
//     });

//     // Remove item
//     document.querySelectorAll('.remove-item').forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             const id = e.target.closest('.cart-item').dataset.id;
//             cart = cart.filter(i => i.id !== id);
//             updateCart();
//         });
//     });
// }

// // ========== WISHLIST FUNCTIONALITY ==========

// // ========== WISHLIST FUNCTIONALITY ==========

// let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
// // Clean wishlist - remove IDs that no longer exist
// function cleanWishlist() {
//     const adminProducts = JSON.parse(localStorage.getItem('farrahProducts')) || [];
//     const pageIds = [...document.querySelectorAll('.product-card')].map(card => card.dataset.id);
//     const allValidIds = [...adminProducts.map(p => p.id), ...pageIds];

//     wishlist = wishlist.filter(id => allValidIds.includes(id));
//     localStorage.setItem('wishlist', JSON.stringify(wishlist));
// }

// // Run the cleaner
// cleanWishlist();

// // Elements
// const wishlistSidebar = document.getElementById('wishlist-sidebar');
// const wishlistOverlay = document.getElementById('wishlist-overlay');
// const wishlistItemsContainer = document.getElementById('wishlist-items');
// const wishlistCount = document.querySelector('.wishlist-count');
// const wishlistItemCount = document.getElementById('wishlist-item-count');

// // Open / Close Wishlist
// document.getElementById('open-wishlist').addEventListener('click', () => {
//     wishlistSidebar.classList.add('active');
//     wishlistOverlay.classList.add('active');
//     document.body.style.overflow = 'hidden';
//     renderWishlist();
// });

// document.getElementById('close-wishlist').addEventListener('click', closeWishlist);
// wishlistOverlay.addEventListener('click', closeWishlist);

// function closeWishlist() {
//     wishlistSidebar.classList.remove('active');
//     wishlistOverlay.classList.remove('active');
//     document.body.style.overflow = '';
// }

// // Load hearts on page load
// function loadWishlist() {
//     document.querySelectorAll('.product-card').forEach(card => {
//         const id = card.dataset.id;
//         const heartBtn = card.querySelector('.wishlist i');

//         if (wishlist.includes(id)) {
//             heartBtn.classList.remove('far');
//             heartBtn.classList.add('fas');
//             heartBtn.style.color = '#db2777';
//         }
//     });
//     updateWishlistCount();
// }

// loadWishlist();
// updateWishlistCount();

// // Click on product heart buttons
// document.querySelectorAll('.wishlist').forEach(button => {
//     button.addEventListener('click', (e) => {
//         e.preventDefault();
        
//         const card = e.target.closest('.product-card');
//         const id = card.dataset.id;
//         const heartIcon = button.querySelector('i');

//         if (wishlist.includes(id)) {
//             // Remove
//             wishlist = wishlist.filter(item => item !== id);
//             heartIcon.classList.remove('fas');
//             heartIcon.classList.add('far');
//             heartIcon.style.color = '';
//         } else {
//             // Add
//             wishlist.push(id);
//             heartIcon.classList.remove('far');
//             heartIcon.classList.add('fas');
//             heartIcon.style.color = '#db2777';
//         }

//         localStorage.setItem('wishlist', JSON.stringify(wishlist));
//         updateWishlistCount();
//         renderWishlist(); // update sidebar if open
//     });
// });

// // Update header count
// function updateWishlistCount() {
//     const count = wishlist.length;

//     const headerCount = document.querySelector('.wishlist-count');
//     // const wishlistItemCountEl = document.getElementById('wishlist-item-count');

//     if (headerCount) {
//         headerCount.textContent = count;
//           headerCount.style.display = count > 0 ? 'flex' : 'none' ;

//  } 
//     // bottom nav count 
//     const bottomCount = document.querySelector('.bottom-wishlist-count');
//     if ( bottomCount) {
//          bottomCount.textContent = count;
//           bottomCount.style.display = count > 0 ? 'flex' : 'none';
//     }

//     // sidebar title
//     const sidebarCount = document.getElementById('wishlist-item-count');
//     if (sidebarCount) {
//       sidebarCount.textContent = `(${count})`;
//     }
// }


// // Render items inside wishlist sidebar
// function renderWishlist() {
//     const container = document.getElementById('wishlist-items');
//     if (!container) return;

//     container.innerHTML = '';

//     if (wishlist.length === 0) {
//         container.innerHTML = `<p class="empty-cart">Your wishlist is empty</p>`;
//         return;
//     }

//     // Get products from Admin (localStorage)
//     const adminProducts = JSON.parse(localStorage.getItem('farrahProducts')) || [];

//     // Also get products currently on the page
//     const pageProducts = [];
//     document.querySelectorAll('.product-card').forEach(card => {
//         pageProducts.push({
//             id: card.dataset.id,
//             name: card.dataset.name,
//             price: card.dataset.price,
//             image: card.dataset.img
//         });
//     });

//     // Combine both sources
//     const allProducts = [...adminProducts, ...pageProducts];

//     let foundAny = false;

//     wishlist.forEach(id => {
//         const product = allProducts.find(p => p.id === id);

//         if (product) {
//             foundAny = true;
//             const html = `
//                 <div class="cart-item" data-id="${product.id}">
//                     <img src="${product.image || product.img}" alt="${product.name}">
//                     <div class="cart-item-info">
//                         <h4>${product.name}</h4>
//                         <p class="cart-price">₦${Number(product.price).toLocaleString()}</p>
//                     </div>
//                     <button class="remove-item remove-wishlist-btn">
//                         <i class="fas fa-trash"></i>
//                     </button>
//                 </div>
//             `;
//             container.insertAdjacentHTML('beforeend', html);
//         }
//     });

//     if (!foundAny) {
//         container.innerHTML = `<p class="empty-cart">Your wishlist is empty</p>`;
//     }

//     // Re-attach remove buttons
//     document.querySelectorAll('.remove-wishlist-btn').forEach(btn => {
//         btn.addEventListener('click', function () {
//             const id = this.closest('.cart-item').dataset.id;
//             wishlist = wishlist.filter(item => item !== id);
//             localStorage.setItem('wishlist', JSON.stringify(wishlist));

//             // Update heart icon on the page
//             const card = document.querySelector(`.product-card[data-id="${id}"]`);
//             if (card) {
//                 const icon = card.querySelector('.wishlist i');
//                 if (icon) {
//                     icon.classList.remove('fas');
//                     icon.classList.add('far');
//                     icon.style.color = '';
//                 }
//             }

//             updateWishlistCount();
//             renderWishlist();
//         });
//     });
// }

// // ========== SEARCH FUNCTIONALITY ==========
// const searchInput = document.querySelector('.search-box input');

// searchInput.addEventListener('input', () => {
//     const searchTerm = searchInput.value.toLowerCase().trim();
//     const productCards = document.querySelectorAll('.product-card');

//     let visibleCount = 0;

//     productCards.forEach(card => {
//         const productName = card.dataset.name.toLowerCase();

//         if (productName.includes(searchTerm)) {
//             card.style.display = 'block';
//             visibleCount++;
//         } else {
//             card.style.display = 'none';
//         }
//     });

//     // Optional: Show a message when no products match
//     let noResultsMsg = document.getElementById('no-results');
    
//     if (visibleCount === 0 && searchTerm !== '') {
//         if (!noResultsMsg) {
//             noResultsMsg = document.createElement('p');
//             noResultsMsg.id = 'no-results';
//             noResultsMsg.textContent = 'No products found matching your search.';
//             noResultsMsg.style.textAlign = 'center';
//             noResultsMsg.style.padding = '40px';
//             noResultsMsg.style.color = '#888';
//             noResultsMsg.style.gridColumn = '1 / -1';
//             document.querySelector('.products-grid').appendChild(noResultsMsg);
//         }
//     } else {
//         if (noResultsMsg) {
//             noResultsMsg.remove();
//         }
//     }
// });        


// // ========== SMOOTH SCROLL FOR LINKS ==========

// // View All Products
// document.querySelector('.view-all').addEventListener('click', (e) => {
//     e.preventDefault();
//     document.querySelector('.featured').scrollIntoView({ 
//         behavior: 'smooth' 
//     });
// });

// // Category cards
// document.querySelectorAll('.category-card').forEach(card => {
//     card.addEventListener('click', (e) => {
//         e.preventDefault();
//         document.querySelector('.featured').scrollIntoView({ 
//             behavior: 'smooth' 
//         });
//     });
// });

// // Navigation links (Home, Shop, About, Contact)
// document.querySelectorAll('.nav a').forEach(link => {
//     link.addEventListener('click', (e) => {
//         const text = link.textContent.trim().toLowerCase();

//         if (text === 'home') {
//             e.preventDefault();
//             window.scrollTo({ top: 0, behavior: 'smooth' });
//         } 
//         else if (text === 'shop') {
//             e.preventDefault();
//             document.querySelector('.featured').scrollIntoView({ behavior: 'smooth' });
//         }
//     });
// });


// // ========== MOBILE HAMBURGER MENU ==========
// const hamburger = document.getElementById('hamburger');
// const navMenu = document.querySelector('.nav');

// hamburger.addEventListener('click', () => {
//     navMenu.classList.toggle('active');

//     // Change icon between bars and times (X)
//     const icon = hamburger.querySelector('i');
//     if (navMenu.classList.contains('active')) {
//         icon.classList.remove('fa-bars');
//         icon.classList.add('fa-times');
//     } else {
//         icon.classList.remove('fa-times');
//         icon.classList.add('fa-bars');
//     }
// });

// // Close menu when a link is clicked
// document.querySelectorAll('.nav a').forEach(link => {
//     link.addEventListener('click', () => {
//         navMenu.classList.remove('active');
//         const icon = hamburger.querySelector('i');
//         icon.classList.remove('fa-times');
//         icon.classList.add('fa-bars');
//     });
// });

// // ========== ACTIVE NAV ON SCROLL ==========
// const sections = document.querySelectorAll('section[id]');
// const navLinks = document.querySelectorAll('.nav-link');

// window.addEventListener('scroll', () => {
//     let current = '';

//     sections.forEach(section => {
//         const sectionTop = section.offsetTop;
//         const sectionHeight = section.clientHeight;

//         if (scrollY >= sectionTop - 150) {
//             current = section.getAttribute('id');
//         }
//     });

//     navLinks.forEach(link => {
//         link.classList.remove('active');
//         if (link.getAttribute('href') === `#${current}`) {
//             link.classList.add('active');
//         }
//     });
// });

// // ========== CONTACT FORM ==========
// document.getElementById('contactForm')?.addEventListener('submit', function(e) {
//     e.preventDefault();
//     alert('Thank you for your message! We will get back to you soon. 💖');
//     this.reset();
// });

// // ========== BOTTOM NAV FUNCTIONALITY ==========

// // Open wishlist from bottom nav
// document.getElementById('bottom-wishlist')?.addEventListener('click', () => {
//     document.getElementById('open-wishlist').click();

    
// });

// // Open cart from bottom nav
// document.getElementById('bottom-cart')?.addEventListener('click', () => {
//     document.getElementById('open-cart').click();
// });

// // Update bottom cart count
// function updateBottomCartCount(totalItems) {
//     const bottomCount = document.querySelector('.bottom-cart-count');
//     if (bottomCount) {
//         bottomCount.textContent = totalItems;
//         bottomCount.style.display = totalItems > 0 ? 'flex' : 'none';
//     }
// }

// document.querySelectorAll('.bottom-nav a').forEach(link => {
//     link.addEventListener('click', (e) => {
//         const text = link.textContent.trim().toLowerCase();

//         if (text === 'home') {
//             e.preventDefault();
//             window.scrollTo({ top: 0, behavior: 'smooth' });
//         } 
//         else if (text === 'shop') {
//             e.preventDefault();
//             document.querySelector('.featured').scrollIntoView({ behavior: 'smooth' });
//         }
//     });
// });

// // ========== BOTTOM NAV ACTIVE STATE ==========
// const bottomNavItems = document.querySelectorAll('.bottom-nav-item');

// function updateBottomNav() {
//     const scrollPos = window.scrollY + 100;

//     document.querySelectorAll('section[id]').forEach(section => {
//         const top = section.offsetTop;
//         const height = section.offsetHeight;
//         const id = section.getAttribute('id');

//         if (scrollPos >= top && scrollPos < top + height) {
//             bottomNavItems.forEach(item => {
//                 item.classList.remove('active');

//                 // Match the correct bottom nav item
//                 if (
//                     (id === 'home' && item.querySelector('.fa-home')) ||
//                     (id === 'shop' && item.querySelector('.fa-shopping-bag')) ||
//                     (id === 'contact' && item.querySelector('.fa-user'))
//                 ) {
//                     item.classList.add('active');
//                 }
//             });
//         }
//     });
// }

// window.addEventListener('scroll', updateBottomNav);
// updateBottomNav(); // run once on load

// // ========== LOAD PRODUCTS FROM ADMIN (localStorage) ==========

// function loadDynamicProducts() {
//     const savedProducts = JSON.parse(localStorage.getItem('farrahProducts')) || [];
//     const productsGrid = document.querySelector('.products-grid');

//     // If no products have been added from admin, keep the original ones
//     if (savedProducts.length === 0) {
//         return;
//     }

//     // Clear the current products
//     productsGrid.innerHTML = '';

//     // Create product cards from localStorage
//     savedProducts.forEach(product => {
//         let badgeHTML = '';
//         if (product.badge === 'new') {
//             badgeHTML = `<span class="badge new">New</span>`;
//         } else if (product.badge === 'bestseller') {
//             badgeHTML = `<span class="badge bestseller">Best Seller</span>`;
//         } else if (product.badge === 'sale') {
//             badgeHTML = `<span class="badge sale">Sale</span>`;
//         }

//        const productHTML = `
   
//     <div class="product-card" 
//          data-id="${product.id}" 
//          data-name="${product.name}" 
//          data-price="${product.price}" 
//          data-img="${product.image}"
//          data-stock="${product.stock}"
//          data-category="${product.category || ''}">
         
//         <div class="product-img">
//             ${badgeHTML}
//             <button class="wishlist"><i class="far fa-heart"></i></button>
//             <a href="product.html?id=${product.id}">
//             <img src="${product.image}" alt="${product.name}">
//             </a>
//         </div>
        
//         <div class="product-info">
//             <h3>${product.name}</h3>
//             <div class="rating">
//                 <i class="fas fa-star"></i>
//                 <i class="fas fa-star"></i>
//                 <i class="fas fa-star"></i>
//                 <i class="fas fa-star"></i>
//                 <i class="fas fa-star-half-alt"></i>
//                 <span>(4.8)</span>
//             </div>
//             <div class="price">₦${Number(product.price).toLocaleString()}</div>
            
//             <p class="stock-info" style="font-size: 0.85rem; margin: 6px 0 10px; color: ${product.stock <= 5 ? '#dc2626' : '#16a34a'};">
//                 ${product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
//             </p>

//             <button class="add-to-cart" ${product.stock <= 0 ? 'disabled' : ''}>
//                 <i class="fas fa-shopping-cart"></i> 
//                 ${product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
//             </button>
//         </div>
//     </div>
// `;


//         productsGrid.insertAdjacentHTML('beforeend', productHTML);
//     });

//     // Re-attach Add to Cart and Wishlist events for the new products
//     attachProductEvents();
// }

// // Re-attach events after loading dynamic products
// function attachProductEvents() {
//     // Add to Cart buttons
//     document.querySelectorAll('.add-to-cart').forEach(button => {
//         button.addEventListener('click', (e) => {
//             const card = e.target.closest('.product-card');
//             const stock = parseInt(card.dataset.stock) || 0;

//             if (stock <= 0 ) {
//               alert('Sorry, this product is out of stock!');
//               return;
//             }

//             const product = {
//                 id: card.dataset.id,
//                 name: card.dataset.name,
//                 price: parseInt(card.dataset.price),
//                 img: card.dataset.img,
//                 quantity: 1
//             };

//             const existing = cart.find(item => item.id === product.id);

//             if (existing) {
//               if (existing.quantity + 1 > stock) {
//                 alert(`Only ${stock} item(s) available in stock!`);
//               return;
                
//               }
//                 existing.quantity += 1;
//             } else {
//                 cart.push(product);
//             }

//             updateCart();
            
//         });
//          });
    

//     // Wishlist hearts
//     document.querySelectorAll('.wishlist').forEach(button => {
//         button.addEventListener('click', (e) => {
//             e.preventDefault();
//             e.stopPropagation();

//             const card = button.closest('.product-card');
//             const id = card.dataset.id;
//             const icon = button.querySelector('i');

//             if (wishlist.includes(id)) {
//                 wishlist = wishlist.filter(item => item !== id);
//                 icon.classList.remove('fas');
//                 icon.classList.add('far');
//                 icon.style.color = '';
//             } else {
//                 wishlist.push(id);
//                 icon.classList.remove('far');
//                 icon.classList.add('fas');
//                 icon.style.color = '#db2777';
//             }

//             localStorage.setItem('wishlist', JSON.stringify(wishlist));
//             updateWishlistCount();
//             renderWishlist();
//         });
//     });

//     // Load correct heart states
//     loadWishlist();
// }

// // Run when page loads
// loadDynamicProducts();

// // ========== CHECKOUT → CREATE ==========
// // ========== CHECKOUT MODAL ==========
// const checkoutModal = document.getElementById('checkout-modal');
// const checkoutOverlay = document.getElementById('checkout-overlay');
// const checkoutTotal = document.getElementById('checkoutTotal');

// // Open Checkout Modal
// document.querySelector('.btn-checkout').addEventListener('click', () => {
//     if (cart.length === 0) {
//         alert('Your cart is empty!');
//         return;
//     }

//     // Calculate total
//     const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//     checkoutTotal.textContent = `₦${total.toLocaleString()}`;

//     // Show modal
//     checkoutModal.classList.add('active');
//     checkoutOverlay.classList.add('active');
//     document.body.style.overflow = 'hidden';
// });

// // Close Checkout Modal
// function closeCheckout() {
//     checkoutModal.classList.remove('active');
//     checkoutOverlay.classList.remove('active');
//     document.body.style.overflow = '';
// }

// document.getElementById('close-checkout').addEventListener('click', closeCheckout);
// checkoutOverlay.addEventListener('click', closeCheckout);

// // Handle Place Order
// document.getElementById('checkoutForm').addEventListener('submit', function(e) {
//     e.preventDefault();

//     const customerName = document.getElementById('checkoutName').value.trim();
//     const customerPhone = document.getElementById('checkoutPhone').value.trim();
//     const customerAddress = document.getElementById('checkoutAddress').value.trim();

//     const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

//     // Create order
//     const order = {
//         id: Date.now().toString().slice(-6),
//         customer: customerName,
//         phone: customerPhone,
//         address: customerAddress,
//         items: [...cart],
//         total: total,
//         status: 'pending',
//         date: new Date().toLocaleString()
//     };

//     // Save order
//     let orders = JSON.parse(localStorage.getItem('farrahOrders')) || [];
//     orders.unshift(order);
//     localStorage.setItem('farrahOrders', JSON.stringify(orders));

//     // Reduce stock
//     let products = JSON.parse(localStorage.getItem('farrahProducts')) || [];
//     cart.forEach(cartItem => {
//         const product = products.find(p => p.id === cartItem.id);
//         if (product) {
//             product.stock = Math.max(0, Number(product.stock) - cartItem.quantity);
//         }
//     });
//     localStorage.setItem('farrahProducts', JSON.stringify(products));

  
//     // Success
   
//     // Reset
//     cart = [];
//     updateCart();
//     closeCart();
//     closeCheckout();
//     this.reset();
    
    

//     // Reload products to update stock display
//     loadDynamicProducts();
// });


// // WHATSAPP ORDER BUTTON

// document.getElementById('whatsappOrderBtn')?.addEventListener('click', function(e) {
//     e.preventDefault();

//     if (cart.length === 0) {
//         alert('Your cart is empty!');
//         return;
        
//     }
//     //  YOUR WHATSAPP NUMBER
//     const phoneNumber= "2348012345678";

//     let message = 'Hello Farrah Kiddies! 👋%0A%0AI would like to place an order:%0A%0AI';

//     cart.forEach(item => {
//         message += `• ${item.name} * ${item.quantity} = ₦${(item.price * item.quantity).toLocaleString()}%0A`;
   
//     });

//     const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//     message += `%0A*Total: ₦${total.toLocaleString()}*%0A%0APlease confirm my order. Thank you!`;

//     const whatsappURL= `https://wa.me/${phoneNumber}?text=${message}`;
//     window.open(whatsappURL, '_blank');
// })

// // ========== PRODUCT FILTERS ==========
// const categoryFilter = document.getElementById('categoryFilter');
// const priceFilter = document.getElementById('priceFilter');
// const clearFiltersBtn = document.getElementById('clearFilters');

// function applyFilters() {
//     const selectedCategory = categoryFilter.value;
//     const selectedPrice = priceFilter.value;

//     const products = document.querySelectorAll('.product-card');

//     products.forEach(card => {
//         const price = parseInt(card.dataset.price);
//         const name = card.dataset.name.toLowerCase();

//         // Category filter (basic version using product name for now)
//         let categoryMatch = true;
//         if (selectedCategory !== 'all') {
//             const productCategory = card.dataset.category || '';


//             categoryMatch = productCategory === selectedCategory;
//         }

//         // Price filter
//         let priceMatch = true;
//         if (selectedPrice !== 'all') {
//             if (selectedPrice === '0-10000') priceMatch = price < 10000;
//             else if (selectedPrice === '10000-20000') priceMatch = price >= 10000 && price <= 20000;
//             else if (selectedPrice === '20000-50000') priceMatch = price > 20000 && price <= 50000;
//             else if (selectedPrice === '50000+') priceMatch = price > 50000;
//         }

//         if (categoryMatch && priceMatch) {
//             card.style.display = 'block';
//         } else {
//             card.style.display = 'none';
//         }
//     });
// }

// categoryFilter?.addEventListener('change', applyFilters);
// priceFilter?.addEventListener('change', applyFilters);

// clearFiltersBtn?.addEventListener('click', () => {
//     categoryFilter.value = 'all';
//     priceFilter.value = 'all';
//     applyFilters();
// });



// // ========== CHECKOUT → CREATE ORDER + REDUCE STOCK ==========
// // document.querySelector('.btn-checkout').addEventListener('click', () => {
// //     if (cart.length === 0) {
// //         alert('Your cart is empty!');
// //         return;
// //     }

// //     const customerName = prompt('Enter your full name:');
// //     if (!customerName) return;

// //     const customerPhone = prompt('Enter your phone number (WhatsApp):');
// //     if (!customerPhone) return;

// //     const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

// //     // Create order
// //     const order = {
// //         id: Date.now().toString().slice(-6),
// //         customer: customerName,
// //         phone: customerPhone,
// //         items: [...cart],
// //         total: total,
// //         status: 'pending',
// //         date: new Date().toLocaleString()
// //     };

// //     // Save order
// //     let orders = JSON.parse(localStorage.getItem('farrahOrders')) || [];
// //     orders.unshift(order);
// //     localStorage.setItem('farrahOrders', JSON.stringify(orders));

// //     // ===== REDUCE STOCK =====
// //     let products = JSON.parse(localStorage.getItem('farrahProducts')) || [];

// //     cart.forEach(cartItem => {
// //         const product = products.find(p => p.id === cartItem.id);
// //         if (product) {
// //             product.stock = Math.max(0, Number(product.stock) - cartItem.quantity);
// //         }
// //     });

// //     localStorage.setItem('farrahProducts', JSON.stringify(products));

// //     // Success message
// //     alert(`Thank you ${customerName}!\n\nYour order #${order.id} has been placed successfully.\nTotal: ₦${total.toLocaleString()}\n\nWe will contact you on WhatsApp shortly.`);

//     // Clear cart
// //     cart = [];
//     // updateCart();
// //     closeCart();
// >>>>>>> 9ba7ae45d40ff2918d873066e32b002cca22083b
// // });