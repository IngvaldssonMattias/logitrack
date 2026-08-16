# LogiTrack Backend

Backend API for the LogiTrack application.

## Tech Stack

- Node.js
- TypeScript
- Express
- MongoDB
- Mongoose
- Zod

## Installation

Clone the repository and install the dependencies:

```bash
npm install
```

Create a `.env` file in the project root and add the required environment variables.

Start the development server:

```bash
npm run dev
```

The API will run on:

`http://localhost:5000`

## API

Base URL:

`http://localhost:5000/api/v1`

### Shipments

| Method | Endpoint | Description |
|---|---|---|
| POST | `/shipments` | Create a shipment |
| GET | `/shipments` | Get all shipments |
| GET | `/shipments/:id` | Get a shipment by ID |
| PATCH | `/shipments/:id` | Update a shipment |
| DELETE | `/shipments/:id` | Delete a shipment |

### Shipment Statuses

The following shipment statuses are supported:

- `PENDING`
- `IN_TRANSIT`
- `DELAYED`
- `DELIVERED`

## Validation

Request validation is handled using Zod.

The API validates:

- Tracking number
- Sender address
- Destination address
- Weight
- Estimated delivery date
- Shipment status

Invalid requests return a `400 Bad Request` response with validation errors.

## Error Handling

The API uses centralized error handling.

Common responses include:

- `200 OK` — Request successful
- `201 Created` — Resource created successfully
- `400 Bad Request` — Invalid request data
- `404 Not Found` — Shipment not found
- `500 Internal Server Error` — Unexpected server error

## Postman

A Postman collection is included for testing the API endpoints.

The collection contains requests for:

- Creating shipments
- Getting all shipments
- Getting a shipment by ID
- Updating shipments
- Deleting shipments

## Environment Variables

Environment variables are stored in a `.env` file and should **never** be committed to Git.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
```

Do not use real credentials or connection strings in this README.

## Project Structure

```text
src/
├── modules/
│   └── shipments/
│       ├── controller/
│       ├── models/
│       ├── routes/
│       ├── schemas/
│       ├── services/
│       └── types/
├── middleware/
└── ...
```

## Development

Start the development server with:

```bash
npm run dev
```

The server runs in development mode on port `5000`.
