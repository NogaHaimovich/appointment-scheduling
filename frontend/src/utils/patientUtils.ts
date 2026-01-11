export const getBadgeColorClass = (relationship: string): string => {
    const normalizedRelationship = relationship.toLowerCase();
    return `patient_badge--${normalizedRelationship}`;
};

export const formatRelationship = (relationship: string, isAdmin: boolean = false): string => {
    const formatted = relationship.charAt(0).toUpperCase() + relationship.slice(1);
    return isAdmin ? `${formatted} (Admin)` : formatted;
};

