# ShopHub E-Commerce

Production-style full-stack e-commerce application built as a freelance portfolio and Spring Boot learning project.

**Stack:** Java 21 · Spring Boot 4 · Spring Security + JWT · Spring Data JPA · MySQL · React · Docker

---

## 1. Project overview

ShopHub is a complete e-commerce web application with:

- Customer shopping flows (browse, cart, checkout, orders, profile, addresses)
- Admin management (dashboard, products, categories, inventory, customers, orders)
- Layered Spring Boot backend with DTO-based APIs
- JWT authentication and role-based authorization
- React SPA with protected routes and responsive UI

This is intentionally **not** a toy demo. Business rules such as stock checks, price calculation on the backend, order item price snapshots, and ownership checks are implemented in services.

---

## 2. Features

### Customer

- Register / login / logout
- Browse, search, filter, sort, and paginate products
- Product details
- Cart add / update / remove / clear
- Address management
- Place orders and view order history/details
- Cancel eligible orders
- Update profile and password

### Admin

- Dashboard metrics (users, products, orders, sales, pending orders)
- Product and category CRUD
- Inventory updates
- Customer listing
- Order listing and status updates

---

## 3. Technology stack

| Layer | Technologies |
|---|---|
| Backend | Spring Boot 4.1.1, Spring Web MVC, Spring Data JPA, Hibernate, Spring Security, JWT (jjwt), Bean Validation, Lombok, springdoc OpenAPI |
| Database | MySQL 8 |
| Frontend | React (Vite), React Router, Axios, CSS |
| Testing | JUnit 5, Mockito, Spring MockMvc, H2 (tests) |
| Ops | Maven, Docker, Docker Compose, Git |

---

## 4. Architecture

Backend uses classic layered architecture:

```
controller → service → repository → entity
                ↓
              DTOs / mappers
```

Package root: `com.ecommerce`

Key design choices:

- Controllers stay thin; business rules live in services
- Entities are never returned directly from APIs
- JWT is validated by a servlet filter before authorization checks
- `@Transactional` wraps multi-step order and cart updates
- Public catalog endpoints are open; cart/orders/profile require authentication; admin routes require `ROLE_ADMIN`

---

## 5. Database design

Entities: `User`, `Role`, `Category`, `Product`, `Cart`, `CartItem`, `Address`, `Order`, `OrderItem`

Important relationships:

- User 1—1 Cart
- Cart 1—N CartItem
- Product N—1 Category
- User 1—N Order / Address
- Order 1—N OrderItem
- OrderItem stores **productName** and **price** at purchase time

Enums:

- `RoleName`: ROLE_CUSTOMER, ROLE_ADMIN
- `OrderStatus`: PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
- `PaymentStatus`: PENDING, PAID, FAILED, REFUNDED

**Decision:** On successful checkout, payment status is set to `PAID` to simulate a completed payment gateway. No real payment provider is integrated.

---

## 6. API documentation

With the backend running:

- Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- OpenAPI JSON: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)
- Health: [http://localhost:8080/api/health](http://localhost:8080/api/health)

Main endpoint groups:

- `/api/auth/**`
- `/api/products/**`
- `/api/categories/**`
- `/api/cart/**`
- `/api/orders/**`
- `/api/addresses/**`
- `/api/users/me/**`
- `/api/admin/**`

---

## 7. Authentication flow

1. Customer registers via `POST /api/auth/register` (always assigned `ROLE_CUSTOMER`)
2. Login via `POST /api/auth/login`
3. Backend returns a signed JWT + user profile
4. Frontend stores the token and sends `Authorization: Bearer <token>`
5. `JwtAuthenticationFilter` validates the token and populates `SecurityContext`
6. Method/URL security enforces customer vs admin access

Default seeded admin (change in production):

- Email: `admin@ecommerce.local`
- Password: `Admin@12345`

---

## 8. How to run locally

### Prerequisites

- JDK 21+
- Maven 3.9+
- Node.js 20+
- MySQL 8

### Database

Create MySQL (or let the JDBC URL create the schema database):

```sql
CREATE DATABASE ecommerce_db;
```

### Backend

```bash
cd backend
set DB_USERNAME=root
set DB_PASSWORD=your-password
set JWT_SECRET=replace-with-a-long-random-secret-at-least-32-chars
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 9. Environment variables

See `.env.example` for the full list.

| Variable | Purpose |
|---|---|
| `DB_HOST` / `DB_PORT` / `DB_NAME` | MySQL connection |
| `DB_USERNAME` / `DB_PASSWORD` | DB credentials |
| `JWT_SECRET` | HMAC signing secret (long random value) |
| `JWT_EXPIRATION_MS` | Token lifetime |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins |
| `APP_ADMIN_EMAIL` / `APP_ADMIN_PASSWORD` | Bootstrap admin |
| `APP_SEED_SAMPLE_DATA` | Seed demo catalog |
| `VITE_API_URL` | Frontend API base URL |

Never commit real secrets.

---

## 10. Docker instructions

```bash
docker compose up --build
```

Services:

- MySQL → `localhost:3306`
- Backend → `http://localhost:8080`
- Frontend → `http://localhost:3000`

Stop:

```bash
docker compose down
```

---

## 11. Screenshots

Add portfolio screenshots here after running the app:

- Home / product listing
- Product details + cart
- Checkout and order details
- Admin dashboard
- Swagger UI

---

## 12. Testing

```bash
cd backend
mvn test
```

Coverage includes:

- Auth registration/login unit tests
- Product create/retrieve/deactivate
- Cart stock validation
- Order placement, stock reduction, cancellation rules
- Integration test for JWT access and admin authorization denial

---

## 13. Future improvements

- Flyway/Liquibase migrations instead of `ddl-auto=update`
- Real payment gateway (Stripe/Razorpay)
- Product image upload to object storage
- Refresh tokens / token blacklist
- Email notifications for order status
- CI pipeline (GitHub Actions)
- Rate limiting and audit logging

---

## Project structure

```
ecommerce/
  backend/          Spring Boot API
  frontend/         React SPA
  docker-compose.yml
  .env.example
  README.md
```

---

## License

Portfolio / educational use.
