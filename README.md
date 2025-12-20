# Appointment Manager

A full-stack web application for managing medical appointments. Users can book, view, and reschedule appointments with doctors across different medical specialties.

## 🌐 Live Demo

🔗 **[View Live Application](https://appoinments-manager.netlify.app/)** - Deployed on Netlify

## 🚀 Features

- **Phone-based Authentication**: Secure login using phone number and OTP verification
- **Specialty Selection**: Browse and select from various medical specialties
- **Doctor Selection**: Choose from available doctors within a specialty
- **Appointment Booking**: Book appointments by selecting available date and time slots
- **Appointment Management**: View upcoming and past appointments
- **Rescheduling**: Reschedule existing appointments to different time slots
- **Cancellation**: Cancel appointments when needed
- **Google Calendar Integration**: Add appointments to Google Calendar via URL-based integration
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

## 🔧 Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd appointment-manager/apps
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### 3. Environment Configuration

**Backend Environment Variables**

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

**Frontend Configuration**

The frontend API base URL is configured in `frontend/src/config/api.ts`. By default, it points to `http://localhost:5000`. Update this if your backend runs on a different port.

### 4. Database Initialization

The application uses SQLite. Initialize the database and seed it with sample data:

**Option 1: Combined Setup (Recommended)**
```bash
cd backend
npm run setup
```
This single command will:
- Create all database tables
- Seed the database with sample data

**Option 2: Separate Commands**
1. **Initialize the database** (creates tables)
   ```bash
   cd backend
   npm run init
   ```
   You should see:
   ```
   Connected to SQLite: <path>/data/app.db
   🧱 Creating tables...
   ✅ Tables created
   Database connection closed
   ```

2. **Seed the database** (populates sample data)
   ```bash
   npm run seed
   ```
   
The seed data includes:
- 5 medical specialties (Dermatology, Orthopedics, Cardiology, Pediatrics, Neurology)
- 13 doctors across different specialties
- Available appointment slots from December 15-31, 2025 (9 AM - 5 PM)
- 3 sample users (for testing)

### 5. Start the Application

**Start Backend Server:**
```bash
cd backend
npm run dev
```
The server will run on `http://localhost:5000` (or the port specified in your `.env` file).

**Start Frontend Development Server:**
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173` (or the next available port).

### 6. Access the Application

Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

**Test Login:**
- Use any phone number (e.g., `1234567890`)
- The OTP code will be returned in the API response (for development purposes)
- Enter the code to log in and access the dashboard

## 🚀 Deployment

The application is configured for deployment using **Netlify** (frontend) and **Render** (backend).

**Frontend (Netlify):** Optimized for static sites/SPAs with automatic GitHub deployments, built-in CDN, and easy configuration via `netlify.toml`. Set `VITE_API_BASE_URL` environment variable to your Render backend URL.

**Backend (Render):** Excellent Node.js/TypeScript support with automatic deployments via `render.yaml`. Database is automatically initialized and seeded on each deployment using `setup:prod`.

**Note:** Render's free tier uses ephemeral filesystems, so the SQLite database resets on restarts.
## 🏗️ Architecture Decisions

### Project Structure

The application follows a **monorepo structure** with separate `backend` and `frontend` directories, allowing independent development and deployment of each service.

### Backend Architecture

**Key Decisions:**
- **SQLite Database**: Chosen for simplicity and ease of setup. Suitable for development and small-scale deployments. Can be easily migrated to PostgreSQL/MySQL for production.
- **JWT Authentication**: Stateless authentication using JWT tokens stored in HTTP-only cookies and Authorization headers for flexibility.
- **In-Memory OTP Storage**: OTP codes stored in memory (Map) for simplicity. In production, consider Redis or a database for distributed systems.
- **RESTful API Design**: Clear separation of concerns with dedicated routes for auth, appointments, and specialties.

### Frontend Architecture

**Component-Based Architecture:**

**Key Decisions:**
- **React Hooks Pattern**: Custom hooks encapsulate business logic and state management, promoting reusability.
- **Vite Build Tool**: Fast development server and optimized production builds.
- **Material-UI**: Consistent design system with pre-built components.
- **Axios for HTTP**: Promise-based HTTP client with interceptors and error handling.
- **Google Calendar Integration**: Implemented using a simple URL-based approach (`googleCalendar.ts`) that opens Google Calendar with pre-filled appointment details. This was intentionally kept as simple as possible to avoid over-engineering. **Note**: In a production application, this method would not be suitable. A proper implementation would require:
  - Google Calendar API integration with OAuth 2.0 authentication
  - Server-side API calls to create calendar events programmatically
  - Event management (create, update, delete) synchronized with appointment changes
  - Proper error handling and user consent flows

### Database Schema

**Relational Design:**
- **users**: Stores user information (id as UUID, phone as unique identifier)
- **doctors**: Stores doctor information (id as auto-increment integer, name)
- **specialties**: Stores medical specialties (id as auto-increment integer, name as unique, description)
- **doctor_specialties**: Junction table for many-to-many relationship between doctors and specialties
- **appointments**: Stores appointment slots (id, doctor_id, date, time, user_id nullable)
  - Unique constraint on (doctor_id, date, time) prevents double-booking
  - user_id is nullable to represent available slots vs booked appointments

**Design Rationale:**
- Normalized schema prevents data duplication
- Junction table allows doctors to have multiple specialties
- Appointment slots are pre-created and assigned to users, simplifying availability queries

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



