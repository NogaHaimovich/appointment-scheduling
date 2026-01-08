import { getAvatarColorClass, getInitials } from "../../utils/patientUtils";
import "./styles.scss";

type PatientAvatarProps = {
    patientId: number;
    name: string;
};

const PatientAvatar = ({ patientId, name }: PatientAvatarProps) => {
    return (
        <div className={`patient_avatar ${getAvatarColorClass(patientId)}`}>
            {getInitials(name)}
        </div>
    );
};

export default PatientAvatar;

