# 💰 Control de Gastos Pro - Android PWA

¡Bienvenido a tu gestor de finanzas personal! Esta es una aplicación web progresiva (PWA) diseñada específicamente para ofrecer una experiencia fluida, rápida y estética en dispositivos móviles Android.

## 🚀 Características Principales

- **Gestión 360°**: Controla tus **Ingresos**, **Gastos** y **Ahorros** de forma independiente.
- **Selector de Fecha "Infinite Wheel"**: Experiencia nativa al elegir fechas deslizando hacia arriba/abajo.
- **Categorización Inteligente**: Elige entre categorías predefinidas o crea las tuyas propias con la opción "Otro".
- **Dashboard Estadístico**:
  - Gráfico Circular de gastos por categoría.
  - Comparativa de barras entre Ingresos vs Gastos.
- **Offline First**: Gracias al Service Worker incorporado, la app funciona incluso sin conexión a internet.
- **Privacidad Total**: Tus datos nunca salen de tu dispositivo; se almacenan de forma segura en `localStorage`.

## 📱 Instalación en Android (Recomendado)

Para disfrutar de la experiencia completa como una aplicación instalada:

1. Abre el enlace de la aplicación en **Google Chrome para Android**.
2. Toca el menú de tres puntos (⋮) arriba a la derecha.
3. Selecciona **"Instalar aplicación"** o **"Agregar a la pantalla de inicio"**.
4. ¡Listo! Tendrás el icono en tu menú de aplicaciones y se abrirá a pantalla completa sin la barra del navegador.

## 🛠️ Tecnologías Utilizadas

- **HTML5 & CSS3**: Diseño responsive con variables CSS y animaciones fluidas.
- **Vanilla JavaScript**: Lógica de estado pura, sin frameworks pesados.
- **Chart.js**: Visualización de datos profesional.
- **Lucide Icons**: Iconografía moderna y minimalista.
- **Web App Manifest**: Para la integración nativa con Android.

## 📂 Estructura del Proyecto

```bash
├── index.html       # Estructura principal de la PWA
├── styles.css       # Diseño y animaciones premium
├── app.js           # Lógica, gestión de datos y gráficos
├── manifest.json    # Configuración de instalación en móvil
├── sw.js            # Soporte offline (Service Worker)
└── gastos_movil.html # Versión "Todo en uno" para compartir fácil
```

---
Creado con ❤️ para una gestión financiera más inteligente.
