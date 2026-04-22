const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');

// --- CONFIGURACIÓN ---
const NEW_USER = 'monedasjuegos';
const NEW_PASS = 'leomessi10!';
// ---------------------

if (!fs.existsSync(DB_FILE)) {
  console.error('Error: No se encontró el archivo db.json en ' + DB_FILE);
  process.exit(1);
}

try {
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  
  if (!db.admin) {
    db.admin = {};
  }
  
  db.admin.user = NEW_USER;
  db.admin.pass = NEW_PASS;
  
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  
  console.log('-----------------------------------------');
  console.log('✅ Credenciales actualizadas con éxito');
  console.log('-----------------------------------------');
  console.log('Usuario: ' + NEW_USER);
  console.log('Password: ' + NEW_PASS);
  console.log('-----------------------------------------');
  console.log('Recuerda reiniciar el servidor (pm2 restart) para aplicar los cambios.');

} catch (error) {
  console.error('Error al procesar db.json:', error);
}
