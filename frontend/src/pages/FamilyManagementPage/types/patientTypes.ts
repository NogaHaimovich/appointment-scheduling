export type Patient = {
    id: number;
    name: string;
    relationship: string;
    isAdmin?: boolean;
    nextAppointment?: {
        doctorName: string;
        date: string;
    };
};

