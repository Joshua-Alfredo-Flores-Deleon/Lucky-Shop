//Importamos los estilos del componente
import "./KPICard.css";

//Componente que representa una tarjeta del Dashboard
const KPICard = ({ title, value, icon, color }) => {

    return (

        <div className="kpi-card">

            {/* Icono */}
            <div
                className="kpi-icon"
                style={{ backgroundColor: color }}
            >
                {icon}
            </div>

            {/* Información */}
            <div className="kpi-info">

                {/* Título */}
                <h4>{title}</h4>

                {/* Valor */}
                <h2>{value}</h2>

            </div>

        </div>

    );

};

//Exportamos el componente
export default KPICard;