    # 🗒️ Notes API

A RESTful API for managing user notes with:

- ✅ JWT-based authentication
- 👥 Role-Based Access Control (RBAC)
- 📄 Pagination support for listing notes
- 🔐 Secure password hashing with bcrypt

---

## 🚀 Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs

---

## 📦 Setup Instructions

1. **Clone the repo**

```bash
git clone https://github.com/your-username/notes-api.git
cd notes-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Create a `.env` file**  
Add the following environment variables:
```bash
PORT=3001
JWT_SECRET=your_jwt_secret_key
```

4. **Start the server**

```bash
npm nodemon app.js
```

---

## 📬 API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get JWT token
- `GET /api/auth/me` - Get logged-in user's information (Protected)

### Notes Routes
- `GET /api/notes` - Get all user notes (Protected, Paginated)
- `POST /api/notes` - Create a new note (Protected)
- `PUT /api/notes/id:{id}` - Update a note by ID (Protected)
- `DELETE /api/notes/id:{id}` - Delete a note by ID (Protected)

---

## 🔥 Features

- User registration & login
- JWT Authentication
- Role-Based Access Control (RBAC)
- CRUD operations for notes
- Pagination for listing notes
- MongoDB database integration
- Password hashing with bcrypt
- Centralized error handling
