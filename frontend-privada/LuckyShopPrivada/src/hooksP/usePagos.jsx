import { useState, useEffect, useMemo, useCallback } from "react";

const BASE_URL = "http://localhost:4000/api";

function iniciales(nombre = "") {
  return nombre
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Normaliza una venta del backend a la forma que usa la UI de Pagos.
// Ajusta los nombres de campo de la izquierda (ej. venta.cliente) si tu API usa otros.
function normalizarVenta(venta) {
  return {
    id: venta._id ?? venta.id,
    cliente: venta.cliente ?? venta.nombreCliente ?? "Cliente",
    monto: Number(venta.monto ?? venta.total ?? 0),
    metodo: venta.metodo ?? venta.metodoPago ?? "Transferencia",
    fecha: venta.fecha ?? venta.createdAt,
    producto: venta.producto ?? venta.nombreProducto ?? "—",
    detalleProducto: venta.detalleProducto ?? venta.descripcion ?? "",
    estado: venta.estado ?? "Completado",
  };
}
