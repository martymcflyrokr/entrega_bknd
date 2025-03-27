const express = require('express');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const path = require('path');
const http = require('http');
const connectDB = require('./config/db.config');

const ProductManager = require('./models/ProductManager');
const CartManager = require('./models/CartManager');

const app = express();
const server = http.createServer(app); // Servidor HTTP para socket.io
const io = new Server(server); // Instancia de WebSockets

const productManager = new ProductManager();
const cartManager = new CartManager();

// Conectar a MongoDB
connectDB();

// Configuración de Handlebars
app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Pasar `io` a las rutas
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Rutas de la API
const productRoutes = require('./routes/products.routes');
const cartRoutes = require('./routes/carts.routes');
app.use('/api/products', productRoutes(productManager));
app.use('/api/carts', cartRoutes(cartManager));

// Rutas de las vistas
const viewsRouter = require('./routes/views.routes')(io, productManager, cartManager);
app.use('/', viewsRouter);

const PORT = 3000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// WebSockets
io.on('connection', async (socket) => {
    console.log('🟢 Nuevo cliente conectado');

    socket.emit('updateProducts', await productManager.getProducts());

    socket.on('addProduct', async (productData) => {
        await productManager.addProduct(productData);
        io.emit('updateProducts', await productManager.getProducts());
    });

    socket.on('deleteProduct', async (productId) => {
        await productManager.deleteProduct(productId);
        io.emit('updateProducts', await productManager.getProducts());
    });

    socket.on('disconnect', () => {
        console.log('🔴 Cliente desconectado');
    });
});
