let cart = [];
async function fetchProducts() {
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = 'Loading...';
    try {
        const response = await fetch('https://dummyjson.com/products');
        if (response.ok) {
            const data = await response.json();
            const products = data.products;
            if (products && products.length > 0) {
                let productsHTML = '';
                products.forEach(product => {
                    productsHTML += `
                    <li data-product-id="${product.id}">
                    <img src="${product.thumbnail}" alt="${product.title}" width="100">
                    <h3>${product.title}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                    <button class="add-to-cart">Add to Cart</button>
                    </li>
                    `;
                });
                productsList.innerHTML = productsHTML;
                attachAddToCartListeners();
            } else {
                productsList.innerHTML = 'No Products Found.';
            }
        } else {
            productsList.innerHTML = 'Failed to Load Products.';
            console.error('DummyJSON API error:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
        productsList.innerHTML = 'Failed to Load Products.';
    }
}
function attachAddToCartListeners() {
    const productsList = document.getElementById('products-list');
    productsList.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-to-cart')) {
            const listItem = event.target.closest('li');
            if (listItem) {
                const productId = listItem.dataset.productId;
                addToCart(productId);
            }
        }
    });
}
async function addToCart(productId) {
    try {
        const response = await fetch(`https://dummyjson.com/products/${productId}`);
        if (response.ok) {
            const product = await response.json();
            // Ensure ID is treated as a number for consistency
            const existingProduct = cart.find(item => item.id === product.id)
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                product.quantity = 1;
                cart.push(product);
            }
            updateCart();
        } else {
            console.error('Failed to Fetch Product Details.');
        }
    } catch (error) {
        console.error('Error', error);
    }
}
function updateCart() {
    const cartList = document.getElementById('cart-list');
    const cartTotalElement = document.getElementById('cart-total');
    let cartHTML = '';
    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        cartHTML += `
        <li>
        ${item.title} (${item.quantity}) - $${itemTotal.toFixed(2)}
        </li>
        `;
        total += itemTotal;
    });
    
    // Check if cart is empty to set list and total correctly
    if (cart.length === 0) {
        cartList.innerHTML = 'Your Cart is Empty.';
    } else {
        cartList.innerHTML = cartHTML;
    }
    
    // CORRECTION 2: Ensures total is always formatted correctly, even if cart is emptied
    cartTotalElement.textContent = total.toFixed(2);
}
fetchProducts();
/* Código corrigido pela IA Gemini */ 