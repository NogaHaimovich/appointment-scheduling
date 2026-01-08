import { getBadgeColorClass, formatRelationship } from "../../utils/patientUtils";
import "./styles.scss";

type PatientBadgeProps = {
    relationship: string;
    isAdmin?: boolean;
};

const PatientBadge = ({ relationship, isAdmin = false }: PatientBadgeProps) => {
    return (
        <span className={`patient_badge ${getBadgeColorClass(relationship)}`}>
            {formatRelationship(relationship, isAdmin)}
        </span>
    );
};

export default PatientBadge;

