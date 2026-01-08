import { Request, Response } from "express";
import { addPatientToAccount, getPatientsByAccountId, deletePatientById } from "./patients.service";

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

export async function addPatientToAccountHandler(req: Request, res: Response){
    const { accountId, patientName, relationship } = req.body;

    if(!accountId){
        return res.status(400).json({
            success: false,
            message: "Account ID is required" 
        });
    }

    if(!patientName){
        return res.status(400).json({
            success: false,
            message: "Patient name is required" 
        });
    }

    if(!relationship){
        return res.status(400).json({
            success: false,
            message: "Relationship is required" 
        });
    }

    try {
        await addPatientToAccount(accountId, patientName, relationship);
        res.json({
            success: true,
            message: "Patient added successfully"
        });
    } catch(error){
        console.error("Error adding patient:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to add patient" 
        });
    }
}

export async function deletePatientByIdHandler(req: Request, res: Response) {
    const { accountId, patientId } = req.body;

    if (!accountId) {
        return res.status(400).json({
            success: false,
            message: "Account ID is required"
        });
    }

    if (!patientId) {
        return res.status(400).json({
            success: false,
            message: "Patient ID is required"
        });
    }

    try {
        await deletePatientById(accountId, patientId);
        res.json({
            success: true,
            message: "Patient deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting patient:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to delete patient";
        res.status(500).json({
            success: false,
            message: errorMessage
        });
    }
}