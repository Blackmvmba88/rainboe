# BM-FX-001 — Spectral Halo (v0.2 GLSL)

Visualizador de audio interactivo y reactivo de alto rendimiento implementado en WebGL (GLSL) y Web Audio API, empaquetado como aplicación nativa de Android con Capacitor y equipado con una CLI y una API Backend de sincronización en Node.js.

El núcleo visual es un anillo espectral holográfico de refracción de vidrio y difracción cromática angular reactivo a frecuencias bajas (graves) y altas (agudos) capturadas mediante micrófono o reproducción de SoundCloud.

---

## 🚀 Características Clave

* **Fragment Shader Premium:** Simulación de dispersión cromática angular ($RGB$), máscaras dinámicas de abertura (gaps) controladas por beat detection, anillo de cristal refractivo con destellos y línea de tiempo/progreso de reproducción mapeada polarmente en el propio halo.
* **Reactividad al Audio Híbrida:**
  * **Micrófono:** Captura y análisis de espectro en tiempo real con suavizado ajustable y sensibilidad configurable.
  * **SoundCloud:** Integración nativa del reproductor (modo independiente) y sincronización con pestañas externas mediante un Watchdog de comunicación por eventos (modo sincronizado).
* **Persistencia Inteligente de Presets:** Almacenamiento local híbrido. Guarda tus configuraciones personalizadas directamente en el disco duro del servidor (`data/presets.json`) si la API está en ejecución, con fallback automático offline a `localStorage` en el navegador o dispositivo móvil.
* **CLI de Control:** Comando de línea integrado para gestionar el ciclo de vida del servidor web y compilar para plataformas móviles.
* **Aplicación Móvil Nativa:** Configuración de Capacitor lista para compilar en Android con aceleración de hardware nativa (WebGL) y manejo de permisos del sistema de audio a nivel manifiesto.

---

## 🛠️ Requisitos Previos

Antes de ejecutar los comandos del proyecto, asegúrate de tener instalado:

1. [Node.js](https://nodejs.org/) (Versión 18 o superior).
2. [Android Studio](https://developer.android.com/studio) (Para compilar y emular en dispositivos Android).
3. Conexión de red local o depuración USB activada en tu celular si deseas probar directamente en hardware móvil.

---

## 💻 Uso de la CLI (`bm-fx`)

El proyecto incluye una CLI nativa que simplifica el desarrollo y compilación. Puedes usarla mediante los scripts de `npm` o ejecutándola directamente.

### Comandos disponibles:

#### 1. Iniciar servidor local
Levanta el servidor Express local en el puerto `3000` que sirve los archivos web y provee la API de sincronización.
```bash
npm run start
# o alternativamente:
npx bm-fx start
```
Abre tu navegador en `http://localhost:3000` para interactuar con la aplicación.

#### 2. Sincronizar y compilar código web
Genera el directorio de distribución y sincroniza los cambios de frontend con el código de Android nativo:
```bash
npm run build
# o alternativamente:
npx bm-fx build
```

#### 3. Compilar APK de Android (Gradle)
Compila el código nativo y empaqueta la aplicación generando un archivo APK autoinstalable:
```bash
npm run android:build
# o alternativamente:
npx bm-fx android:build
```
El APK resultante se almacenará en:
`android/app/build/outputs/apk/debug/app-debug.apk`

#### 4. Ejecutar en dispositivo Android conectado
Instala y ejecuta directamente la aplicación móvil en tu dispositivo o emulador activo:
```bash
npm run android:run
# o alternativamente:
npx bm-fx android:run
```

---

## 📂 Estructura del Proyecto

```
├── android/              # Carpeta de proyecto nativo de Android (Gradle + Java)
├── data/                 # Base de datos local JSON (presets.json)
├── www/                  # Directorio compilado para distribución estática web y móvil
├── cli.js                # Comando CLI ejecutable del proyecto
├── server.js             # API Express y servidor de estáticos
├── index.html            # Frontend, WebGL Canvas y lógica del reproductor
├── package.json          # Script del proyecto y dependencias de Capacitor
└── LICENSE               # Licencia MIT del proyecto
```

---

## 🔒 Permisos en Android

La aplicación móvil declara explícitamente en su manifiesto `AndroidManifest.xml` el uso del micrófono:
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
```
El WebView solicita automáticamente acceso al hardware de sonido la primera vez que el usuario presiona **"Activar micrófono"**.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Para más detalles, consulta el archivo [LICENSE](LICENSE).

---
*Desarrollado y mantenido profesionalmente por BlackMamba Records.*
