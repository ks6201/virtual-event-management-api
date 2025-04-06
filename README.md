# Virtual Event Management API

The project provides a RESTful API for managing virtual events, attendees, and organizers. It supports user registration, authentication, event creation, attendee registration, and role-based access control using JWT.

---

## Quick Start with Docker (Recommended)

The easiest way to get started is using Docker. It sets up the entire stack including the PostgreSQL database and application server automatically.

### Prerequisites

- Install [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

### 1. Clone the repository

```bash
git clone https://github.com/ks6201/virtual-event-management-api
cd virtual-event-management-api
```

### 2. Create a `.env` file

Before running, create a `.env` file in the root of your project with the following variables:

```env
NODE_ENV=production
PORT=3000

POSTGRES_DB=db_vem
POSTGRES_HOST=oven_postgres_db
POSTGRES_USER=your_database_user_here
POSTGRES_PASS=your_database_password_here

# Quick Note 
# ( This project uses @d3vtool/strict-env which supports referecing fields in you .env files):

DATABASE_URL=postgres://${POSTGRES_USER}:${POSTGRES_PASS}@localhost/${POSTGRES_DB}

JWT_SEC=your_jwt_secret_here
EMAIL_ID=your_email@example.com
EMAIL_APP_ID=your_email_app_password
```

> Make sure the values are correct. These variables will be injected into your services automatically via Docker Compose.

### 3. Start the services

To run the entire app stack:

```bash
docker compose up
```

### What's Included?

- **VEM_DB**: PostgreSQL 17 instance with `db_vem.sql` automatically loaded.
- **VEM_APP**: Bun-based application container running your API server.
- **Port 3000** is exposed for API access: `http://localhost:3000`

---

## Manual Setup (If Not Using Docker)

If you prefer to run the project locally without Docker, follow these steps.

### 1. Clone the repository

```bash
git clone https://github.com/ks6201/virtual-event-management-api
cd virtual-event-management-api
```

### 2. Install dependencies

```bash
bun install
```

### 3. Create the PostgreSQL database

Make sure PostgreSQL is installed and running.

```bash
psql -U your_username
```

Then run:

```sql
CREATE DATABASE db_vem;
\q
```

Import the schema from the SQL file:

```bash
psql -U your_username -d db_vem -f path/to/db_vem.sql
```

> Replace `your_username` and `path/to/db_vem.sql` accordingly.

### 4. Create a `.env` file

Create a `.env` file in the root with the following content:

```env
NODE_ENV=(development | production)
PORT=3000

POSTGRES_DB=db_vem
POSTGRES_HOST=localhost
POSTGRES_USER=your_database_user_here
POSTGRES_PASS=your_database_password_here

# Quick Note 
# ( This project uses @d3vtool/strict-env which supports referecing fields in you .env files):

DATABASE_URL=postgres://${POSTGRES_USER}:${POSTGRES_PASS}@localhost/${POSTGRES_DB}

JWT_SEC=your_jwt_secret_here
EMAIL_ID=your_email@example.com
EMAIL_APP_ID=your_email_app_password
```

### 5. Run the server

```bash
bun run app.ts
```

---

## Environment Variables

The following variables are required in your `.env` file:

| Variable         | Description                                               |
|------------------|-----------------------------------------------------------|
| `NODE_ENV`       | The environment mode (`development`, `production`, etc.) |
| `PORT`           | Port on which the server runs (e.g., `3000`)              |
| `POSTGRES_DB`    | PostgreSQL database name                                  |
| `POSTGRES_HOST`  | Host of the PostgreSQL server                             |
| `POSTGRES_USER`  | Database user                                             |
| `POSTGRES_PASS`  | Database password                                         |
| `DATABASE_URL`   | Full PostgreSQL connection string                         |
| `JWT_SEC`        | Secret for signing JWT tokens                             |
| `EMAIL_ID`       | Email address used for communication                      |
| `EMAIL_APP_ID`   | App-specific email password or key                        |

---

## Run Tests

To run the tests (if configured):

```bash
bun run test
```

---

## API Endpoints

### POST /events/register

**Description:**  
Registers a new user as either an attendee or an organizer.

**Route:**
```ts
UserController.register
```

**Request Body:**
- **email** (required): Email address of the user.
- **password** (required): Password for the account.
- **role** (required): Role to register as (`attendee` or `organizer`).

**Response Statuses:**
- **201 Created**: User registration successful.
- **400 Bad Request**: Request body fails validation.
- **409 Conflict**: Email already exists.
- **500 Internal Server Error**: Unexpected error.

**Middleware:**
- `validate(vCreateUserSchema, "body")`: Validates the request body against the user creation schema.

**Error Handler:**
- `signupError`: Custom error formatter for signup-related failures.

**Controller:**
- `UserController.register`: Handles user registration logic.

---

### POST /events/login

**Description:**  
Logs in a registered attendee and returns an authentication token.

**Route:**
```ts
UserController.login
```

**Request Body:**
- **email** (required): Registered user email.
- **password** (required): Corresponding password.

**Response Statuses:**
- **200 OK**: Login successful.
- **400 Bad Request**: Missing or invalid credentials.
- **401 Unauthorized**: Invalid email or password.
- **500 Internal Server Error**: Unexpected error.

**Middleware:**
- `validate(vLoginUserSchema, "body")`: Validates the request body against the login schema.

**Error Handler:**
- `loginError`: Handles errors that occur during login.

**Controller:**
- `UserController.login`: Handles user login and token generation.

### GET /events/attendee/events

**Description:**  
Retrieves all events that the authenticated attendee is registered for.

**Route:**
```ts
UserController.getEventsForAttendee
```

**Request Headers:**
- **Authorization** (required): Bearer token for attendee authentication.

**Response Statuses:**
- **200 OK**: Successfully retrieved the list of events.
- **401 Unauthorized**: Missing or invalid authentication token.
- **403 Forbidden**: Authenticated user does not have the attendee role.
- **500 Internal Server Error**: Unexpected error.

**Middleware:**
- `authMiddleware`: Validates the authentication token.
- `verifyRole("attendee")`: Ensures that the user has the `attendee` role.

**Controller:**
- `UserController.getEventsForAttendee`: Handles fetching of attendee-specific events.

---

### POST /events

**Description:**  
Creates a new event in the database. Only accessible to authenticated organizers.

**Route:**
```ts
EventsController.create
```

**Request Body:**
- **title** (required): Title of the event.
- **description** (required): Details about the event.
- **date** (required): Date of the event (ISO Format).
- **time** (required): Time of the event (24Hr Format).

**Response Statuses:**
- **201 Created**: Event successfully created.
- **400 Bad Request**: Validation failed for request body.
- **401 Unauthorized**: User is not authenticated.
- **403 Forbidden**: Authenticated user is not an organizer.
- **500 Internal Server Error**: Unexpected server-side error.

**Middleware:**
- `validate(vCreateEventSchema, "body")`: Validates the request body schema.
- `authMiddleware`: Ensures the user is authenticated.
- `verifyRole("organizer")`: Ensures the user has the "organizer" role.

**Error Handler:**
- `createEventError`: Custom handler for event creation errors.

**Controller:**
- `EventsController.create`: Handles creation logic and stores the event in the database.

---

Here’s the doc for that route, matching your format:

---

### GET /events

**Description:**  
Fetches all events from the database. Accessible only to authenticated organizers.

**Route:**
```ts
EventsController.getAllEvents
```

**Request Query Parameters:**
- *(none required, but pagination or filters could be added in future)*

**Response Statuses:**
- **200 OK**: Successfully fetched the list of events.
- **401 Unauthorized**: User is not authenticated.
- **403 Forbidden**: Authenticated user is not an organizer.
- **500 Internal Server Error**: Unexpected server-side error.

**Middleware:**
- `authMiddleware`: Ensures the user is authenticated.
- `verifyRole("organizer")`: Ensures the user has the "organizer" role.

**Controller:**
- `EventsController.getAllEvents`: Handles fetching all events from the database.

---

### PUT /events/:eventId

**Description:**  
Updates an existing event based on the provided `eventId`. Only accessible to authenticated organizers.

**Route:**
```ts
EventsController.updateEvent
```

**Request Path Parameters:**
- **eventId** (required): The ID of the event to update.  
  - **Type**: string  
  - **Validation**: Must match the format defined in `vEventId`.

**Request Body:**
- **title** (optional): Title of the event.
- **description** (optional): Details about the event.
- **date** (optional): Date of the event (ISO Format).
- **time** (optional): Time of the event (24Hr Format).

**Response Statuses:**
- **200 OK**: Event was successfully updated.
- **400 Bad Request**: Invalid path or body input.
- **401 Unauthorized**: User is not authenticated.
- **403 Forbidden**: User does not have the "organizer" role.
- **404 Not Found**: No event found with the given ID.
- **500 Internal Server Error**: Unexpected error during update.

**Middleware:**
- `validate(vEventId, "params")`: Validates `eventId` in the route.
- `validate(vUpdateEventSchema, "body")`: Validates the event update data.
- `authMiddleware`: Ensures the user is authenticated.
- `verifyRole("organizer")`: Ensures the user has the "organizer" role.

**Controller:**
- `EventsController.updateEvent`: Handles the logic for updating the event.

---

### DELETE /events/:eventId

**Description:**  
Deletes an existing event from the system using the provided `eventId`. Only accessible to authenticated organizers.

**Route:**
```ts
EventsController.deleteEvent
```

**Request Path Parameters:**
- **eventId** (required): The ID of the event to delete.  
  - **Type**: string  
  - **Validation**: Must match the format defined in `vEventId`.

**Response Statuses:**
- **200 OK**: Event was successfully deleted.
- **400 Bad Request**: Invalid `eventId` format.
- **401 Unauthorized**: User is not authenticated.
- **403 Forbidden**: User does not have the "organizer" role.
- **404 Not Found**: No event found with the given ID.
- **500 Internal Server Error**: Unexpected error during deletion.

**Middleware:**
- `validate(vEventId, "params")`: Validates `eventId` in the path.
- `authMiddleware`: Ensures the user is authenticated.
- `verifyRole("organizer")`: Ensures the user has the "organizer" role.

**Controller:**
- `EventsController.deleteEvent`: Handles the logic for deleting the specified event.

---

### POST /events/:eventId/register

**Description:**  
Registers an authenticated attendee for the specified event.

**Route:**
```ts
EventsController.registerForEvent
```

**Request Path Parameters:**
- **eventId** (required): The ID of the event to register for.  
  - **Type**: string  
  - **Validation**: Must match the format defined in `vEventId`.

**Response Statuses:**
- **200 OK**: Registration successful.
- **400 Bad Request**: Invalid `eventId` format.
- **401 Unauthorized**: User is not authenticated.
- **403 Forbidden**: User is not an attendee.
- **404 Not Found**: Event not found.
- **500 Internal Server Error**: Unexpected error during registration.

**Middleware:**
- `validate(vEventId, "params")`: Validates the `eventId` in the path.
- `authMiddleware`: Ensures the user is authenticated.
- `verifyRole("attendee")`: Ensures the user has the "attendee" role.

**Controller:**
- `EventsController.registerForEvent`: Handles attendee registration for the event.

---

### GET /events/:eventId/attendees

**Description:**  
Fetches a list of all attendees registered for the specified event.

**Route:**
```ts
EventsController.getAttendees
```

**Request Path Parameters:**
- **eventId** (required): The ID of the event.  
  - **Type**: string  
  - **Validation**: Must match the format defined in `vEventId`.

**Response Statuses:**
- **200 OK**: List of attendees retrieved successfully.
- **400 Bad Request**: Invalid `eventId` format.
- **401 Unauthorized**: User is not authenticated.
- **403 Forbidden**: User is not an organizer.
- **404 Not Found**: Event not found.
- **500 Internal Server Error**: Unexpected error during fetch.

**Middleware:**
- `validate(vEventId, "params")`: Validates the `eventId` in the path.
- `authMiddleware`: Ensures the user is authenticated.
- `verifyRole("organizer")`: Ensures the user has the "organizer" role.

**Controller:**
- `EventsController.getAttendees`: Retrieves the attendees for the specified event.