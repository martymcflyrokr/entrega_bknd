document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const productList = document.getElementById('productList');
    const productForm = document.getElementById('productForm');
    const titleInput = document.getElementById('title');
    const priceInput = document.getElementById('price');

    if (!productForm || !productList) {
        console.error('❌ No se encontró el formulario o la lista de productos');
        return;
    }

    // Recibir productos actualizados desde el servidor
    socket.on('updateProducts', (products) => {
        productList.innerHTML = ''; // Limpiar lista

        products.forEach(product => {
            const li = document.createElement('li');
            li.textContent = `${product.title} - $${product.price}`;
            productList.appendChild(li);
        });
    });

    // Enviar nuevos productos al servidor
    productForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = titleInput.value.trim();
        const price = parseFloat(priceInput.value);

        if (!title || isNaN(price)) {
            alert('❌ Por favor ingresa un título y un precio válido.');
            return;
        }

        console.log('Enviando datos al servidor:', { title, price });

        const response = await fetch('/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, price, description: "Test", thumbnail: "test.jpg", code: "123", stock: 10 })
        });

        console.log('Respuesta del servidor:', response);

        if (response.ok) {
            titleInput.value = '';
            priceInput.value = '';

            // Emitir evento para actualizar la lista en tiempo real
            socket.emit('newProduct');
        } else {
            alert('❌ Error al agregar el producto.');
        }
    });
});
