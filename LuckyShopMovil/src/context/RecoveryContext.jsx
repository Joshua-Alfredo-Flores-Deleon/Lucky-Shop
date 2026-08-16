/**
 * RecoveryContext.jsx
 * Contexto acotado al flujo de recuperación de contraseña. Crea UNA sola
 * instancia del hook useRecoveryPassword y la comparte entre las tres pantallas
 * del flujo (correo -> PIN -> nueva contraseña), de modo que el token temporal y
 * el correo de destino se conserven al navegar entre ellas.
 */
import { createContext, useContext } from "react";
import useRecoveryPassword from "../hooks/useRecoveryPassword";

const RecoveryContext = createContext(null);

export const RecoveryProvider = ({ children }) => {
  const recovery = useRecoveryPassword();
  return <RecoveryContext.Provider value={recovery}>{children}</RecoveryContext.Provider>;
};

export const useRecoveryContext = () => {
  const ctx = useContext(RecoveryContext);
  if (!ctx) throw new Error("useRecoveryContext debe usarse dentro de <RecoveryProvider>");
  return ctx;
};

export default RecoveryContext;
