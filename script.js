let cart = [];
const waNumber = "573209801174";

// Elementos del DOM
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.getElementById('close-cart');
const addToCartBtns = document.querySelectorAll('.btn-add');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-whatsapp');

// Abrir/Cerrar Carrito
cartIcon.addEventListener('click', () => cartSidebar.classList.add('active'));
closeCartBtn.addEventListener('click', () => cartSidebar.classList.remove('active'));

// AÑADIR AL CARRITO
addToCartBtns.forEach(button => {
    button.addEventListener('click', (e) => {
        const name = e.target.getAttribute('data-name');
        const price = parseInt(e.target.getAttribute('data-price'));
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, quantity: 1 });
        }

        updateCartUI();

        // 1. Animación de la bolsa (la que ya tienes)
        const icon = document.querySelector('#cart-icon');
        icon.classList.add('bump');
        setTimeout(() => icon.classList.remove('bump'), 300);

        // 2. MOSTRAR EL MENSAJE "AÑADIDO"
        showToast(); 
    });
});

// Función para el mensaje flotante
function showToast() {
    const toast = document.getElementById('toast-notification');
    toast.classList.add('show');
    
    // Se esconde después de 2 segundos
    setTimeout(() => {
        toast.classList.remove('show');
    }, 1000);
}

// Cambiar cantidad de un producto
window.changeQuantity = function(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        removeItem(index);
    } else {
        updateCartUI();
    }
}

// Eliminar producto
window.removeItem = function(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// Actualizar Interfaz del Carrito
function updateCartUI() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCountElement.innerText = totalItems;

    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Tu carrito está vacío</p>';
        cartTotalElement.innerText = '$0';
        return;
    }

    cart.forEach((item, index) => {
        const itemSubtotal = item.price * item.quantity;
        total += itemSubtotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item-row';
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <p style="font-weight:600; margin:0;">${item.name}</p>
                <p style="font-size:12px; color:#666; margin:0;">$${itemSubtotal.toLocaleString('es-CO')}</p>
                
                <div class="quantity-controls">
                    <button onclick="changeQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <button onclick="removeItem(${index})" class="btn-remove">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
        cartItemsContainer.appendChild(itemElement);
    });
    cartTotalElement.innerText = '$' + total.toLocaleString('es-CO');
}

// Finalizar compra por WhatsApp
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;

    let message = "Hola *SHALOM* 🌿, me gustaría pedir:\n\n";
    let total = 0;
    cart.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        message += `- ${item.name} (x${item.quantity}) - $${itemSubtotal.toLocaleString('es-CO')}\n`;
        total += itemSubtotal;
    });
    message += `\n*Total: $${total.toLocaleString('es-CO')}*`;

    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');

    cart = [];
    updateCartUI();
    cartSidebar.classList.remove('active');
});

// Despliegue de Información en la Tarjeta
document.addEventListener('click', (e) => {
    // Abrir información
    const btnOpen = e.target.closest('.btn-info-toggle');
    if (btnOpen) {
        e.preventDefault();
        const container = btnOpen.closest('.product-img-container');
        if (container) {
            container.querySelector('.product-info-side').classList.add('active');
        }
    }

    // Cerrar información
    const btnClose = e.target.closest('.btn-close-info');
    if (btnClose) {
        e.preventDefault();
        const infoSide = btnClose.closest('.product-info-side');
        if (infoSide) {
            infoSide.classList.remove('active');
        }
    }
});



