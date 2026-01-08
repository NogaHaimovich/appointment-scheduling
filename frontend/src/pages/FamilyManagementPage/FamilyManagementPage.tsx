import { useState, useMemo } from "react";
import "./styles.scss"
import PatientCard from "./components/PatientCard/PatientCard";
import AddFamilyMemberCard from "./components/AddFamilyMemberCard/AddFamilyMemberCard";
import AddFamilyMemberModal from "./components/AddFamilyMemberModal/AddFamilyMemberModal";
import { usePatients } from "../../hooks/usePatients";
import type { Patient } from "./types/patientTypes";

const FamilyManagementPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { patients: backendPatients, loadingPatients, addPatient, addingPatient, addPatientError } = usePatients();

    const patients: Patient[] = useMemo(() => {
        return backendPatients.map(patient => ({
            id: patient.id,
            name: patient.patient_name,
            relationship: patient.relationship,
            isAdmin: patient.relationship === "self",
        }));
    }, [backendPatients]);

    const handleAddFamilyMember = () => {
        setIsModalOpen(true);
        setError(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setError(null);
    };

    const handleSubmitFamilyMember = async (name: string, relationship: string) => {
        try {
            setError(null);
            const result = await addPatient(name, relationship);
            if (result?.success) {
                setIsModalOpen(false);
            } else {
                setError(addPatientError || "Failed to add family member");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add family member");
        }
    };

    return (
        <div className="familyManagemntPage_wrapper">
            <div className="familyManagemntPage_container">
                <h1 className="familyManagemntPage_title">Family Management Page</h1>
                <h5 className="familyManagemntPage_subtitle">Manage profiles and appointments history for your family members</h5>
                {loadingPatients ? (
                    <div>Loading patients...</div>
                ) : (
                    <div className="patients_grid">
                        {patients.map((patient) => (
                            <PatientCard
                                key={patient.id}
                                patient={patient}
                            />
                        ))}
                        <AddFamilyMemberCard onClick={handleAddFamilyMember} />
                    </div>
                )}
            </div>
            <AddFamilyMemberModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitFamilyMember}
                loading={addingPatient}
                error={error}
            />
        </div>
    )
}

export default FamilyManagementPage;