<div align="center">
  <img src="frontend/public/LOGOV.png" alt="VSneakers Logo" height="80"/>

  <h1>VSneakers — Premium Sneaker E-Commerce Platform</h1>

  <p>
    A modern, sleek, and high-performance e-commerce platform dedicated to authentic sneakers.<br/>
    Clean Architecture · Secure · Optimized Performance · Premium Design
  </p>

  [![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
  [![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![JWT](https://img.shields.io/badge/Auth-JWT_Cookie-000000?style=for-the-badge&logo=json-web-tokens)](https://jwt.io/)
  [![VNPAY](https://img.shields.io/badge/Payment-VNPAY-blueviolet?style=for-the-badge)](https://vnpay.vn/)

  **[🌐 Live Demo](http://localhost:5173)**
</div>

---

## 📑 Table of Contents

- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)

---

## ✨ Features

### 🛍️ Customer Experience
| Feature | Description |
|---|---|
| Modern UI/UX | Clean, premium design with a white/orange theme, soft borders, and smooth micro-animations. |
| Search & Filter | Advanced filtering by categories, price ranges, sale items, and flexible sorting. |
| Smart Cart | Synchronizes cart state between guest users (localStorage) and authenticated accounts (backend). |
| Product Variants | Select exact Shoe Size (EU, US, UK) with specific stock tracking per SKU. |
| Fit Predictor | Built-in Size Guide Modal with a smart fit predictor based on foot length and width. |
| Coupon System | Apply discount codes (percentage or fixed amount) with minimum order validation. |
| Secure Checkout | Integrated with **VNPAY QR** (IPN callback, checksum secure) and **COD** methods. |
| Wishlist | Save favorite products, synchronized with user account. |
| Reviews | Verified purchases only. Customers can rate and review received products. |

### 🛡️ Security
| Mechanism | Details |
|---|---|
| Authentication | Spring Security 6 + JWT stored securely in **HttpOnly Cookies** (mitigates XSS attacks). |
| Authorization | Role-based access control (`ROLE_USER` / `ROLE_ADMIN`) using `@PreAuthorize`. |
| Password Encryption | **BCrypt** hashing. |
| Rate Limiting | Bucket4j implementation — restricts login/register endpoints to prevent brute force attacks. |
| Token Blacklist | Invalidates JWT immediately upon logout. |
| CORS | Environment-based configuration, strict origin policies. |

### 📊 Admin Dashboard
- **Analytics**: Revenue charts, top-selling products, and user statistics.
- **Product Management**: CRUD operations, multi-image upload via **Cloudinary**, variant & stock management.
- **Order Management**: Track and update order statuses (`PENDING → CONFIRMED → SHIPPING → DELIVERED`), automatic stock restoration on cancellation.
- **User Management**: View customer list, toggle active/inactive accounts.
- **Coupon Management**: Create, edit, and schedule promotional codes.
- **Media Management**: Dynamic Hero Banner configuration using drag-and-drop uploads.

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                               │
│   React 18 + Vite · Zustand · React Router v6 · Axios       │
│   Tailwind CSS · Framer Motion · GSAP · React Hot Toast     │
└────────────────────────┬────────────────────────────────────┘
                         │  HTTP / REST API (JSON)
                         │  HttpOnly Cookie (JWT)
┌────────────────────────▼────────────────────────────────────┐
│                       BACKEND                               │
│   Spring Boot 3.2 · Spring Security 6 · Spring Data JPA     │
│   JWT (JJWT 0.12) · Bucket4j · Caffeine Cache               │
│   JavaMailSender · Cloudinary SDK · VNPAY SDK               │
└────────────────────────┬────────────────────────────────────┘
                         │  JDBC
┌────────────────────────▼────────────────────────────────────┐
│                      DATABASE                               │
│            PostgreSQL (Neon Serverless DB)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```text
vsneaker/
├── backend/                  # Spring Boot application
│   ├── src/main/java/        # Java source code (Clean Architecture)
│   ├── src/main/resources/   # application.yml and static assets
│   └── pom.xml               # Maven dependencies
│
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/       # Reusable UI components (Admin & Client)
│   │   ├── pages/            # Route-level page components
│   │   ├── services/         # API client & axios instances
│   │   ├── store/            # Zustand state management
│   │   ├── hooks/            # Custom React hooks
│   │   └── utils/            # Helper functions
│   ├── public/               # Static assets (LOGOV.png, etc.)
│   ├── index.css             # Tailwind config and global styles
│   └── vite.config.js        # Vite configuration
│
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
| Tool | Minimum Version |
|------|---------------------|
| Java JDK | 17+ |
| Maven | 3.9+ |
| Node.js | 18+ |
| PostgreSQL | 15+ |

---


### 1. Database Setup
Ensure you have a PostgreSQL database running (or use Neon DB).
```sql
CREATE DATABASE vsneakers;
```
> Note: Hibernate will automatically generate the schema on startup if `ddl-auto: update` is set in the configuration.

### 2. Run Backend Server

Configure your environment variables in `backend/src/main/resources/application.yml` or via your system environment (see [Environment Variables](#-environment-variables) section below).

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

> 📍 Backend runs on: `http://localhost:8081`  
> 📄 Swagger UI Docs: `http://localhost:8081/swagger-ui.html`

### 3. Run Frontend Client

```bash
cd frontend
npm install
npm run dev
```

> 📍 Frontend runs on: `http://localhost:5173`  
> Note: API requests are automatically proxied to `http://localhost:8081` via Vite's proxy configuration in development.

---

## 🔑 Environment Variables

### Backend (`backend/src/main/resources/application.yml`)

Make sure the following variables are properly configured before starting the Spring Boot application:

| Variable | Description | Required |
|------|--------|----------|
| `DB_URL` | PostgreSQL JDBC URL (e.g., `jdbc:postgresql://localhost:5432/vsneakers`) | ✅ |
| `DB_USERNAME` | Database username | ✅ |
| `DB_PASSWORD` | Database password | ✅ |
| `JWT_SECRET` | Secret key for JWT signing (≥ 64 characters) | ✅ |
| `MAIL_USERNAME` | SMTP Email address (for password resets/order confirmations) | ✅ |
| `MAIL_PASSWORD` | SMTP App Password | ✅ |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | ✅ |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | ✅ |
| `VNPAY_TMN_CODE` | VNPay Terminal Code | ✅ |
| `VNPAY_HASH_SECRET` | VNPay Hash Secret | ✅ |
| `ALLOWED_ORIGINS` | CORS allowed origins (e.g., `http://localhost:5173`) | ✅ |

> ⚠️ **SECURITY WARNING: Do not commit actual secrets or credentials to public Git repositories.**

### Frontend (`frontend/.env.local`)

Optional if using Vite's built-in proxy during development. For production:
```env
VITE_API_URL=http://your-backend-domain.com/api/v1
```

---

## 📡 API Overview

Base URL: `http://localhost:8081/api/v1`

| Module | Endpoint Prefix | Authentication Required |
|--------|----------------|--------------|
| Authentication | `/auth/**` | Public |
| Products | `/products/**` | Public |
| Categories | `/categories/**` | Public |
| Reviews | `/reviews/**` | Public (GET), Authenticated (POST) |
| Cart | `/cart/**` | Authenticated |
| Orders | `/orders/**` | Authenticated |
| Payment | `/payment/**` | Authenticated / Public (IPN Webhook) |
| Wishlist | `/wishlist/**` | Authenticated |
| Profile | `/users/**` | Authenticated |
| Admin | `/admin/**` | Admin Only (`ROLE_ADMIN`) |

> 📄 For full API documentation, visit the Swagger UI at `http://localhost:8081/swagger-ui.html` when the backend is running.

---

<div align="center">
  <i>© 2024 – 2026 VSneakers. Built with ☕ Java & ⚛️ React.</i>
</div>
