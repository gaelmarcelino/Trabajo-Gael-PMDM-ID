
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const original = path.join(__dirname, '..', 'db.original.json');
const destino = path.join(__dirname, '..', 'db.json');

// Leer la base de datos original
const datos = JSON.parse(fs.readFileSync(original, 'utf8'));

// Crear solicitudes vacías
datos.solicitudes = [];

// Guardar la base de datos de trabajo
fs.writeFileSync(destino, JSON.stringify(datos, null, 2), 'utf8');

console.log('Base de datos restaurada correctamente.');
