# Secrets Application

A simple web application that allows users to register, log in, and view a secrets page. This project demonstrates user authentication with Express.js, Passport.js, bcrypt for password hashing, and PostgreSQL for database management.

## Features

- User registration with hashed passwords
- User login with session management
- Protected route that requires authentication
- User logout

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- Passport.js
- bcrypt
- dotenv
- EJS (Embedded JavaScript templates)

## Setup and Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/secrets-app.git
   cd secrets-app
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up the PostgreSQL database:**

   - Create a PostgreSQL database named `secrets`.
   - Create a `users` table:

     ```sql
     CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       email VARCHAR(255) NOT NULL UNIQUE,
       password VARCHAR(255) NOT NULL
     );
     ```

4. **Create a `.env` file in the root of the project and add the following environment variables:**

   ```env
   PORT=*********
   SESSION_SECRET=*********
   SALT_ROUNDS=*********
   HOST=*********
   DATABASE=*********
   USER=*********
   PG_PORT=*********
   PASSWORD=*********
   ```

   Adjust these values according to your PostgreSQL setup.

5. **Start the application:**

   ```sh
   npm start
   ```

   The application will run on `http://localhost:3000`.

## Project Structure

```bash
.
├── public
│   └── # Static files (CSS, JS, images)
├── views
│   ├── home.ejs
│   ├── login.ejs
│   ├── register.ejs
│   └── secrets.ejs
├── .env
├── package.json
└── server.js
```
