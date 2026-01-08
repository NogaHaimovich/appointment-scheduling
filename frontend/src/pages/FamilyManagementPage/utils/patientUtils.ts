export const getAvatarColorClass = (patientId: number): string => {
    const colorIndex = patientId % 10; 
    return `patient_avatar--color-${colorIndex}`;
};

export const getBadgeColorClass = (relationship: string): string => {
    const normalizedRelationship = relationship.toLowerCase();
    return `patient_badge--${normalizedRelationship}`;
};

export const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

export const formatRelationship = (relationship: string, isAdmin: boolean = false): string => {
    const formatted = relationship.charAt(0).toUpperCase() + relationship.slice(1);
    return isAdmin ? `${formatted} (Admin)` : formatted;
};

export const formatAppointmentDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const day = date.getDate();
    return `${month} ${day}`;
};

