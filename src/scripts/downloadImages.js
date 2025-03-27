const fs = require('fs');
const path = require('path');
const https = require('https');

const categories = ['electronics', 'computers', 'accessories', 'gaming', 'audio'];
const imageUrls = {
    electronics: [
        'https://images.unsplash.com/photo-1498049794561-7780e7231661',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c'
    ],
    computers: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8'
    ],
    accessories: [
        'https://images.unsplash.com/photo-1527814050087-3793815479db',
        'https://images.unsplash.com/photo-1527814050087-3793815479db',
        'https://images.unsplash.com/photo-1527814050087-3793815479db',
        'https://images.unsplash.com/photo-1527814050087-3793815479db'
    ],
    gaming: [
        'https://images.unsplash.com/photo-1542751371-adc38448a05e',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e'
    ],
    audio: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'
    ]
};

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                response.resume();
                reject(new Error(`Request Failed With a Status Code: ${response.statusCode}`));
            }
        });
    });
};

const downloadImages = async () => {
    try {
        // Crear directorio de imágenes si no existe
        const imgDir = path.join(__dirname, '../public/img');
        if (!fs.existsSync(imgDir)) {
            fs.mkdirSync(imgDir, { recursive: true });
        }

        // Descargar imágenes para cada categoría
        for (const category of categories) {
            const urls = imageUrls[category];
            for (let i = 0; i < 4; i++) {
                const filepath = path.join(imgDir, `${category}-${i + 1}.jpg`);
                await downloadImage(urls[i], filepath);
                console.log(`✅ Imagen descargada: ${category}-${i + 1}.jpg`);
            }
        }

        console.log('✅ Todas las imágenes descargadas exitosamente');
    } catch (error) {
        console.error('❌ Error al descargar imágenes:', error);
    }
};

downloadImages(); 