# LuckyShop — Aplicación Móvil 📱🍀

Aplicación móvil de **LuckyShop** (tienda de joyería y accesorios) desarrollada en
**React Native con Expo**. Consume la **misma API y la misma base de datos** que la
aplicación web del proyecto.

---

## 1. Tecnologías y dependencias

| Dependencia | Para qué se usa |
|---|---|
| `expo` | Framework que facilita el desarrollo y ejecución de la app. |
| `react` / `react-native` | Base para construir la interfaz nativa. |
| `expo-status-bar` | Control de la barra de estado. |
| `expo-splash-screen` | Splash Screen nativo (pantalla de carga con el logo). |
| `@react-navigation/native` | Núcleo de navegación entre pantallas. |
| `@react-navigation/native-stack` | Navegación tipo pila (login, registro, recuperación). |
| `@react-navigation/bottom-tabs` | Menú de pestañas inferior (Inicio, Categorías, Carrito, Perfil). |
| `react-native-screens` / `react-native-safe-area-context` | Requeridas por React Navigation; optimización y áreas seguras. |
| `@react-native-async-storage/async-storage` | Guardar el token de sesión de forma persistente. |

> No se usa **Axios**: todas las peticiones HTTP se hacen con la **Fetch API nativa**
> de JavaScript, que ya viene incluida en React Native y cubre todas las necesidades
> del proyecto (GET/POST/PUT, headers, JSON), evitando una dependencia extra.

---

## 2. Cómo ejecutar la aplicación

```bash
# 1) Instalar dependencias
npm install

# 2) Iniciar el servidor de desarrollo de Expo
npm start
# (o: npm run android  |  npm run ios  |  npm run web)
```

Luego se escanea el QR con la app **Expo Go** (Android/iOS) o se abre en un emulador.

### ⚠️ Configurar la URL del backend (¡importante!)

La app necesita saber dónde está el backend. Esto se configura en **UN solo archivo**:
`src/api/apiConfig.js` → constante `API_BASE_URL`.

| Dónde pruebas | Valor de `API_BASE_URL` |
|---|---|
| Emulador Android | `http://10.0.2.2:4000/api` |
| Navegador / Expo web | `http://localhost:4000/api` |
| Teléfono físico (Expo Go) | `http://<IP-LOCAL-DE-TU-PC>:4000/api` |
| Backend desplegado (Render) | `https://tu-backend.onrender.com/api` |

Para el teléfono físico, la PC y el teléfono deben estar en la **misma red WiFi**.
Obtén tu IP con `ipconfig` (Windows) o `ifconfig` / `ip a` (Linux/Mac).

---

## 3. Nomenclaturas usadas

- **Archivos de componentes y pantallas:** `PascalCase` con extensión `.jsx`
  (ej. `LoginScreen.jsx`, `CustomButton.jsx`).
- **Archivos de hooks, utilidades y configuración:** `camelCase` con extensión `.js`
  (ej. `useProductos.js`, `apiConfig.js`, `storage.js`).
- **Variables y funciones:** `camelCase` y en español, con nombres descriptivos
  (ej. `iniciarSesion`, `obtenerProductos`, `cargandoSesion`).
- **Componentes de React:** `PascalCase` (ej. `ProductCard`, `AlertModal`).
- **Constantes de configuración:** `UPPER_SNAKE_CASE` (ej. `API_BASE_URL`).

> Esta misma convención (PascalCase para componentes/pantallas, camelCase para
> hooks/lógica) es la que se aplica también en el frontend web del proyecto.

---

## 4. Estructura de carpetas

El archivo `App.js` se mantiene con la **mínima cantidad de código posible**: solo
monta los proveedores globales y el navegador raíz. Todo lo demás está organizado
por responsabilidad:

