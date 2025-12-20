import { useEffect } from "react";
import PopupButtons from "./PopupButtons";
import { convertToGCalUTC } from "../../../utils/dateFormat";
import { getGCalUrl } from "../../../utils/googleCalnder";
import "./style.scss";


type SuccessPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  date: string;
  time: string;
  doctor?: string;
  specialty?: string;
  isReschedule?: boolean;
};

const SuccessPopup = ({isOpen, onClose, title, message, date, time, doctor, specialty, isReschedule = false}: SuccessPopupProps) => {
  const gcalTimes = convertToGCalUTC(date, time);

  const eventTitle = doctor ? `Appointment with ${doctor}` : title;
  const eventDetails = [
    message,
    specialty && `Specialty: ${specialty}`,
    doctor && `Doctor: ${doctor}`,
    date && time && `Date: ${date} at ${time}`,
  ]
    .filter(Boolean)
    .join("\n");

  const gcalUrl = getGCalUrl(eventTitle, eventDetails, gcalTimes);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="success-popup-overlay" onClick={onClose}>
      <div className="success-popup" onClick={(e) => e.stopPropagation()}>
        <div className="success-popup__icon">✓</div>
        <h2 className="success-popup__title">{title}</h2>
        <p className="success-popup__message">{message}</p>
        <PopupButtons onClose={onClose} gcalUrl={gcalUrl} isReschedule={isReschedule} />
      </div>
    </div>
  );
};

export default SuccessPopup;
