import SpecialtySelector from "./components/SpecialtySelection/SpecialtySelection";
import DoctorSelector from "./components/DoctorSelection/DoctorSelection";
import DateTimeSelector from "./components/DateAndTimeSelection/DateAndTimeSelection";
import AppointmentSummary from "./components/AppointmentsSummary/AppointmentsSummary";
import { useAppointmentBooking } from "../../hooks/useAppointmentsBooking";
import "./styles.scss"
import SuccessPopup from "../../components/SuccessPopup/SuccessPopup";

const AppointmentBookingPage = () => {
  const booking = useAppointmentBooking();
  const isPopupOpen = booking.showSuccessPopup;

  return (
    <div className="bookingPage-container">
      <h1 className="bookingPage_title">
        {booking.isRescheduleMode ? "Reschedule Appointment" : "Book a new appointment"}
      </h1>

      <SpecialtySelector
        selectedSpecialty={booking.selectedSpecialty}
        options={booking.specialtyOptions}
        onChange={booking.handleSpecialtyChange}
        loading={booking.loadingSpecialties}
        disabled={booking.isRescheduleMode || isPopupOpen}
      />

      <DoctorSelector
        selectedDoctor={booking.selectedDoctor}
        options={booking.doctorsOptions}
        onChange={booking.handleDoctorChange}
        loading={booking.loadingDoctors}
        disabled={booking.isRescheduleMode || !booking.selectedSpecialtyId || isPopupOpen}
      />

      <DateTimeSelector
        groupedSlots={booking.groupedSlots}
        selectedDate={booking.selectedDate}
        selectedTime={booking.selectedTime}
        onDateChange={booking.setSelectedDate}
        onTimeChange={booking.setSelectedTime}
        loadingSlots={booking.loadingSlots}
        disable={!booking.selectedDoctorId || isPopupOpen}
      />

      {booking.isFormComplete && (
        <AppointmentSummary
          specialty={booking.selectedSpecialty}
          doctor={booking.selectedDoctor}
          date={booking.selectedDate}
          time={booking.selectedTime}
          loading={booking.scheduling}
          error={booking.error}
          onConfirm={booking.handleSchedule}
          isReschedule={booking.isRescheduleMode}
          disabled={isPopupOpen}
        />
      )}

      <SuccessPopup
        isOpen={booking.showSuccessPopup}
        onClose={booking.handleCloseSuccessPopup}
        title={booking.isRescheduleMode ? "Appointment Rescheduled!" : "Appointment Scheduled!"}
        message={booking.isRescheduleMode 
          ? "Your appointment has been rescheduled successfully." 
          : "Your appointment has been scheduled successfully."}
        date={booking.selectedDate}
        time={booking.selectedTime}
        doctor={booking.selectedDoctor}
        specialty={booking.selectedSpecialty}
        isReschedule={booking.isRescheduleMode}
      />
    </div>
  );
};

export default AppointmentBookingPage;
