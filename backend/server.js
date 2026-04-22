const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const upload = multer({ dest: path.join(__dirname, 'uploads/') });

const PORT = 5000;
const SECRET_KEY = 'monedas_secret_admin_key_2026';
const DB_FILE = path.join(__dirname, 'db.json');

// Hardcoded Admin Credentials
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

// Simple JSON DB Implementation
const initDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({
      categories: [
        { id: 'cat-1', name: 'Monedas' },
        { id: 'cat-2', name: 'Juegos' },
        { id: 'cat-3', name: 'Tarjetas' },
        { id: 'cat-4', name: 'Pases' }
      ],
      products: [],
      currencies: [
        { id: 'cur-1', name: 'USD', symbol: '$', rateToDolar: 1 },
        { id: 'cur-2', name: 'COP', symbol: '$', rateToDolar: 3800 },
        { id: 'cur-3', name: 'EUR', symbol: '€', rateToDolar: 0.92 }
      ],
      users: [],
      faqs: [],
      testimonials: [],
      settings: { 
        vbucksRateInUsd: 0.25,
        vbucksOverrides: {},
        heroTitle: 'Domina el Campo de Juego con MonedasJuegos',
        heroSubtitle: 'La plataforma líder para potenciar tu experiencia en Fortnite. Créditos, skins y pavos al mejor precio del mercado.',
        heroStats: [
          { label: 'Usuarios Activos', value: '50k+' },
          { label: 'Transacciones Seguras', value: '100k+' },
          { label: 'Tiempo de Entrega', value: '5min' },
          { label: 'Stock Disponible', value: '1M+' }
        ],
        featuresTitle: '¿Por qué elegirnos?',
        features: [
          { title: 'Diseñado para el Rendimiento', desc: 'Nuestra plataforma está optimizada para que tus recargas sean instantáneas.' },
          { title: 'Seguridad de Grado Militar', desc: 'Tus datos y transacciones están protegidos por encriptación de última generación.' },
          { title: 'Soporte 24/7', desc: 'Un equipo de expertos siempre listo para ayudarte en lo que necesites.' }
        ],
        footerDesc: 'Tu socio de confianza para elevar tu nivel de juego. La mejor calidad y seguridad en cada transacción.',
        catalogDesc: 'Explora nuestra inmensa selección de créditos virtuales, juegos y tarjetas. Selecciona una categoría para empezar.',
        ctaTitle: '¿Listo para subir de nivel?',
        ctaSubtitle: 'Únete a miles de jugadores que ya confían en nosotros.'
      }
    }, null, 2));
  } else {
    // Asegurarse de que exista el array users y settings en una db existente
    const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    let updated = false;
    if (!db.users) {
      db.users = [];
      updated = true;
    }
    if (!db.settings) {
      db.settings = { 
        vbucksRateInUsd: 0.25,
        vbucksOverrides: {},
        heroTitle: 'Domina el Campo de Juego con MonedasJuegos',
        heroSubtitle: 'La plataforma líder para potenciar tu experiencia en Fortnite. Créditos, skins y pavos al mejor precio del mercado.',
        heroStats: [
          { label: 'Usuarios Activos', value: '50k+' },
          { label: 'Transacciones Seguras', value: '100k+' },
          { label: 'Tiempo de Entrega', value: '5min' },
          { label: 'Stock Disponible', value: '1M+' }
        ],
        featuresTitle: '¿Por qué elegirnos?',
        features: [
          { title: 'Diseñado para el Rendimiento', desc: 'Nuestra plataforma está optimizada para que tus recargas sean instantáneas.' },
          { title: 'Seguridad de Grado Militar', desc: 'Tus datos y transacciones están protegidos por encriptación de última generación.' },
          { title: 'Soporte 24/7', desc: 'Un equipo de expertos siempre listo para ayudarte en lo que necesites.' }
        ],
        footerDesc: 'Tu socio de confianza para elevar tu nivel de juego. La mejor calidad y seguridad en cada transacción.',
        catalogDesc: 'Explora nuestra inmensa selección de créditos virtuales, juegos y tarjetas. Selecciona una categoría para empezar.',
        ctaTitle: '¿Listo para subir de nivel?',
        ctaSubtitle: 'Únete a miles de jugadores que ya confían en nosotros.'
      };
      updated = true;
    } else {
      // Ensure all specific fields exist
      const defaultSettings = {
        heroTitle: 'Domina el Campo de Juego con MonedasJuegos',
        heroSubtitle: 'La plataforma líder para potenciar tu experiencia en Fortnite. Créditos, skins y pavos al mejor precio del mercado.',
        heroStats: [
          { label: 'Usuarios Activos', value: '50k+' },
          { label: 'Transacciones Seguras', value: '100k+' },
          { label: 'Tiempo de Entrega', value: '5min' },
          { label: 'Stock Disponible', value: '1M+' }
        ],
        featuresTitle: '¿Por qué elegirnos?',
        features: [
          { title: 'Diseñado para el Rendimiento', desc: 'Nuestra plataforma está optimizada para que tus recargas sean instantáneas.' },
          { title: 'Seguridad de Grado Militar', desc: 'Tus datos y transacciones están protegidos por encriptación de última generación.' },
          { title: 'Soporte 24/7', desc: 'Un equipo de expertos siempre listo para ayudarte en lo que necesites.' }
        ],
        footerDesc: 'Tu socio de confianza para elevar tu nivel de juego. La mejor calidad y seguridad en cada transacción.',
        catalogDesc: 'Explora nuestra inmensa selección de créditos virtuales, juegos y tarjetas. Selecciona una categoría para empezar.',
        ctaTitle: '¿Listo para subir de nivel?',
        ctaSubtitle: 'Únete a miles de jugadores que ya confían en nosotros.',
        vbucksOverrides: {}
      };
      Object.keys(defaultSettings).forEach(key => {
        if (db.settings[key] === undefined) {
          db.settings[key] = defaultSettings[key];
          updated = true;
        }
      });
    }
    if (!db.faqs) {
      db.faqs = [];
      updated = true;
    }
    if (!db.testimonials) {
      db.testimonials = [];
      updated = true;
    }
    if(updated) {
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    }
  }
};
initDB();

