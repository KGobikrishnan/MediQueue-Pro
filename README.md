# 🏥 MediQueue Pro — Enterprise Hospital OPD & Live Queue Management System

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-RBAC-orange?style=for-the-badge&logo=jsonwebtokens)](https://jwt.io/)
[![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-red?style=for-the-badge&logo=socketdotio)](https://spring.io/guides/gs/messaging-stomp-websocket/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

> **MediQueue Pro (MQP)** is a full-stack, enterprise-grade Hospital Outpatient Department (OPD) & Token Queue Orchestration Platform built with **Spring Boot 3 (Java 21)**, **PostgreSQL (`MQP`)**, and **React 19**. 
> Designed to solve real-world OPD congestion, emergency triage delays, manual prescription handwriting errors, and patient wait-time opacity.

---

## 🌟 Key Highlights & Enterprise Architecture

* **Cinema-Grade Waiting Room Display TV (`/live-queue`)**: Dynamic multi-department live token board with audio chimes and automated Web Speech voice synthesizer announcing called tokens (`"Token CARD-102, Dr. Sarah Jenkins, Room 204"`).
* **3-Tier Triage Intelligence**: Smart emergency classification (`STANDARD`, `URGENT`, `EMERGENCY`) dynamically reordering patient queues based on vitals (BP, SpO2, Heart Rate, Glucose).
* **Digital Prescription & EHR Generation**: Real-time consultation stopwatch, digital Rx builder with dosages, instructions, diagnosis, and instantaneous multi-page vector **PDF exports**.
* **Live STOMP WebSockets**: Multi-terminal live sync across Reception, Doctor Consultation Room, and Public TV displays with zero screen refresh.
* **Biometric & PIN Timeout Lock**: Auto-locking screens after inactivity with 4-digit PIN unlock for hospital security and HIPAA/NABH compliance.
* **Role-Based Access Control (RBAC)**: Distinct workflows tailored for **ADMIN**, **DOCTOR**, **RECEPTIONIST**, and **PATIENT**.

---

## 🛠️ Technology Stack

### Backend
* **Language & Runtime**: Java 21 / OpenJDK
* **Framework**: Spring Boot 3.3.4
* **Security & Auth**: Spring Security 6, JJWT (HMAC-SHA256), PIN fallback verification
* **ORM & Database**: Spring Data JPA, Hibernate ORM, PostgreSQL Driver
* **Real-time Messaging**: Spring WebSocket with STOMP in-memory message broker
* **Build Tool**: Apache Maven (Wrapper configured)
* **Architecture**: Clean Tiered Architecture (`Controller` ➔ `Service` ➔ `Repository` ➔ `Entity` ➔ `DTO`)

### Frontend
* **Core**: React 19, Vite 8, JavaScript (ESNext)
* **Styling**: Tailored Modern CSS Architecture (Glassmorphism, Dark Modes, Vibrant HSL Palette)
* **Icons & Animation**: Lucide React, Framer Motion, Canvas Confetti
* **Charts & Analytics**: Recharts (Hourly footfall, department workload distribution)
* **PDF Engine**: jsPDF & jsPDF-AutoTable (Hospital letterhead, Rx schedules)
* **Audio**: HTML5 Web Audio API chimes & Web Speech Synthesis

### Database
* **PostgreSQL Engine**: Relational schema named `MQP`
* **Tables**: `users`, `departments`, `doctors`, `doctor_schedules`, `patients`, `vitals`, `tokens`, `prescriptions`, `prescription_medicines`, `notifications`

---

## 👥 Role-Based Portals & Workflows

| Role | Portal / View | Features |
| :--- | :--- | :--- |
| **Admin** | `/admin` | Hospital analytics, hourly OPD footfall, doctor onboarding with credentials, patient EHR directory with visit records & PDF downloads. |
| **Doctor** | `/doctor` | Live consultation room, patient queue caller, active consultation stopwatch, past vitals tracker, digital prescription writer. |
| **Receptionist** | `/reception` | Walk-in patient registration, phone autocomplete, vitals triage scoring (BP/SpO2/Sugar), instant thermal token receipt generation. |
| **Patient** | `/patient` | Live queue position tracker, estimated wait time countdown, digital prescription archive, direct PDF downloads. |
| **Public TV** | `/live-queue` | Fullscreen waiting hall display with audio chime notifications, active token callouts, and multi-department grids. |

---

## 📂 Project Directory Structure

```text
MediQueue-Pro/
├── schema.sql                     # PostgreSQL Database schema definition
├── seed_data.sql                  # Realistic hospital demo data seed
├── backend/                       # Spring Boot 3 Backend
│   ├── pom.xml                    # Maven dependencies & build plugins
│   └── src/
│       ├── main/
│       │   ├── java/com/mediqueue/pro/
│       │   │   ├── config/        # SecurityConfig, CORS
│       │   │   ├── controller/    # Auth, Queue, Admin, Prescription, Dept APIs
│       │   │   ├── dto/           # Strongly typed DTO models
│       │   │   ├── entity/        # JPA Entities (User, Doctor, Token, etc.)
│       │   │   ├── enums/         # Role, DoctorStatus, TokenStatus, TriagePriority
│       │   │   ├── repository/    # Spring Data JPA Repositories
│       │   │   ├── security/      # JwtUtils, JwtAuthenticationFilter
│       │   │   ├── service/       # Business logic (Queue, Admin, Auth, Rx)
│       │   │   ├── websocket/     # STOMP broker configuration
│       │   │   └── MediQueueApplication.java
│       │   └── resources/
│       │       └── application.properties # DB connection (MQP) & server port 8080
├── frontend/                      # React 19 + Vite Frontend
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── api/                   # Axios client with JWT interceptors
│       ├── components/            # Layouts (3-column rail), Navbar, Cards
│       ├── context/               # AuthContext, QueueContext
│       ├── pages/                 # Admin, Doctor, Receptionist, Patient, Display
│       ├── utils/                 # Audio helper, PDF generator, constants
│       └── App.jsx
└── README.md
```

---

## ⚡ Quick Start Guide

### Prerequisites
* **Java 17 or Java 21+** (`java -version`)
* **Maven 3.8+** (or use `./mvnw`)
* **Node.js 18+** & **npm** (`node -v`)
* **PostgreSQL 14+** running locally on default port `5432`

---

### 1. Database Setup (`PostgreSQL`)

1. Connect to PostgreSQL and create the database:
   ```bash
   psql -U postgres -c "CREATE DATABASE \"MQP\";"
   ```

2. Load the schema and seed data:
   ```bash
   psql -U postgres -d MQP -f schema.sql
   psql -U postgres -d MQP -f seed_data.sql
   ```

---

### 2. Backend Setup (`Spring Boot`)

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Verify or update `src/main/resources/application.properties` with your PostgreSQL credentials:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/MQP
   spring.datasource.username=postgres
   spring.datasource.password=postgres
   server.port=8080
   ```

3. Build and run the backend:
   ```bash
   ./mvnw clean package -DskipTests
   java -jar target/mediqueue-api-1.0.0-SNAPSHOT.jar
   # Or run directly via Maven:
   ./mvnw spring-boot:run
   ```

Backend will be accessible at **`http://localhost:8080`**.

---

### 3. Frontend Setup (`React + Vite`)

1. Navigate to the `frontend` directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

Frontend will be accessible at **`http://localhost:5173`**.

---

## 🔐 Demo Credentials

| Role | Email | Password / PIN | Description |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@mediqueue.pro` | `password123` / PIN: `1234` | Full administration & analytics |
| **Doctor** | `sarah.jenkins@mediqueue.pro` | `password123` / PIN: `1234` | Senior Cardiologist (Room 204) |
| **Receptionist**| `reception.opd@mediqueue.pro` | `password123` / PIN: `1234` | OPD Desk 1 walk-in coordinator |
| **Patient** | `karthik.r@example.com` | `password123` / PIN: `1234` | Verified OPD Patient (`CARD-101`) |

---

## 📡 REST API Specifications

### Authentication
* `POST /api/v1/auth/login` — Authenticate and receive JWT token + profile

### Queue Management
* `GET /api/v1/queue/display` — Public waiting hall live summary
* `POST /api/v1/queue/tokens` — Walk-in registration with vitals triage
* `PATCH /api/v1/queue/tokens/{id}/status` — Transition token status (`CALLED`, `IN_CONSULTATION`, `COMPLETED`)
* `GET /api/v1/queue/doctor/{doctorId}` — Doctor's assigned live queue
* `GET /api/v1/queue/department/{departmentId}` — Department queue list

### Prescriptions & EHR
* `POST /api/v1/prescriptions` — Create digital prescription with medications
* `GET /api/v1/prescriptions/patient/{patientId}` — Historical Rx records
* `GET /api/v1/prescriptions/{id}` — Single prescription detail

### Administration
* `GET /api/v1/admin/analytics` — OPD footfall & department workload stats
* `GET /api/v1/admin/doctors` — List all registered doctors
* `POST /api/v1/admin/doctors` — Onboard new doctor with system account
* `PUT /api/v1/admin/doctors/{id}` — Update doctor details
* `DELETE /api/v1/admin/doctors/{id}` — Remove doctor
* `GET /api/v1/admin/patients?search=...` — Search patient EHR directory

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

Made with ❤️ by [KGobikrishnan](https://github.com/KGobikrishnan)
