# CurrentCruiser-API

Final proyect for FullStack module for the Professional Master in Web Development and Conceptualization at CEI Valencia

## Introduction

Welcome to **CurrentCruiser**, the final project for the FullStack module of the Professional Master in Web Development and Conceptualization at CEI Valencia. This project aims to create a comprehensive platform focusing on electric cars, including their history, available brands and models, technological advancements, and user-generated lists of favorite electric cars.

## Project Description

The CurrentCruiser API is a backend service designed to manage car listings and user-created lists of cars. It provides endpoints for registering and authenticating users, managing car data, creating and manipulating user-specific lists, and basic user profile management.

## Features

-   User Authentication: Users can register, log in, and log out.
-   Car Management: CRUD (Create, Read, Update, Delete) operations for car listings.
-   List Management: CRUD operations for user-created lists of cars.
-   User Profile Management: Update and delete user profiles.
-   Role-Based Access Control: Regular users have restricted access, while admin users have full access to all resources.
-   Error Handling and Logging: Middleware is implemented to handle errors uniformly and log relevant information for debugging.

The API is built using Node.js and Express.js, with MongoDB as the database. It utilizes JSON Web Tokens (JWT) for authentication and authorization, ensuring secure access to resources. Input validation and sanitization are implemented to prevent common security vulnerabilities.

This API serves as the backend for a web or mobile application, allowing users to browse, create, and manage car listings and custom lists based on their preferences.

## Technologies Used

-   Node.js
-   Express.js
-   MongoDB

## Installation

1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies with `npm install`.
4. Set up environment variables:
    - Create a `.env` file in the root directory.
    - Define the following variables in the `.env` file:
        ```
        PORT=8080
        MONGODB_URI=<your_mongodb_uri>
        JWT_SECRET=<your_jwt_secret>
        ```
5. Start the server with `npm start`.

## API Endpoints

### Authentication

-   `POST /api/auth/register`: Register a new user.
-   `POST /api/auth/login`: Log in an existing user.
-   `GET /api/auth/logout`: Log out the current user.

### Cars

-   `POST /api/cars/create`: Create a new car.
-   `GET /api/cars/all`: Get all cars.
-   `GET /api/cars/:id`: Get a car by ID.
-   `PUT /api/cars/:id`: Update a car by ID.
-   `DELETE /api/cars/:id`: Delete a car by ID.

### Lists

-   `POST /api/lists/create`: Create a new list.
-   `GET /api/lists/all`: Get all lists.
-   `GET /api/lists/:id`: Get a list by ID.
-   `GET /api/lists/user/:userId`: Get lists by user ID.
-   `PUT /api/lists/:id`: Update a list by ID.
-   `DELETE /api/lists/:id`: Delete a list by ID.

### Users

-   `GET /api/users/:id`: Get user profile by ID.
-   `PUT /api/users/:id`: Update user profile by ID.
-   `DELETE /api/users/:id`: Delete user profile by ID.

## Error Handling

Error handling middleware is implemented to catch and respond to errors uniformly across the API.

## Logging

Errors and other relevant information are logged using middleware to aid in debugging and monitoring.

## Authorization

-   Regular users can access CRUD operations for lists and cars, and read-only operations for users.
-   Admin users have full access to CRUD operations for all resources.

## Security

-   JWT (JSON Web Tokens) are used for authentication and authorization.
-   Passwords are hashed before being stored in the database.
-   Input validation and sanitization are implemented to prevent common security vulnerabilities.

## Acknowledgements

We would like to express my gratitude to Tomás Sánchez for his guidance and support throughout the FullStack module, giving all the tools and knowledge needed for the development of this project.
