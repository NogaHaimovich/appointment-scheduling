export type Patient = {
    id: string;
    name: string;
    relationship: string;
    isAdmin?: boolean;
    nextAppointment?: {
        doctorName: string;
        date: string;
    };
};

