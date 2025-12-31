import SpecialtySelector from "./components/SpecialtySelection/SpecialtySelection";
import DoctorSelector from "./components/DoctorSelection/DoctorSelection";
import DateTimeSelector from "./components/DateAndTimeSelection/DateAndTimeSelection";
import SuccessPopup from "../../components/SuccessPopup/SuccessPopup";
import { useAppointmentBooking } from "../../hooks/useAppointmentsBooking";

import "./styles.scss";

const AppointmentBookingPage = () => {
  const booking = useAppointmentBooking();
  const isPopupOpen = booking.showSuccessPopup;

  return (
    <div className="bookingPage-wrapper">
      <div className="bookingPage-header">
        <div className="bookingPage-header-left">
          <h1 className="bookingPage-title">Appointment Booking</h1>
        </div>
      </div>

      <div className="bookingPage-content">
        <div className="bookingPage-main">
          <div className="bookingPage-column">
            <SpecialtySelector
              selectedSpecialty={booking.selectedSpecialty}
              specialties={booking.specialties}
              onChange={booking.handleSpecialtyChange}
              loading={booking.loadingSpecialties}
              disabled={booking.isRescheduleMode || isPopupOpen}
            />
          </div>

          <div className={`bookingPage-column ${!booking.selectedSpecialty ? 'bookingPage-column-hidden' : ''}`}>
            {booking.selectedSpecialty && (
              <DoctorSelector
                selectedDoctor={booking.selectedDoctor}
                doctors={booking.doctors}
                selectedSpecialty={booking.selectedSpecialty}
                onChange={booking.handleDoctorChange}
                loading={booking.loadingDoctors}
                disabled={
                  isPopupOpen ||
                  booking.isRescheduleMode ||
                  !booking.selectedSpecialty
                }
              />
            )}
          </div>

          <div className={`bookingPage-column ${!booking.selectedDoctor ? 'bookingPage-column-hidden' : ''}`}>
            {booking.selectedDoctor && (
              <DateTimeSelector
                groupedSlots={booking.groupedSlots}
                selectedDate={booking.selectedDate}
                selectedTime={booking.selectedTime}
                selectedDoctor={booking.selectedDoctor}
                selectedSpecialty={booking.selectedSpecialty}
                onDateChange={booking.setSelectedDate}
                onTimeChange={booking.setSelectedTime}
                loadingSlots={booking.loadingSlots}
                disable={isPopupOpen || !booking.selectedDoctor}
                isFormComplete={booking.isFormComplete}
                loading={booking.scheduling}
                error={booking.error}
                onConfirm={booking.handleSchedule}
                isReschedule={booking.isRescheduleMode}
              />
            )}
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <SuccessPopup
          onClose={booking.handleCloseSuccessPopup}
          isOpen
          title=""
          message=""
          date=""
          time=""
        />
      )}
    </div>
  );
};

export default AppointmentBookingPage;