```
LuckyShopMovil/
├── App.js                  # Punto de entrada (splash + providers + navegación)
├── index.js                # Registro del componente raíz
├── app.json                # Config de Expo (nombre, icono, splash personalizado)
├── assets/                 # Icono, splash y favicon de la app
└── src/
    ├── api/
    │   ├── apiConfig.js     # URL base y endpoints (ÚNICO lugar a configurar)
    │   └── apiClient.js     # Envoltura de fetch que adjunta el token Bearer
    ├── context/
    │   ├── AuthContext.jsx  # Estado global de sesión (useContext)
    │   └── RecoveryContext.jsx # Estado compartido del flujo de recuperación
    ├── hooks/               # Lógica de las pantallas (custom hooks)
    │   ├── useLogin.js
    │   ├── useRegister.js
    │   ├── useRecoveryPassword.js
    │   ├── useProductos.js
    │   ├── useBolsas.js
    │   └── useNotificacion.js
    ├── components/          # Componentes reutilizables
    │   ├── Logo.jsx
    │   ├── CustomInput.jsx
    │   ├── CustomButton.jsx
    │   ├── ProductCard.jsx
    │   ├── CategoryChip.jsx
    │   ├── Notificacion.jsx   # Toast/banner de avisos
    │   ├── AlertModal.jsx     # Modal de confirmación / éxito
    │   ├── SocialButton.jsx
    │   ├── PinInput.jsx
    │   └── Loader.jsx
    ├── navigation/
    │   ├── AppNavigator.jsx   # Raíz: decide auth vs app
    │   ├── AuthNavigator.jsx  # Stack: login, registro, recuperación
    │   └── TabNavigator.jsx   # Tab menu: Inicio, Categorías, Carrito, Perfil
    ├── screens/
    │   ├── CustomLoadingScreen.jsx   # Pantalla de carga personalizada
    │   ├── auth/
    │   │   ├── LoginScreen.jsx
    │   │   ├── RegisterScreen.jsx
    │   │   ├── RecoveryEmailScreen.jsx
    │   │   ├── RecoveryPinScreen.jsx
    │   │   ├── RecoveryNewPasswordScreen.jsx
    │   │   └── RecoverySuccessScreen.jsx
    │   └── app/
    │       ├── HomeScreen.jsx
    │       ├── CategoriasScreen.jsx
    │       ├── CarritoScreen.jsx
    │       └── PerfilScreen.jsx
    ├── theme/
    │   └── colors.js         # Paleta de la marca (extraída del Figma)
    └── utils/
        ├── storage.js        # Helpers de AsyncStorage (token/usuario)
        └── categorias.js     # Catálogo de categorías (label -> slug de la BD)
```

---

## 5. Pantallas incluidas en este avance (80%)

1. Pantalla de carga personalizada (previa al login)
2. Inicio de sesión (Login) — **funcional**
3. Registro (con verificación por código de correo)
4. Recuperación de contraseña — correo
5. Recuperación de contraseña — PIN de verificación
6. Recuperación de contraseña — nueva contraseña
7. Recuperación de contraseña — éxito
8. Home (con **nombre real** del usuario logueado y datos reales)
9. Categorías (productos reales filtrados por categoría)
10. Carrito
11. Perfil (datos reales + cerrar sesión)

Los datos de productos, bolsas de la suerte y perfil provienen de la **misma base
de datos** que la app web (endpoints `/api/productos`, `/api/bolsas`,
`/api/perfilCliente`).

---

## 6. Notas de arquitectura

- **Autenticación:** el backend originalmente entrega el JWT en una *cookie*
  (pensado para la web). Como React Native no maneja cookies de forma confiable,
  la app móvil recibe el token en el **cuerpo** de la respuesta del login, lo
  guarda con AsyncStorage y lo envía en el header **`Authorization: Bearer`**.
  Esto requirió un **parche mínimo y aditivo** en el backend (ver la carpeta
  `backend-cambios/` y su `LEEME-PARCHE.md`). La app web **no se ve afectada**.
- **useContext:** `AuthContext` mantiene el cliente, el token y el estado de carga
  de sesión a nivel global.
- **Custom hooks:** toda la lógica de red y de formularios vive en hooks
  (`useLogin`, `useRegister`, `useProductos`, etc.), dejando las pantallas
  enfocadas solo en la interfaz.
- **Notificaciones:** se usan un banner tipo *toast* (`Notificacion`) y un *modal*
  (`AlertModal`) para confirmar acciones e informar errores.
