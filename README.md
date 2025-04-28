# 🗒️ Notes API

A RESTful API for managing user notes with:

- ✅ JWT-based authentication
- 👥 Role-Based Access Control (RBAC)
- 📄 Pagination, Filtering, and Sorting support for listing notes
- 🔐 Secure password hashing with bcrypt
- ⚡ Centralized error handling

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
```env
PORT=3001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. **Start the server**

```bash
npm run dev
```
_(assuming `nodemon` is setup with script `"dev": "nodemon app.js"`)_

---

## 📬 API Endpoints

### Auth Routes
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login user and get JWT token
- `GET /api/auth/me` — Get logged-in user's information (Protected)

### Notes Routes
- `GET /api/notes` — Get all user notes (Protected, Paginated, Filtered, Sorted)
- `POST /api/notes` — Create a new note (Protected)
- `PUT /api/notes/id:{id}` — Update a note by ID (Protected)
- `DELETE /api/notes/id:{id}` — Delete a note by ID (Protected)

---

## 📖 Query Features for `/api/notes`

You can use **query parameters** for advanced listing:

| Feature | Example | Description |
|:---|:---|:---|
| Pagination | `?page=2&limit=10` | 2nd page, 10 notes per page |
| Sorting | `?sort=createdAt` | Sort by creation date (ascending) |
| Reverse Sorting | `?sort=-createdAt` | Sort by creation date (descending) |
| Filtering | `?isImportant=true` | Filter notes where `isImportant` is `true` |
| Combined | `?isImportant=true&sort=-createdAt&page=1&limit=5` | Combined filtering, sorting and pagination |

---

## 🔥 Features

- User registration & secure login
- JWT Authentication
- Role-Based Access Control (RBAC) for protected routes
- CRUD operations for user notes
- **Advanced Pagination, Filtering and Sorting** for listing notes
- MongoDB database integration
- Password hashing using bcrypt
- **Centralized error handling** for better API responses
- Highly scalable structure

