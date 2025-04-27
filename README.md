![Coverage](https://img.shields.io/badge/coverage-84%25-brightgreen)

# 🚗 CurrentCruiser API

CurrentCruiser API provides a robust, scalable backend solution designed for managing and exploring electric vehicles (EV), including historical data, specifications, user authentication, and comprehensive CRUD operations.

## 🚀 Tech Stack

-   **Runtime:** Node.js (v18.x), TypeScript (ESM)
-   **Framework:** Express.js
-   **Database:** MongoDB (Mongoose)
-   **Testing:** Vitest (unit and integration testing)
-   **Linting & Formatting:** ESLint, Prettier
-   **Deployment:** AWS Lambda via Serverless framework

## 📂 Project Structure

```
current-cruiser-api/
├── assets/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── tests/
├── types/
├── utils/
├── server.ts
├── vitest.config.ts
├── eslint.config.ts
└── serverless.yml
```

-   **Controllers**: Business logic separated clearly from routing.
-   **Middlewares**: Security, authentication, and validation logic.
-   **Models**: MongoDB schemas via Mongoose.
-   **Routes**: Clear and RESTful API endpoints.
-   **Utils**: Utility functions and helpers.

## 🛠️ Getting Started

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/aiwkz/CurrentCruiser.git
cd CurrentCruiser
npm install
```

### Environment Variables

Create a `.env` file from `.env.example`:

```env
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/currentcruiser
JWT_SECRET=your_secret_key_here
```

### Scripts

-   **Development Server:** `npm run dev`
-   **Production Server:** `npm start`
-   **Lint:** `npm run lint`
-   **Test:** `npm test`

## ✅ Testing & Coverage

The API utilizes **Vitest** for comprehensive unit and integration testing. Coverage thresholds:

-   Statements: 80%
-   Functions: 80%
-   Lines: 80%
-   Branches: 75%

Run tests using:

```bash
npm test
```

## 🔒 Security Practices

-   **Helmet:** Protects against common security vulnerabilities.
-   **Express-Rate-Limit:** Protects API from abuse and DDOS attacks.
-   **JWT & Bcrypt:** Secure authentication and password handling.
-   **CORS:** Configured for cross-origin requests.

## ☁️ Deployment (AWS Lambda)

The API is ready to be deployed on AWS Lambda through Serverless Framework:

```bash
npm run predeploy
sls deploy
```

### Architecture

-   **AWS Lambda:** Serverless backend execution.
-   **API Gateway:** HTTP endpoint management.
-   **Scalability:** Automatically scales with traffic without manual intervention.

## 🔎 Validation & Error Handling

### Validation

Data validation and type safety are strictly enforced using TypeScript. Further improvements can utilize validation libraries like Zod or Joi.

### Error Handling

A centralized error handling middleware ensures consistent error responses across the API.

## 📦 Dependencies & Maintenance

The API regularly updates dependencies and performs automated dependency checks via tools like Dependabot or Renovate to maintain security and compatibility.

---

Developed by Federico Javier Perez Patiño
