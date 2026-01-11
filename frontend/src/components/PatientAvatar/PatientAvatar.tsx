import { getAvatarColorClass, getInitials } from "../../utils/avatarUtils";
import "./styles.scss";

type PatientAvatarProps = {
    patientId: string;
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

