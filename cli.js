#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const command = args[0];

const JAVA_HOME = "/Applications/Android Studio.app/Contents/jbr/Contents/Home";
const ANDROID_SDK_ROOT = "/Users/blackmambarecords/Library/Android/sdk";
const env = {
  ...process.env,
  JAVA_HOME,
  ANDROID_SDK_ROOT,
  PATH: `${JAVA_HOME}/bin:${process.env.PATH}`
};

function printHelp() {
  console.log(`
\x1b[35m=== CLI de Control de Spectral Halo (BM-FX-001) ===\x1b[0m
Uso: npx bm-fx <comando>

Comandos disponibles:
  \x1b[32mstart\x1b[0m           Inicia el servidor local Express (sirve la web y la API)
  \x1b[32mbuild\x1b[0m           Copia index.html a 'www/' y sincroniza Capacitor
  \x1b[32mandroid:build\x1b[0m   Compila la aplicación nativa y genera el APK de depuración
  \x1b[32mandroid:run\x1b[0m     Despliega y ejecuta la aplicación de Android en un dispositivo conectado
  \x1b[32mhelp\x1b[0m            Muestra esta ayuda
`);
}

function runServer() {
  console.log('\x1b[36mIniciando servidor local de desarrollo...\x1b[0m');
  const serverPath = path.join(__dirname, 'server.js');
  const server = spawn('node', [serverPath], { stdio: 'inherit', env });

  server.on('close', (code) => {
    console.log(`El servidor finalizó con código ${code}`);
  });
}

function buildWeb() {
  console.log('\x1b[36mPreparando distribución web...\x1b[0m');
  
  // Create www if not exists
  if (!fs.existsSync(path.join(__dirname, 'www'))) {
    fs.mkdirSync(path.join(__dirname, 'www'));
  }
  
  // Copy static files
  fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(__dirname, 'www', 'index.html'));
  if (fs.existsSync(path.join(__dirname, 'README.txt'))) {
    fs.copyFileSync(path.join(__dirname, 'README.txt'), path.join(__dirname, 'www', 'README.txt'));
  }
  
  console.log('\x1b[32mArchivos web copiados exitosamente a www/.\x1b[0m');
  
  console.log('\x1b[36mSincronizando Capacitor con Android...\x1b[0m');
  try {
    execSync('npx cap sync android', { stdio: 'inherit', env });
    console.log('\x1b[32mSincronización de Capacitor completada.\x1b[0m');
  } catch (err) {
    console.error('\x1b[31mError al ejecutar npx cap sync:\x1b[0m', err.message);
  }
}

function buildAndroid() {
  buildWeb();
  console.log('\x1b[36mCompilando proyecto Android usando Gradle...\x1b[0m');
  const gradlewPath = path.join(__dirname, 'android', 'gradlew');
  
  try {
    execSync(`"${gradlewPath}" assembleDebug`, { 
      stdio: 'inherit', 
      cwd: path.join(__dirname, 'android'),
      env 
    });
    console.log('\x1b[32m¡Compilación exitosa!\x1b[0m');
    const apkPath = path.join(__dirname, 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
    if (fs.existsSync(apkPath)) {
      console.log(`\x1b[36mEl APK generado se encuentra en:\x1b[0m ${apkPath}`);
    }
  } catch (err) {
    console.error('\x1b[31mError durante la compilación de Android Gradle:\x1b[0m', err.message);
  }
}

function runAndroid() {
  buildWeb();
  console.log('\x1b[36mDesplegando la aplicación en el dispositivo o emulador de Android conectado...\x1b[0m');
  try {
    execSync('npx cap run android', { stdio: 'inherit', env });
  } catch (err) {
    console.error('\x1b[31mError al desplegar la aplicación en Android:\x1b[0m', err.message);
  }
}

// Command dispatcher
switch (command) {
  case 'start':
    runServer();
    break;
  case 'build':
    buildWeb();
    break;
  case 'android:build':
    buildAndroid();
    break;
  case 'android:run':
    runAndroid();
    break;
  case 'help':
  case '-h':
  case '--help':
  default:
    printHelp();
    if (command && command !== 'help') {
      console.error(`\x1b[31mComando desconocido: "${command}"\x1b[0m`);
      process.exit(1);
    }
}
