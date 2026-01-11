export const getAvatarColorClass = (patientId: string): string => {
    let hash = 0;
    for (let i = 0; i < patientId.length; i++) {
        const char = patientId.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; 
    }
    const colorIndex = Math.abs(hash) % 10; 
    return `patient_avatar--color-${colorIndex}`;
};

export const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

