import { Request, Response } from "express";
import { getAccountAppointments, getAvailableSlotsByDoctorId, updateAppointmentAccountID, rescheduleAppointment, getNextAvailableAppointmentDate } from "./appointments.service";

export async function getAccountAppointmentsHandler(req: Request, res: Response) {
    const accountID = req.query.accountId as string;
    if (!accountID) {
        return res.status(400).json({ 
            success: false,
            message: "Account ID is required" 
        });
    }
    try {
        const { appointmentHistory, upcomingAppointment } = await getAccountAppointments(accountID);
        res.json({
            success: true,
            appointmentHistory,
            upcomingAppointment
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

export async function assignAppointmentHandler(req: Request, res: Response) {
    const { accountId, appointmentId } = req.body;
    
    if (appointmentId === undefined || appointmentId === null) {
        return res.status(400).json({ 
            success: false, 
            message: "Appointment ID is required" 
        });
    }
    
    if (accountId === undefined) {
        return res.status(400).json({ 
            success: false, 
            message: "Account ID is required" 
        });
    }
    
    try {
        await updateAppointmentAccountID(appointmentId, accountId); 
        const message = accountId === null 
            ? "Appointment canceled successfully" 
            : "Appointment assigned successfully";
        res.json({ success: true, message });
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ success: false, message: "Failed to update appointment" });
    }
}

export async function rescheduleAppointmentHandler(req: Request, res: Response) {
    const { oldAppointmentId, newAppointmentId, accountId } = req.body;
    
    if (!oldAppointmentId || !newAppointmentId || !accountId) {
        return res.status(400).json({ 
            success: false, 
            message: "Old Appointment ID, New Appointment ID, and Account ID are required" 
        });
    }

    try {
        await rescheduleAppointment(oldAppointmentId, newAppointmentId, accountId);
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

