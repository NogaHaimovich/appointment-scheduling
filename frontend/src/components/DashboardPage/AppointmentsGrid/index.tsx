import type { AppointmentProps } from "../../../types/types";
import AppointmentCard from "../ApointmentCard";
import "./style.scss"

type AppointmentGridProps = {
    appointmentsList: AppointmentProps[];
    showButtons?: boolean;
}

const AppointmentGrid = ({appointmentsList, showButtons = false}: AppointmentGridProps) =>{
    return (
        <div className="appointments_grid">
            {appointmentsList.map((appointment, index) => (
                <AppointmentCard
                    key={index}
                    {...appointment}
                    showButtons={showButtons}
                />
            ))}
        </div>
    );
};

export default AppointmentGrid;
