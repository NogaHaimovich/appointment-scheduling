import Button from "../../Button";
import "./style.scss";

type PopupButtonsProps = {
  onClose: () => void;
  gcalUrl?: string;
  isReschedule?: boolean;
};

const PopupButtons = ({ onClose, gcalUrl, isReschedule = false }: PopupButtonsProps) => (
  <>
    <div className="success-popup__buttons">
      <Button onClick={onClose} className="success-popup__button">
        OK
      </Button>
      {gcalUrl && (
        <Button
          onClick={() => window.open(gcalUrl, "_blank")}
          className="success-popup__button"
        >
          Add to Google Calendar
        </Button>
      )}
    </div>
    {isReschedule && (
      <p className="success-popup__subtitle">
        Note: If you add this to Google Calendar, a new appointment will be created. Please manually delete the old appointment from your calendar.
      </p>
    )}
  </>
);

export default PopupButtons;
