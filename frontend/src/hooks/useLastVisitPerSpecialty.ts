
import { API_ENDPOINTS } from '../config/api';
import { useData } from './useData';
import { type LastVisitPerSpecialtyResponse } from '../types/types';
import { useMemo } from 'react';


export const useLastVisitPerSpecialty = (patient_id: string) => {
    const body = useMemo(() => ({ patientId: patient_id }), [patient_id]);

    const {data, loading, error, refetch} = useData<LastVisitPerSpecialtyResponse>(
        API_ENDPOINTS.getLastVisitPerSpecialty,
        0,
        body,
        !!patient_id
    );

    return {
        lastVisitPerSpecialty: data?.lastVisitPerSpecialty || [],  
        loading,
        error,
        refetch  
    };


}