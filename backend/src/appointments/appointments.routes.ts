import { Router, Request, Response } from "express";
import { getUserAppointments, getAvailableSlotsByDoctorId, updateAppointmentUserID, rescheduleAppointment } from "./appointments.service";

const router = Router();

router.get("/user", async (req: Request, res: Response) => {
    const userID = req.query.userId as string;
    if (!userID) {
        return res.status(400).json({ 
            success: false,
            message: "User ID is required" 
        });
    }
    try {
        const { appointmentHistory, upcomingAppointment } = await getUserAppointments(userID);
        res.json({
            success: true,
            appointmentHistory,
            upcomingAppointment
        });
    } catch (error) {
        console.error("Error getting user appointments:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to retrieve appointments" 
        });
    }
});

router.get("/open-slots-by-doctor-id", async (req: Request, res: Response)=>{
        console.log("inside get avaliable")

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
})

router.patch("/assign", async (req: Request, res: Response) => {
    const { userId, appointmentId } = req.body;
    
    if (appointmentId === undefined || appointmentId === null) {
        return res.status(400).json({ 
            success: false, 
            message: "Appointment ID is required" 
        });
    }
    
    if (userId === undefined) {
        return res.status(400).json({ 
            success: false, 
            message: "User ID is required" 
        });
    }
    
    try {
        await updateAppointmentUserID(appointmentId, userId); 
        const message = userId === null 
            ? "Appointment canceled successfully" 
            : "Appointment assigned successfully";
        res.json({ success: true, message });
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ success: false, message: "Failed to update appointment" });
    }
})


router.patch("/reschedule", async (req: Request, res: Response) => {
    const { oldAppointmentId, newAppointmentId, userId } = req.body;
    
    if (!oldAppointmentId || !newAppointmentId || !userId) {
        return res.status(400).json({ 
            success: false, 
            message: "Old Appointment ID, New Appointment ID, and User ID are required" 
        });
    }

    try {
        await rescheduleAppointment(oldAppointmentId, newAppointmentId, userId);
        res.json({ success: true, message: "Appointment rescheduled successfully" });
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ success: false, message: "Failed to update appointment" });
    }

})

export default router;


