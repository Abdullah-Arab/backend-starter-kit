# Express TypeScript Backend Starter Kit

A robust, production-ready backend starter kit built with Express.js and TypeScript, following best practices for modern API development.

## Features

- **TypeScript** - Type-safe development experience
- **Express.js** - Fast, unopinionated, minimalist web framework
- **PostgreSQL** - Powerful, open-source relational database
- **Knex.js** - Flexible SQL query builder
- **RESTful API** - Structured API endpoints with versioning
- **Request Validation** - Schema validation using TypeBox
- **Error Handling** - Centralized error handling middleware
- **Environment Configuration** - Dotenv for environment variables
- **CORS Support** - Cross-Origin Resource Sharing enabled
- **Pagination** - Built-in pagination for list endpoints
- **Database Migrations** - Version control for your database schema
- **Database Seeding** - Easily populate your database with test data
- **Code Structure** - Clean architecture with separation of concerns

## Project Structure

```
backend/
├── src/
│   ├── routes/           # API route definitions
│   │   └── v1/           # API version 1 routes
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── models/           # Data access layer
│   ├── db/               # Database configuration
│   │   ├── migrations/   # Database migrations
│   │   └── seeds/        # Database seeds
│   ├── middleware/       # Custom middleware
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── app.ts            # Express application setup
│   └── server.ts         # Server initialization
├── .env                  # Environment variables
├── .env.example          # Example environment variables
├── knexfile.ts           # Knex configuration
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- PostgreSQL

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/express-typescript-starter.git
   cd express-typescript-starter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your database credentials and other configuration options.

4. Run database migrations:
   ```bash
   npx knex migrate:latest
   ```

5. (Optional) Seed the database:
   ```bash
   npx knex seed:run
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The server will be running at `http://localhost:3345` (or the port specified in your `.env` file).

## API Documentation

### Base URL

All API endpoints are prefixed with `/api/v1`.

### Authentication

This starter kit doesn't include authentication. You can implement JWT, OAuth, or other authentication methods based on your project requirements.

### Common Response Format

All API responses follow a consistent format:

```json
{
  "status": "success|error",
  "message": "Human-readable message",
  "data": {}, // Response data (for successful requests)
  "pagination": {}, // Pagination details (when applicable)
  "error": {} // Error details (for failed requests)
}
```

### Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

### Example Endpoints

The starter kit includes example CRUD endpoints for a generic entity:

#### Users Resource

| Method | Endpoint | Description |
|--------|----------|--------------|
| GET    | /api/v1/users | Get all users (with pagination) |
| GET    | /api/v1/users/:id | Get user by ID |
| POST   | /api/v1/users | Create a new user |
| PUT    | /api/v1/users/:id | Update a user |
| DELETE | /api/v1/users/:id | Delete a user |

#### Items Resource

| Method | Endpoint | Description |
|--------|----------|--------------|
| GET    | /api/v1/items | Get all items (with pagination) |
| GET    | /api/v1/items/:id | Get item by ID |
| POST   | /api/v1/items | Create a new item |
| PUT    | /api/v1/items/:id | Update an item |
| DELETE | /api/v1/items/:id | Delete an item |

#### Transactions Resource

| Method | Endpoint | Description |
|--------|----------|--------------|
| GET    | /api/v1/transactions | Get all transactions (with pagination) |
| GET    | /api/v1/transactions/:id | Get transaction by ID |
| POST   | /api/v1/transactions | Create a new transaction |
| PUT    | /api/v1/transactions/:id | Update a transaction |
| DELETE | /api/v1/transactions/:id | Delete a transaction |

## Database Management

This starter kit uses Knex.js for database operations, migrations, and seeding.

### Migrations

#### Creating Migrations

Create a new migration file:
```bash
npx knex migrate:make migration_name
```

This will create a new migration file in the migrations directory with a timestamp prefix.

#### Running Migrations

Run all pending migrations:
```bash
npx knex migrate:latest
```

Run the next pending migration:
```bash
npx knex migrate:up
```

Run a specific migration:
```bash
npx knex migrate:up --name=migration_name.js
```

#### Rolling Back Migrations

Rollback the most recent migration batch:
```bash
npx knex migrate:rollback
```

Rollback all completed migrations:
```bash
npx knex migrate:rollback --all
```

Rollback the last migration:
```bash
npx knex migrate:down
```

Rollback a specific migration:
```bash
npx knex migrate:down --name=migration_name.js
```

#### Other Migration Commands

Check the current migration version:
```bash
npx knex migrate:currentVersion
```

List all completed and pending migrations:
```bash
npx knex migrate:list
```

Unlock the migrations (if a process crashed during migration):
```bash
npx knex migrate:unlock
```

### Seeding

#### Creating Seeds

Create a new seed file:
```bash
npx knex seed:make seed_name
```

This will create a new seed file in the seeds directory.

#### Running Seeds

Run all seed files:
```bash
npx knex seed:run
```

Run a specific seed file:
```bash
npx knex seed:run --specific=seed_file.js
```

For more detailed information on Knex.js migrations and seeding, visit the [official documentation](https://knexjs.org/guide/migrations.html).

## Scripts

- `npm run dev` - Start the development server with hot-reloading
- `npm start` - Start the production server
- `npm run update-types` - Update database type definitions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Express.js team for the amazing framework
- TypeScript team for the type safety
- Knex.js team for the query builder

---

### **6. Create Reservation**
- **Endpoint:** `POST /reservationss`
- **Body Parameters:**
  - `guestId` (string): Guest ID.
  - `roomIds` (array of strings): IDs of rooms being reserved.
  - `checkIn` (string, ISO 8601 datetime): Check-in date.
  - `checkOut` (string, ISO 8601 datetime): Check-out date.
- **Description:** Creates a new reservation.
- **Response:** Created reservation details.

---

### **7. Update Reservation**
- **Endpoint:** `PUT /reservationss/:id`
- **Path Parameters:**
  - `id` (string): Reservation ID.
- **Body Parameters:** Same as `POST /reservationss`.
- **Description:** Updates details of a specific reservation.
- **Response:** Updated reservation details.

---

### **8. Cancel Reservation**
- **Endpoint:** `DELETE /reservationss/:id`
- **Path Parameters:**
  - `id` (string): Reservation ID.
- **Description:** Cancels a specific reservation.
- **Response:** Confirmation of cancellation.

---
