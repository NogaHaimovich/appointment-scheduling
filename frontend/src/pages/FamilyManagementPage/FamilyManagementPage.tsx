import "./styles.scss"
import PatientCard from "./components/PatientCard/PatientCard";
import AddFamilyMemberCard from "./components/AddFamilyMemberCard/AddFamilyMemberCard";
import type { Patient } from "./types/patientTypes";

const FamilyManagementPage = () => {
    const patients: Patient[] = [
        { 
            id: "550e8400-e29b-41d4-a716-446655440000", 
            name: "Noga Shapiro", 
            relationship: "self", 
            isAdmin: true,
            nextAppointment: {
                doctorName: "Dr. Shapiro",
                date: "2024-08-01"
            }
        },
        {
            id: "550e8400-e29b-41d4-a716-446655440001", 
            name: "David Shapiro", 
            relationship: "parent",
            isAdmin: false,
            nextAppointment: {
                doctorName: "Dr. Cohen",
                date: "2024-07-15"
            }
        }
    ];



    const handleBookAppointment = (patientId: string) => {
        console.log("Book appointment for patient:", patientId);
    };

    const handleDeletePatient = (patientId: string) => {
        console.log("Delete patient:", patientId);
    };

    const handleAddFamilyMember = () => {
        console.log("Add family member");
    };

    return (
        <div className="familyManagemntPage_wrapper">
            <div className="familyManagemntPage_container">
                <h1 className="familyManagemntPage_title">Family Management Page</h1>
                <h5 className="familyManagemntPage_subtitle">Manage profiles and appointments history for your family members</h5>
                <div className="patients_grid">
                    {patients.map((patient) => (
                        <PatientCard
                            key={patient.id}
                            patient={patient}
                            onBookAppointment={handleBookAppointment}
                            onDeletePatient={handleDeletePatient}
                        />
                    ))}
                    <AddFamilyMemberCard onClick={handleAddFamilyMember} />
                </div>
        </div>
    </div>
    )
}

export default FamilyManagementPage;