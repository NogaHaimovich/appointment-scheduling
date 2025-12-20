import SpecialtySelector from "./components/SpecialtySelection/SpecialtySelection";
import DoctorSelector from "./components/DoctorSelection/DoctorSelection";
import DateTimeSelector from "./components/DateAndTimeSelection/DateAndTimeSelection";
import AppointmentSummary from "./components/AppointmentsSummary/AppointmentsSummary";
import SuccessPopup from "../../components/SuccessPopup/SuccessPopup";
import { useAppointmentBooking } from "../../hooks/useAppointmentsBooking";

import "./styles.scss";

const AppointmentBookingPage = () => {
  const booking = useAppointmentBooking();
  const isPopupOpen = booking.showSuccessPopup;
  console.log(booking.selectedDoctor)

  return (
    <div className="bookingPage-container">
      <h1 className="bookingPage_title">
        {booking.isRescheduleMode
          ? "Reschedule Appointment"
          : "Book a new appointment"}
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
        disabled={
          isPopupOpen ||
          booking.isRescheduleMode ||
          !booking.selectedSpecialty
        }
      />

      <DateTimeSelector
        groupedSlots={booking.groupedSlots}
        selectedDate={booking.selectedDate}
        selectedTime={booking.selectedTime}
        onDateChange={booking.setSelectedDate}
        onTimeChange={booking.setSelectedTime}
        loadingSlots={booking.loadingSlots}
        disable={
          isPopupOpen ||
          !booking.selectedDoctor
        }
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
        title={
          booking.isRescheduleMode
            ? "Appointment Rescheduled!"
            : "Appointment Scheduled!"
        }
        message={
          booking.isRescheduleMode
            ? "Your appointment has been rescheduled successfully."
            : "Your appointment has been scheduled successfully."
        }
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
