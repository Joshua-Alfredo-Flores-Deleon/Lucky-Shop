//Importamos los hooks de React
import { useEffect, useState } from "react";

//Importamos el hook personalizado
import useDashboard from "../hooks/useDashboard";

//Importamos los componentes
import SideBar from "../components/SideBar";
import Nav from "../components/Nav";
import KPICard from "../components/KPICard";
import SalesChart from "../components/SalesChart";
import SummaryCard from "../components/SummaryCard";
import NotificationModal from "../components/NotificationModal";

//Importamos los estilos
import "./Home.css";

//Importamos iconos
import {
    FaBox,
    FaUsers,
    FaShoppingCart,
    FaDollarSign
} from "react-icons/fa";

const Home = () => {

    //Estado para abrir y cerrar el modal de notificaciones
    const [openModal, setOpenModal] = useState(false);

    //Importamos la información del hook
    const {

        dashboard,

        loading,

        getDashboard

    } = useDashboard();

    //Cuando cargue la página obtenemos los datos
    useEffect(() => {

        getDashboard();

    }, []);

    return (

        <div className="dashboard">

            {/* Sidebar */}
            <SideBar />

            <div className="dashboard-content">

                {/* Barra superior */}
                <Nav
                    openNotifications={() => setOpenModal(true)}
                />

                {/* Encabezado */}
                <div className="dashboard-header">

                    <h1>Panel de control</h1>

                    <p>
                        Bienvenido nuevamente al sistema Lucky Shop.
                    </p>

                </div>

                {/* Tarjetas */}
                <div className="kpi-container">

                    <KPICard
                        title="Productos"
                        value={loading ? "..." : dashboard.totalProductos}
                        icon={<FaBox />}
                    />

                    <KPICard
                        title="Clientes"
                        value={loading ? "..." : dashboard.totalClientes}
                        icon={<FaUsers />}
                    />

                    <KPICard
                        title="Ventas"
                        value={loading ? "..." : dashboard.totalVentas}
                        icon={<FaShoppingCart />}
                    />

                    <KPICard
                        title="Ganancias"
                        value={loading ? "..." : `$${dashboard.totalGanancias}`}
                        icon={<FaDollarSign />}
                    />

                </div>

                {/* Parte inferior */}

                <div className="dashboard-body">

                    <SalesChart />

                    <SummaryCard dashboard={dashboard} />

                </div>

            </div>

            {/* Modal de notificaciones */}

            {

                openModal && (

                    <NotificationModal
                        closeModal={() => setOpenModal(false)}
                    />

                )

            }

        </div>

    );

};

export default Home;