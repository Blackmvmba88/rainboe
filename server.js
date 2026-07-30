const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Path to local JSON database for presets
const DATA_DIR = path.join(__dirname, 'data');
const PRESETS_FILE = path.join(DATA_DIR, 'presets.json');

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(PRESETS_FILE)) {
  const initialPresets = {
    "Original BM-FX": { speed: 0.55, lampAngle: 0, gap1Offset: 0, gap2Offset: 0, gaps: 0.16, diffraction: 1.05, bloom: 1.2, dispersion: 0.075, scale: 1, sensitivity: 1.8 },
    "Aro Máximo 9:49": { speed: 2.5, lampAngle: 0, gap1Offset: 0, gap2Offset: 0, gaps: 0.42, diffraction: 2, bloom: 2.4, dispersion: 0.2, scale: 1, sensitivity: 2.35 },
    "Mi configuración permanente": { speed: 2.5, lampAngle: 180, gap1Offset: 180, gap2Offset: 180, gaps: 0.42, diffraction: 2, bloom: 2.4, dispersion: 0.2, scale: 1, sensitivity: 4 }
  };
  fs.writeFileSync(PRESETS_FILE, JSON.stringify(initialPresets, null, 2));
}

// Serve WebGL app static files
// Check if www exists (Capacitor folder), otherwise serve root
const webDir = fs.existsSync(path.join(__dirname, 'www')) 
  ? path.join(__dirname, 'www') 
  : __dirname;

app.use(express.static(webDir));

// API Endpoints
// Get all presets
app.get('/api/presets', (req, res) => {
  try {
    const data = fs.readFileSync(PRESETS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron leer los presets' });
  }
});

// Save or update a preset
app.post('/api/presets', (req, res) => {
  const { name, config } = req.body;
  if (!name || !config) {
    return res.status(400).json({ error: 'Nombre y configuración requeridos' });
  }

  try {
    const data = fs.readFileSync(PRESETS_FILE, 'utf8');
    const presets = JSON.parse(data);
    presets[name] = config;
    
    fs.writeFileSync(PRESETS_FILE, JSON.stringify(presets, null, 2));
    res.json({ message: 'Preset guardado exitosamente', presets });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo guardar el preset' });
  }
});

// Delete a preset
app.delete('/api/presets/:name', (req, res) => {
  const name = req.params.name;
  try {
    const data = fs.readFileSync(PRESETS_FILE, 'utf8');
    const presets = JSON.parse(data);
    
    if (!presets[name]) {
      return res.status(404).json({ error: 'Preset no encontrado' });
    }
    
    delete presets[name];
    fs.writeFileSync(PRESETS_FILE, JSON.stringify(presets, null, 2));
    res.json({ message: 'Preset eliminado exitosamente', presets });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo eliminar el preset' });
  }
});

// Fallback to index.html for SPA router (if any)
app.get('*', (req, res) => {
  res.sendFile(path.join(webDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor de Spectral Halo corriendo en http://localhost:${PORT}`);
});
