# Evently - Student Event & OD Management System

A full-stack student event and OD (On-Duty) management system built with Spring Boot microservices and React + TypeScript.

## Project Structure

```
Evently/
├── backend/
│   └── EventManagementBackend/
│       ├── gateway-service/      # API Gateway (Port 8080)
│       ├── student-service/      # Student Service (Port 8081)
│       ├── faculty-service/     # Faculty Service (Port 8082)
│       └── event-service/       # Event & OD Service (Port 8083)
│
└── frontend/                   # React + TypeScript + TailwindCSS (Port 5173)
```

## Backend

### Architecture

The backend consists of 4 independent Spring Boot microservices:

| Service | Port | Purpose |
|---------|------|---------|
| gateway-service | 8080 | API Gateway, JWT authentication, request routing |
| student-service | 8081 | Student registration and login |
| faculty-service | 8082 | Faculty registration and login |
| event-service | 8083 | Events management and OD requests |

### Database

- MongoDB (single database: `EventsMgmtDB`)
- Connection URI: `mongodb://localhost:27017/EventsMgmtDB`

### Service Details

#### Gateway Service
- Acts as a reverse proxy forwarding requests to appropriate services
- Validates JWT tokens and injects `X-User-Email`, `X-User-Role`, `X-User-Id` headers
- Configures CORS for frontend access

#### Student Service
- Endpoints: `/student/register`, `/student/login`
- Model: `studentName`, `studentRollNumber`, `emailId`, `password`, `role`

#### Faculty Service
- Endpoints: `/faculty/register`, `/faculty/login`
- Model: `facultyName`, `facultyId`, `emailId`, `password`, `role`

#### Event Service
- Events endpoints: `GET /events/verified`
- OD endpoints:
  - `POST /od/apply` - Student submits OD request (status: PENDING)
  - `GET /od/pending` - Faculty views pending ODs
  - `PUT /od/approve/{id}` - Faculty approves OD (auto-creates event if manual entry)
  - `PUT /od/reject/{id}` - Faculty rejects OD
  - `GET /od/by-month` - View approved ODs filtered by month
  - `GET /od/my-ods` - Student views their own OD requests

### Package Structure (per microservice)

Each service follows the same layered architecture:

```
src/main/java/com/eventmanagementapp/<service>/
├── <ServiceApplication>.java       # Main entry point
├── model/                          # MongoDB documents (@Document)
├── repository/                     # MongoRepository interfaces
├── service/                        # Business logic
├── controller/                     # REST endpoints
├── dto/                            # Data transfer objects
└── config/                         # Configuration classes (RestTemplate, etc.)
```

## Frontend

- **Framework**: React 19 + TypeScript
- **Styling**: TailwindCSS 3
- **Routing**: react-router-dom
- **Build Tool**: Vite

### Page Routes

| Path | Component | Access |
|------|-----------|--------|
| `/` | Login | Public |
| `/register` | Student Registration | Public |
| `/student/dashboard` | Student OD Status | Student only |
| `/student/apply` | Apply for OD | Student only |
| `/faculty/dashboard` | Pending ODs | Faculty only |
| `/faculty/records` | OD Records by Month | Faculty only |

## Setup Instructions

### Prerequisites

- Java JDK 17
- Maven 3.6+
- Node.js 18+
- MongoDB 5+
- IntelliJ IDEA (recommended for backend)

### Backend Setup

1. Open the `backend/EventManagementBackend` folder in IntelliJ IDEA as a Maven project.

2. Ensure you have JDK 17 configured:
   - Go to File > Project Structure > Project
   - Set Project SDK to Java 17
   - Set Language Level to 17

3. Start MongoDB:
   ```bash
   mongod
   ```

4. Run each microservice from IntelliJ or via terminal:
   ```bash
   cd backend/EventManagementBackend
   ./mvnw spring-boot:run -pl gateway-service   # Port 8080
   ./mvnw spring-boot:run -pl student-service   # Port 8081
   ./mvnw spring-boot:run -pl faculty-service   # Port 8082
   ./mvnw spring-boot:run -pl event-service     # Port 8083
   ```

   Alternatively, run all services together:
   ```bash
   ./mvnw spring-boot:run
   ```

Local development defaults:
- MongoDB URI: `mongodb://localhost:27017/EventsMgmtDB`
- Gateway downstream URLs:
  - `http://localhost:8081`
  - `http://localhost:8082`
  - `http://localhost:8083`

Docker deployment overrides these with container hostnames through `docker-compose.yml`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Access the application at: `http://localhost:5173`

## Faculty Access

The frontend does not have a faculty registration page. Create faculty users through the gateway API, then log in from the frontend.

### Register a Faculty User

Run this after the gateway service and faculty service are up:

```bash
curl -X POST http://localhost:8080/api/faculty/register \
  -H "Content-Type: application/json" \
  -d '{
    "facultyName": "Test Faculty",
    "facultyId": "FAC001",
    "emailId": "faculty@test.com",
    "password": "pass123"
  }'
```

Expected success response:

```json
{
  "emailId": "faculty@test.com",
  "facultyId": "FAC001",
  "facultyName": "Test Faculty",
  "id": "...",
  "password": null,
  "role": "FACULTY"
}
```

### Log In As Faculty

1. Open `http://localhost:5173`
2. On the login page, set `Login As` to `Faculty`
3. Enter the faculty email and password used during registration
4. Submit the form to reach `/faculty/dashboard`

If the browser is holding stale auth state from a previous session, clear it once in devtools:

```js
localStorage.clear()
```

Then refresh the page and log in again.

## API Endpoints

All API calls from the frontend go through the gateway at `http://localhost:8080/api/`

### Student Endpoints
- `POST /api/student/register` - Register new student
- `POST /api/student/login` - Student login

### Faculty Endpoints
- `POST /api/faculty/register` - Register new faculty
- `POST /api/faculty/login` - Faculty login

### Event Endpoints
- `GET /api/events/verified` - Get all verified events

### OD Endpoints
- `POST /api/od/apply` - Submit OD request
- `GET /api/od/pending` - Get pending OD requests
- `PUT /api/od/approve/{id}` - Approve OD request
- `PUT /api/od/reject/{id}` - Reject OD request
- `GET /api/od/by-month?year={year}&month={month}` - Get ODs by month
- `GET /api/od/my-ods` - Get current student's OD requests

## Authentication Flow

1. User logs in via `/api/student/login` or `/api/faculty/login`
2. Server returns a JWT token
3. Frontend stores token in localStorage
4. All subsequent API calls include `Authorization: Bearer {token}` header
5. Gateway validates token and forwards user info via headers to downstream services

## Environment

- MongoDB must be running on default port 27017
- All backend services must be running before the frontend
- Frontend connects to Gateway at http://localhost:8080
