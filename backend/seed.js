const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');

const INITIAL_DATA = {
  categories: [
    { id: 'Todos', name: 'Todo el Catálogo', icon: 'LayoutGrid', bgImage: 'https://images.unsplash.com/photo-1616565431604-bb7a82bce30b?auto=format&fit=crop&q=80' },
    { id: 'Monedas', name: 'Tokens y Monedas', icon: 'Coins', bgImage: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80' },
    { id: 'Juegos', name: 'Juegos Digitales', icon: 'Gamepad2', bgImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80' },
    { id: 'Tarjetas', name: 'Tarjetas de Regalo', icon: 'CreditCard', bgImage: 'https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&q=80' },
    { id: 'Pases', name: 'Pases de Batalla', icon: 'Ticket', bgImage: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80' }
  ],
  products: [
    { id: 'prod-1', name: "13,500 V-Bucks", category: "Monedas", price: 79.99, image: "https://i.postimg.cc/QMpKFnSj/v-bucks-Photoroom.png", rating: 5.0, tag: "Más Vendido", bg: "from-blue-600 to-indigo-900" },
    { id: 'prod-2', name: "Pase de Batalla Premium", category: "Pases", price: 9.99, image: "https://i.postimg.cc/PrR9PXXM/fortnite-battle-pass.png", rating: 4.8, tag: "Temporada 5", bg: "from-purple-600 to-fuchsia-900" },
    { id: 'prod-3', name: "Tarjeta Steam $50", category: "Tarjetas", price: 49.99, image: "https://i.postimg.cc/85zK2xPj/steam-card.png", rating: 4.9, tag: "Instantánea", bg: "from-gray-700 to-gray-900" },
    { id: 'prod-4', name: "Elden Ring - PC Key", category: "Juegos", price: 39.99, image: "https://i.postimg.cc/WbT5Pz8g/elden-ring.png", rating: 5.0, tag: "-33% Oferta", bg: "from-amber-700 to-orange-950" },
    { id: 'prod-5', name: "2,800 Puntos FC", category: "Monedas", price: 24.99, image: "https://i.postimg.cc/44rGvQzF/fc-points.png", rating: 4.7, tag: "", bg: "from-emerald-600 to-teal-900" },
    { id: 'prod-6', name: "Xbox Game Pass Ultimate", category: "Tarjetas", price: 29.99, image: "https://i.postimg.cc/8P6Lz3yQ/game-pass.png", rating: 4.9, tag: "Popular", bg: "from-green-600 to-emerald-900" },
    { id: 'prod-7', name: "Cyberpunk 2077 - Key", category: "Juegos", price: 29.99, image: "https://i.postimg.cc/j5GfR5rW/cyberpunk.png", rating: 4.6, tag: "", bg: "from-yellow-500 to-red-900" },
    { id: 'prod-8', name: "10,000 Monedas Apex", category: "Monedas", price: 89.99, image: "https://i.postimg.cc/k47vP58L/apex-coins.png", rating: 4.8, tag: "Bonus +1500", bg: "from-red-600 to-red-950" },
    { id: 'prod-9', name: "5,000 V-Bucks", category: "Monedas", price: 31.99, image: "https://i.postimg.cc/QMpKFnSj/v-bucks-Photoroom.png", rating: 4.9, tag: "Ahorro", bg: "from-blue-500 to-cyan-900" },
    { id: 'prod-10', name: "Minecraft Java & Bedrock", category: "Juegos", price: 29.99, image: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&q=80", rating: 4.9, tag: "Top Ventas", bg: "from-green-700 to-green-950" },
    { id: 'prod-11', name: "Discord Nitro (1 Mes)", category: "Tarjetas", price: 9.99, image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&q=80", rating: 4.7, tag: "", bg: "from-indigo-600 to-indigo-950" },
    { id: 'prod-12', name: "Club de Fortnite", category: "Pases", price: 11.99, image: "https://i.postimg.cc/PrR9PXXM/fortnite-battle-pass.png", rating: 4.8, tag: "Suscripción", bg: "from-pink-600 to-rose-950" }
  ],
  currencies: [
    { id: 'cur-1', name: 'USD', symbol: '$', rateToDolar: 1 },
    { id: 'cur-2', name: 'COP', symbol: '$', rateToDolar: 3800 },
    { id: 'cur-3', name: 'EUR', symbol: '€', rateToDolar: 0.92 },
    { id: 'cur-4', name: 'MXN', symbol: '$', rateToDolar: 16.50 },
    { id: 'cur-5', name: 'ARS', symbol: '$', rateToDolar: 860.00 }
  ]
};

fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2));

console.log('✅ Base de datos (db.json) sembrada exitosamente con productos, categorías ilustradas y múltiples divisas.');
