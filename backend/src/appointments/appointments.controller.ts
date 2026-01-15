import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { getAccountAppointments, getAvailableSlotsByDoctorId, updateAppointmentAccountID, rescheduleAppointment, getNextAvailableAppointmentDate } from "./appointments.service";

export async function getAccountAppointmentsHandler(req: AuthRequest, res: Response) {
    const accountID = req.accountId;
    if (!accountID) {
        return res.status(401).json({ 
            success: false,
            message: "Authentication required" 
        });
    }
    try {
        const { appointmentHistory, upcomingAppointment, accountName } = await getAccountAppointments(accountID);
        res.json({
            success: true,
            appointmentHistory,
            upcomingAppointment,
            accountName
        });
    } catch (error) {
        console.error("Error getting account appointments:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to retrieve appointments" 
        });
    }
}

export async function getAvailableSlotsByDoctorIdHandler(req: Request, res: Response) {
    const doctorID = req.query.doctorId ? parseInt(req.query.doctorId as string) : null;
    if (!doctorID) {
        return res.status(400).json({ 
            success: false,
            message: "Doctor ID is required" 
        });
    }
    try {
        const avaliableSlots  = await getAvailableSlotsByDoctorId(doctorID);
        res.json({
            success: true,
            avaliableSlots
        });
    } catch (error) {
        console.error("Error getting available slots:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to retrieve appointments" 
        });
    }
}

export async function assignAppointmentHandler(req: AuthRequest, res: Response) {
    const accountId = req.accountId;
    const { appointmentId, patientId, patientName } = req.body;
    
    if (!accountId) {
        return res.status(401).json({ 
            success: false, 
            message: "Authentication required" 
        });
    }
    
    if (appointmentId === undefined || appointmentId === null) {
        return res.status(400).json({ 
            success: false, 
            message: "Appointment ID is required" 
        });
    }
    
    try {
        const finalPatientId = patientId || null;
        const finalPatientName = patientName || null;
        
        await updateAppointmentAccountID(appointmentId, accountId, finalPatientId, finalPatientName); 
        res.json({ success: true, message: "Appointment assigned successfully" });
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ success: false, message: "Failed to update appointment" });
    }
}

export async function rescheduleAppointmentHandler(req: AuthRequest, res: Response) {
    const accountId = req.accountId;
    const { oldAppointmentId, newAppointmentId, patientId, patientName } = req.body;
    
    if (!accountId) {
        return res.status(401).json({ 
            success: false, 
            message: "Authentication required" 
        });
    }
    
    if (!oldAppointmentId || !newAppointmentId) {
        return res.status(400).json({ 
            success: false, 
            message: "Old Appointment ID and New Appointment ID are required" 
        });
    }

    try {
        await rescheduleAppointment(
            oldAppointmentId, 
            newAppointmentId, 
            accountId,
            patientId || null,
            patientName || null
        );
        res.json({ success: true, message: "Appointment rescheduled successfully" });
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ success: false, message: "Failed to update appointment" });
    }
}

export async function getNextAvailableAppointmentHandler(req: Request, res: Response) {
    const doctorID = req.query.doctorId ? parseInt(req.query.doctorId as string) : null;

    if (!doctorID) {
        return res.status(400).json({ 
            success: false,
            message: "Doctor ID is required" 
        });
    }

    try {
        const nextAvailable = await getNextAvailableAppointmentDate(doctorID);
        res.json({
            success: true,
            nextAvailable
        });
    } catch (error) {
        console.error("Error getting next available appointment date:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to retrieve next available appointment date" 
        });
    }
}

