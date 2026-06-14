import productsModel from "../models/productos.js";
import { v2 as cloudinary } from "cloudinary";

const productosController = {};

//gET ALL
productosController.getProductos = async (req, res) => {
  try {
    const { categoria, estado, search } = req.query;
    const filter = {};

    if (categoria) filter.idCategoria = categoria;
    if (estado) filter.estado = estado;
    if (search) filter.nombre = { $regex: search, $options: "i" };

    const productos = await productsModel.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(productos);
  } catch (error) {
    console.error("getProductos error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//GET BY ID
productosController.getProductoById = async (req, res) => {
  try {
    const producto = await productsModel.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    return res.status(200).json(producto);
  } catch (error) {
    console.error("getProductoById error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//INSERT
productosController.insertProducto = async (req, res) => {
  try {
    let {
      nombre,
      precio,
      stock,
      descripcion,
      idCategoria,
      subCategoria,
      estado,
    } = req.body;

    // Validaciones
    nombre = nombre?.trim();
    if (!nombre || precio === undefined || stock === undefined) {
      return res
        .status(400)
        .json({ message: "Nombre, precio y stock son requeridos" });
    }

    if (isNaN(precio) || precio < 0) {
      return res.status(400).json({ message: "Precio inválido" });
    }

    if (isNaN(stock) || stock < 0) {
      return res.status(400).json({ message: "Stock inválido" });
    }

    // Procesar imágenes subidas con multer + cloudinary
    const imagenes = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        imagenes.push(file.path); // Cloudinary devuelve la URL en file.path
      });
    }

    const imagenPresentacion = imagenes[0] || "";

    const newProducto = new productsModel({
      nombre,
      precio: Number(precio),
      stock: Number(stock),
      descripcion,
      imagenes,
      imagenPresentacion,
      idCategoria,
      subCategoria,
      estado: estado || "activo",
    });

    await newProducto.save();
    return res
      .status(201)
      .json({ message: "Producto guardado exitosamente", producto: newProducto });
  } catch (error) {
    console.error("insertProducto error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//UPDATE
productosController.updateProducto = async (req, res) => {
  try {
    let {
      nombre,
      precio,
      stock,
      descripcion,
      idCategoria,
      subCategoria,
      estado,
      imagenesExistentes, // URLs que ya existen y el usuario quiere conservar
    } = req.body;

    nombre = nombre?.trim();

    if (!nombre || precio === undefined || stock === undefined) {
      return res
        .status(400)
        .json({ message: "Nombre, precio y stock son requeridos" });
    }

    if (isNaN(precio) || precio < 0) {
      return res.status(400).json({ message: "Precio inválido" });
    }

    // Combinar imágenes existentes conservadas + nuevas subidas
    let imagenes = [];
    if (imagenesExistentes) {
      imagenes = Array.isArray(imagenesExistentes)
        ? imagenesExistentes
        : [imagenesExistentes];
    }

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        imagenes.push(file.path);
      });
    }

    const updateData = {
      nombre,
      precio: Number(precio),
      stock: Number(stock),
      descripcion,
      idCategoria,
      subCategoria,
      estado,
    };

    if (imagenes.length > 0) {
      updateData.imagenes = imagenes;
      updateData.imagenPresentacion = imagenes[0];
    }

    const productoActualizado = await productsModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!productoActualizado) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.status(200).json({
      message: "Producto actualizado exitosamente",
      producto: productoActualizado,
    });
  } catch (error) {
    console.error("updateProducto error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE 
productosController.deleteProducto = async (req, res) => {
  try {
    const producto = await productsModel.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Eliminar imágenes de Cloudinary
    if (producto.imagenes && producto.imagenes.length > 0) {
      const deletePromises = producto.imagenes.map((url) => {
        // Extraer public_id de la URL de Cloudinary
        const parts = url.split("/");
        const filename = parts[parts.length - 1];
        const publicId = `LuckyShop/${filename.split(".")[0]}`;
        return cloudinary.uploader.destroy(publicId).catch(() => {}); // No fallar si la imagen ya no existe
      });
      await Promise.all(deletePromises);
    }

    await productsModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error("deleteProducto error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//TOGGLE ESTADO 
productosController.toggleEstado = async (req, res) => {
  try {
    const producto = await productsModel.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const nuevoEstado = producto.estado === "activo" ? "inactivo" : "activo";
    producto.estado = nuevoEstado;
    await producto.save();

    return res.status(200).json({
      message: `Producto ${nuevoEstado}`,
      estado: nuevoEstado,
    });
  } catch (error) {
    console.error("toggleEstado error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default productosController;
