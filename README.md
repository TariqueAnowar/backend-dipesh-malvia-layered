# Backend Project

This is a backend project built with Node.js, Express, and MongoDB. The project includes user authentication, contact management, and database connection handling.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Middleware](#middleware)
- [Error Handling](#error-handling)
- [License](#license)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/backend-dipesh-malvia.git
   cd backend-dipesh-malvia
2. Install dependencies:

   ```bash
   npm install
4. Create a .env file in the root directory and add the following environment variables:
   ```bash
   PORT=8001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
6. Start the server:
   ```bash
    npm start
   
## Usage
The server will start on the port specified in the .env file (default is 8001).
The API endpoints can be accessed via http://localhost:8001.
## API Endpoints

### Contacts

- **GET /contacts**  
  Retrieve all contacts (requires authentication).

- **POST /contacts**  
  Create a new contact (requires authentication).

- **GET /contacts/:id**  
  Retrieve a contact by ID (requires authentication).

- **PUT /contacts/:id**  
  Update a contact by ID (requires authentication).

- **DELETE /contacts/:id**  
  Delete a contact by ID (requires authentication).

### Authentication

- **POST /auth/register**  
  Register a new user.

- **POST /auth/login**  
  Login a user and retrieve a JWT token.
## Middleware
validateToken - Middleware to validate JWT tokens for protected routes.
## Error Handling
The project includes error handling for database connection issues and invalid routes.
## Project Structure
   ```bash
     backend-dipesh-malvia/
├── controllers/
│   └── contact.controller.js
├── middleware/
│   └── validateTokenHandler.js
├── models/
│   └── contact.model.js
├── routes/
│   └── contact.routes.js
├── utils/
│   └── serverUtils.js
├── .env
├── app.js
├── server.js
├── package.json
└── README.md


## License
This project is licensed under the MIT License.
  
Make sure to replace `your-username` with your actual GitHub username and `your_mongodb_connection_string` and `your_jwt_secret` with your actual MongoDB connection string and JWT secret, respectively.

Feel free to customize the `README.md` file further based on additional details or features of your project.
Make sure to replace `your-username` with your actual GitHub username and `your_mongodb_connection_string` and `your_jwt_secret` with your actual MongoDB connection string and JWT secret, respectively.

Feel free to customize the `README.md` file further based on additional details or features of your project.
