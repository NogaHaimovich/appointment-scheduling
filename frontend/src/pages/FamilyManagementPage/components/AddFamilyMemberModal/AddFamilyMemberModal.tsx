import { useState, useEffect } from "react";
import InputField from "../../../../components/InputField/InputField";
import Dropdown from "../../../../components/Dropdown/Dropdown";
import Button from "../../../../components/Button/Button";
import "./styles.scss";

type AddFamilyMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, relationship: string) => void;
  loading?: boolean;
  error?: string | null;
};

const RELATIONSHIP_OPTIONS = [
  { value: "child", label: "Child" },
  { value: "parent", label: "Parent" },
  { value: "spouse", label: "Spouse" },
  { value: "other", label: "Other" },
];

const AddFamilyMemberModal = ({ isOpen, onClose, onSubmit, loading = false, error }: AddFamilyMemberModalProps) => {
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setRelationship("");
      setNameError("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setNameError("Name is required");
      return;
    }

    if (!relationship) {
      return;
    }

    if (loading) {
      return;
    }

    onSubmit(name.trim(), relationship);
  };

  const handleClose = () => {
    setName("");
    setRelationship("");
    setNameError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="add-family-member-modal-overlay" onClick={handleClose}>
      <div className="add-family-member-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="add-family-member-modal__title">Add Family Member</h2>
        <p className="add-family-member-modal__subtitle">
          Register a family member to manage their care and appointments.
        </p>

        <div className="add-family-member-modal__form">
          {error && (
            <div className="add-family-member-modal__error" style={{ color: "red", marginBottom: "1rem" }}>
              {error}
            </div>
          )}
          <div className="add-family-member-modal__field">
            <InputField
              value={name}
              onChange={(val) => {
                if (!loading) {
                  setName(val);
                  if (nameError) setNameError("");
                }
              }}
              placeholder="Enter name"
              error={nameError}
            />
          </div>

          <div className="add-family-member-modal__field">
            <Dropdown
              label="Relationship"
              value={relationship}
              options={RELATIONSHIP_OPTIONS}
              onChange={setRelationship}
              disable={loading}
            />
          </div>
        </div>

        <div className="add-family-member-modal__buttons">
          <Button 
            onClick={handleClose} 
            className="add-family-member-modal__button" 
            variant="info"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="add-family-member-modal__button"
            disabled={!name.trim() || !relationship || loading}
          >
            {loading ? "Adding..." : "Add Member"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddFamilyMemberModal;