const readDB = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// Auth Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'Token requerido' });
  try {
    jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// ---------------
// AUTH ENDPOINTS
// ---------------
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ user: username, role: 'admin' }, SECRET_KEY, { expiresIn: '24h' });
    return res.json({ token, role: 'admin' });
  }
  return res.status(401).json({ error: 'Credenciales de administrador incorrectas' });
});

// User Auth Endpoints
app.post('/api/user/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  
  const db = readDB();
  const exists = db.users.find(u => u.email === email);
  if (exists) return res.status(400).json({ error: 'El correo ya está registrado' });
  
  const newUser = { id: `usr-${Date.now()}`, name, email, password };
  db.users.push(newUser);
  writeDB(db);
  
  const token = jwt.sign({ id: newUser.id, email: newUser.email, role: 'user' }, SECRET_KEY, { expiresIn: '7d' });
  res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
});

app.post('/api/user/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.email === email && u.password === password);
  
  if (!user) return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
  
  const token = jwt.sign({ id: user.id, email: user.email, role: 'user' }, SECRET_KEY, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// ---------------
// GET ENDPOINTS (Public)
// ---------------
app.get('/api/categories', (req, res) => res.json(readDB().categories));
app.get('/api/products', (req, res) => res.json(readDB().products));
app.get('/api/currencies', (req, res) => res.json(readDB().currencies));
app.get('/api/faqs', (req, res) => res.json(readDB().faqs || []));
app.get('/api/testimonials', (req, res) => res.json(readDB().testimonials || []));
app.get('/api/settings', (req, res) => res.json(readDB().settings || { vbucksRateInUsd: 0.25 }));

// ---------------
// ADMIN ENDPOINTS (Protected)
// ---------------

// File Upload endpoint for both Products and Categories
app.post('/api/upload', verifyToken, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se envió ningún archivo' });
  
  // Construir la URL dinámicamente según el host que hace la petición
  // Esto permite que funcione tanto en localhost como en el túnel de Cloudflare
  const protocol = req.protocol;
  const host = req.get('host');
  const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
  
  res.json({ url: fileUrl });
});

// Categories
app.post('/api/categories', verifyToken, (req, res) => {
  const db = readDB();
  const newCat = { id: `cat-${Date.now()}`, ...req.body };
  db.categories.push(newCat);
  writeDB(db);
  res.json(newCat);
});
app.put('/api/categories/:id', verifyToken, (req, res) => {
  const db = readDB();
  const index = db.categories.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'No encontrado' });
  db.categories[index] = { ...db.categories[index], ...req.body };
  writeDB(db);
  res.json(db.categories[index]);
});
app.delete('/api/categories/:id', verifyToken, (req, res) => {
  const db = readDB();
  db.categories = db.categories.filter(c => c.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// Products
app.post('/api/products', verifyToken, (req, res) => {
  const db = readDB();
  const newProd = { id: `prod-${Date.now()}`, ...req.body };
  db.products.push(newProd);
  writeDB(db);
  res.json(newProd);
});
app.put('/api/products/:id', verifyToken, (req, res) => {
  const db = readDB();
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'No encontrado' });
  db.products[index] = { ...db.products[index], ...req.body };
  writeDB(db);
  res.json(db.products[index]);
});
app.delete('/api/products/:id', verifyToken, (req, res) => {
  const db = readDB();
  db.products = db.products.filter(p => p.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// Currencies
app.post('/api/currencies', verifyToken, (req, res) => {
  const db = readDB();
  const newCur = { id: `cur-${Date.now()}`, ...req.body };
  db.currencies.push(newCur);
  writeDB(db);
  res.json(newCur);
});
app.put('/api/currencies/:id', verifyToken, (req, res) => {
  const db = readDB();
  const index = db.currencies.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'No encontrado' });
  db.currencies[index] = { ...db.currencies[index], ...req.body };
  writeDB(db);
  res.json(db.currencies[index]);
});
app.delete('/api/currencies/:id', verifyToken, (req, res) => {
  const db = readDB();
  db.currencies = db.currencies.filter(c => c.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// Settings
app.put('/api/settings', verifyToken, (req, res) => {
  const db = readDB();
  db.settings = { ...(db.settings || {}), ...req.body };
  writeDB(db);
  res.json(db.settings);
});

// FAQs
app.post('/api/faqs', verifyToken, (req, res) => {
  const db = readDB();
  const newItem = { id: `faq-${Date.now()}`, ...req.body };
  db.faqs.push(newItem);
  writeDB(db);
  res.json(newItem);
});
app.put('/api/faqs/:id', verifyToken, (req, res) => {
  const db = readDB();
  const index = db.faqs.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'No encontrado' });
  db.faqs[index] = { ...db.faqs[index], ...req.body };
  writeDB(db);
  res.json(db.faqs[index]);
});
app.delete('/api/faqs/:id', verifyToken, (req, res) => {
  const db = readDB();
  db.faqs = db.faqs.filter(i => i.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// Testimonials
app.post('/api/testimonials', verifyToken, (req, res) => {
  const db = readDB();
  const newItem = { id: `test-${Date.now()}`, ...req.body };
  db.testimonials.push(newItem);
  writeDB(db);
  res.json(newItem);
});
app.put('/api/testimonials/:id', verifyToken, (req, res) => {
  const db = readDB();
  const index = db.testimonials.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'No encontrado' });
  db.testimonials[index] = { ...db.testimonials[index], ...req.body };
  writeDB(db);
  res.json(db.testimonials[index]);
});
app.delete('/api/testimonials/:id', verifyToken, (req, res) => {
  const db = readDB();
  db.testimonials = db.testimonials.filter(i => i.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend de Administración corriendo en http://localhost:${PORT}`);
});
