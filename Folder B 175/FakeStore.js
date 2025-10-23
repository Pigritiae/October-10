async function fetchProducts() {
    const productsList = document.getElementById('products-list');
    productsList.textContent = 'Loading...';
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
                let productsHTML = '';
                data.forEach(product => {
                    productsHTML += `
                    <li>
                    <img src="${product.image}" alt="${product.title}" width="50">
                    ${product.title} - <span>$${product.price}</span
                    </li>
                    `;
                });
                productsList.innerHTML = productsHTML;
            } else {
                productsList.textContent = 'No Products Found';
            }
        } else {
            productsList.textContent = 'Failed to Load Products';
            console.error('FakeStore API error:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
        productsList.textContent = 'Failed to Load Products.';
    }
}
fetchProducts();