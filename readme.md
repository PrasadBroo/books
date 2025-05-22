# Book Review API

A simple API for managing users, books, and their reviews. Built with **TypeScript**, **Drizzle ORM**, and supports **API versioning** for scalable development.

## 🚀 Project Setup

Follow the steps below to set up and run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/PrasadBroo/books.git
cd book-review-api
```

### 2. Build the Project

```js
npm install
npm run build
```

### 3. Set Up Environment Variables

```bash
cp .env.template .env
```

Edit the .env file and make sure to set the DATABASE_URL. This variable is required.

#### Example:

```bash
DATABASE_URL=postgres://username:password@localhost:5432/books
```

### 4. Create the Database

```sql
CREATE DATABASE books;
```

Update your .env file with the correct database connection string.

### 5. Generate schema

```bash
npm run db:generate
```

### 6. Start the Application

```bash
npm start
```

### 7. ER Diagram/ DB Schema
![ERD Screenshot](er_diagram.png)

# 📦 Design Considerations

- ✅ **API Versioning**: All endpoints are prefixed with `/api/v1/` to support future upgrades.
- 🧱 **Drizzle ORM**: Used for type-safe and modern SQL operations.
- 🧑‍💻 **TypeScript**: Ensures type safety, scalability, and maintainability.

# 📡 Example API Requests

Use the following curl commands or Postman to test API functionality:

### Create User

```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "prasad1234s",
    "email": "prasad@exampls.com",
    "password": "Test@123",
    "firstName": "Prasad",
    "lastName": "Bro",
    "age": 18
  }'
```

### Login User

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "prasad@exampls.com",
    "password": "Test@123",
  }'
```

### Create Book

```bash
curl -X POST http://localhost:3000/api/v1/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "description": "book description",
    "title": "book title",
    "author": "book author",
    "publicationDate": "24-12-2025",
    "genre": "abc",
    "pageCount": 200
  }'
```

### Get Books

```bash
curl -X GET "http://localhost:3000/api/v1/books?limit=10&page=1&search=atomic" \
  -H "Content-Type: application/json"
```

### Get Book By Id

```bash
curl -X GET http://localhost:3000/api/v1/books/:book_id \
  -H "Content-Type: application/json"
```

### Create Review

```bash
curl -X POST http://localhost:3000/api/v1/books/:book_id/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "rating": 5,
    "text": "i liked it"
}'
```

### Update Review

```bash
curl -X PUT http://localhost:3000/api/v1/reviews/:review_id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "rating": 5,
    "text": "i liked it"
}'
```

### Delete Review

```bash
curl -X DELETE http://localhost:3000/api/v1/reviews/:review_id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "rating": 5,
    "text": "i liked it"
}'
```

### Search Books

```bash
curl -X GET http://localhost:3000/api/v1/search?search=titleOrAuthor&limit=10&page=1 \
  -H "Content-Type: application/json" \

```
