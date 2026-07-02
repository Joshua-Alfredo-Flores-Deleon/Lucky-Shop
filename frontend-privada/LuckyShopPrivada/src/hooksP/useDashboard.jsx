//Importamos el hook de estado
import { useState } from "react";

//URLs de las APIs
const API_PRODUCTOS = "http://localhost:4000/api/productos";
const API_CLIENTES = "http://localhost:4000/api/clientes";
const API_VENTAS = "http://localhost:4000/api/venta";
const API_GANANCIAS = "http://localhost:4000/api/ganancias";

//Hook personalizado para el Dashboard
const useDashboard = () => {

    //Estado donde se almacenarán las estadísticas
    const [dashboard, setDashboard] = useState({

        totalProductos: 0,
        totalClientes: 0,
        totalVentas: 0,
        totalGanancias: 0

    });

    //Estado de carga
    const [loading, setLoading] = useState(false);

    //Función para obtener toda la información del Dashboard
    const getDashboard = async () => {

        try {

            setLoading(true);

            //Consultamos todas las APIs al mismo tiempo
            const [

                responseProductos,
                responseClientes,
                responseVentas,
                responseGanancias

            ] = await Promise.all([

                fetch(API_PRODUCTOS),
                fetch(API_CLIENTES),
                fetch(API_VENTAS),
                fetch(API_GANANCIAS)

            ]);

            //Convertimos las respuestas a JSON
            const productos = await responseProductos.json();
            const clientes = await responseClientes.json();
            const ventas = await responseVentas.json();
            const ganancias = await responseGanancias.json();

            //Obtenemos la última ganancia registrada
            let totalGanancias = 0;

            if (ganancias.length > 0) {

                totalGanancias =
                    ganancias[ganancias.length - 1].totalGanancias;

            }

            //Guardamos las estadísticas
            setDashboard({

                totalProductos: productos.length,

                totalClientes: clientes.length,

                totalVentas: ventas.length,

                totalGanancias: totalGanancias

            });

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    };

    //Retornamos la información
    return {

        dashboard,

        loading,

        getDashboard

    };

};

//Exportamos el Hook
export default useDashboard;