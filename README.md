# Appointment Manager

A full-stack web application for managing medical appointments. Users can book, view, and reschedule appointments with doctors across different medical specialties.

## 🚀 Features

- **Phone-based Authentication**: Secure login using phone number and OTP verification
- **Specialty Selection**: Browse and select from various medical specialties
- **Doctor Selection**: Choose from available doctors within a specialty
- **Appointment Booking**: Book appointments by selecting available date and time slots
- **Appointment Management**: View upcoming and past appointments
- **Rescheduling**: Reschedule existing appointments to different time slots
- **Cancellation**: Cancel appointments when needed
- **Responsive Design**: Modern UI built with React and Material-UI

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Material-UI (MUI)** - UI component library
- **SCSS** - Styling
- **Day.js** - Date manipulation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **SQLite** - Database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing (for future use)
- **Cookie Parser** - Cookie handling
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher) or **yarn**
- **Git**

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd appointment-manager/apps
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

## ⚙️ Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1h

# CORS Configuration (comma-separated)
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

**Important**: Replace `JWT_SECRET` with a strong, random secret key in production.

### Frontend Configuration

The frontend API base URL is configured in `frontend/src/config/api.ts`. By default, it points to `http://localhost:5000/api`. Update this if your backend runs on a different port.

## 🗄️ Database Setup

The application uses SQLite. You need to initialize the database and seed it with sample data before starting the server.

1. **Ensure the data directory exists** (optional - will be created automatically)
   ```bash
   cd backend
   mkdir -p data
   ```

2. **Initialize the database** (creates tables)
   ```bash
   npm run init
   ```
   You should see:
   ```
   Connected to SQLite: <path>/data/app.db
   🧱 Creating tables...
   ✅ Tables created
   Database connection closed
   ```

3. **Seed the database** (populates sample data)
   ```bash
   npm run seed
   ```
   
   This will populate the database with:
   - 5 medical specialties (Dermatology, Orthopedics, Cardiology, Pediatrics, Neurology)
   - 13 doctors across different specialties
   - Available appointment slots from December 15-31, 2025 (9 AM - 5 PM)
   - 3 sample users (for testing)

4. **Start the server**
   ```bash
   npm run dev
   ```

The database file will be created at `backend/data/app.db` when you run the init command.

### Database Schema

- **users**: Stores user information (id, phone)
- **doctors**: Stores doctor information (id, name)
- **specialties**: Stores medical specialties (id, name, description)
- **doctor_specialties**: Junction table linking doctors to specialties
- **appointments**: Stores appointment slots (id, doctor_id, date, time, user_id)

## 🧪 Testing

**Note**: Testing was not the main purpose of this project. However, several tests were added to demonstrate testing thinking and best practices. The current test suite provides examples of how different types of code can be tested, but it does not provide full coverage of the application.

### Current Test Coverage

The project includes a few example tests to demonstrate testing approaches:

#### Frontend Tests
- **`frontend/src/components/common/Button/button.test.tsx`**: Tests for the Button component including rendering, click handlers, disabled/loading states, and variant styling
- **`frontend/src/utils/__tests__/dateFormat.test.ts`**: Tests for date formatting utilities including date conversion, Google Calendar UTC conversion, and edge cases

#### Backend Tests
- **`backend/src/services/__tests__/auth.test.ts`**: Tests for authentication service including OTP code generation/verification, user creation/retrieval, JWT token generation, and error handling

### Running Tests

**Frontend**:
```bash
cd frontend
npm run test:run 
```

**Backend**:
```bash
cd backend
npm test
```

### Additional Tests Needed for Full Coverage

To achieve comprehensive test coverage, the following areas should be tested:

#### Backend Tests

- **Appointment Service**: Booking appointments, retrieving user appointments (upcoming vs history), getting available time slots by doctor, rescheduling logic, and cancellation
- **Specialty Service**: Retrieving medical specialties and filtering doctors by specialty
- **Appointment Routes**: Endpoints for booking, rescheduling, canceling, and viewing appointments with proper authentication
- **Specialty Routes**: Endpoints for fetching specialties and doctors with proper error handling
- **Auth Middleware**: JWT token validation for protected appointment routes
- **Date Utilities**: Date/time formatting for appointments and slot availability calculations

#### Frontend Tests

- **Login Flow**: Phone number validation, OTP code generation request, code verification, token storage, and navigation to dashboard
- **Booking Flow**: Specialty selection, doctor filtering by specialty, date/time slot selection, appointment summary display, and booking submission
- **Dashboard**: Displaying upcoming appointments vs history, appointment card rendering, reschedule/cancel actions, and filtering by specialty
- **Booking Components**: Specialty/doctor/date-time selectors, appointment summary, and success popup interactions
- **Appointment Booking Hook**: Multi-step booking state management, API calls for specialties/doctors/slots, form completion validation, and reschedule mode handling
- **Data Fetching Hooks**: Loading states, error handling, and API integration for appointments and specialties
- **Date Formatting**: Converting between display format (DD-MM-YYYY) and API format (YYYY-MM-DD), Google Calendar integration



