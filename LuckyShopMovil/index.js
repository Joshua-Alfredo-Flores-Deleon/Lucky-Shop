import { registerRootComponent } from "expo";
import App from "./App";

// registerRootComponent registra el componente raíz de la aplicación.
// Garantiza que el entorno se configure correctamente tanto en Expo Go
// como en una build nativa.
registerRootComponent(App);
