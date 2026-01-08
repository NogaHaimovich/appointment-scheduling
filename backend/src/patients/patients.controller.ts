import { Request, Response } from "express";
import { getPatientsByAccountId } from "./patients.service";

export async function getPatientsByAccountIdHandler(req: Request, res: Response) {
    const accountId = req.query.accountId as string;
    
    if (!accountId) {
        return res.status(400).json({ 
            success: false,
            message: "Account ID is required" 
        });
    }
    
    try {
        const patients = await getPatientsByAccountId(accountId);
        res.json({
            success: true,
            patients
        });
    } catch (error) {
        console.error("Error getting patients:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to retrieve patients" 
        });
    }
}

