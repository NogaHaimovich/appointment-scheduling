import { Router, Request, Response } from "express";
import { getAllSpecialties, getDoctorsBySpecialty } from "../services/specialties.service";

const router = Router();

router.get("/", async(req: Request, res: Response)=>{
    try{
        const specialties = await getAllSpecialties()
        res.json({
            success: true, 
            specialties
        });
    } catch(error){
        console.error("Error getting specialties list", error);
        res.status(500).json({
            success:false,
            message: "Failed to retrieve specialties list"
        });
    }
})

router.get("/doctors-by-specialty", async(req: Request, res: Response)=>{
    const specialtyId = req.query.specialtyId;
    
    if (!specialtyId) {
        return res.status(400).json({
            success: false,
            message: "Specialty ID is required"
        });
    }

    const specialtyIdNum = parseInt(specialtyId as string, 10);
    if (isNaN(specialtyIdNum)) {
        return res.status(400).json({
            success: false,
            message: "Invalid specialty ID format"
        });
    }

    try{
        const doctors = await getDoctorsBySpecialty(specialtyIdNum)
        res.json({
            success: true, 
            doctors
        });
    } catch(error){
        console.error("Error getting doctors by specialty", error);
        res.status(500).json({
            success:false,
            message: "Failed to retrieve doctors list"
        });
    }
})

export default router