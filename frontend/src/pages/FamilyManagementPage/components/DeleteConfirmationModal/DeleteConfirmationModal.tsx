import { useEffect } from "react";
import { createPortal } from "react-dom";
import Button from "../../../../components/Button/Button";
import "./styles.scss";

type DeleteConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  patientName: string;
  loading?: boolean;
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, patientName, loading = false}: DeleteConfirmationModalProps) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="delete-confirmation-modal-overlay" onClick={onClose}>
      <div className="delete-confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="delete-confirmation-modal__title">Delete Family Member</h2>
        <p className="delete-confirmation-modal__message">
          Are you sure you want to delete <strong>{patientName}</strong>?
        </p>
        <p className="delete-confirmation-modal__warning">
          This will remove them from your family members list. If they have any upcoming appointments, 
          those appointments will be kept but the patient information will be removed from them.
        </p>

        <div className="delete-confirmation-modal__buttons">
          <Button
            onClick={onClose}
            className="delete-confirmation-modal__button"
            variant="info"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="delete-confirmation-modal__button"
            variant="danger"
            disabled={loading}
            loading={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default DeleteConfirmationModal;

