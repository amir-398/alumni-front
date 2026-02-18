# API Specification (FastAPI Interface)

## Base URL: `http://localhost:8000`

## Endpoints

| Method  | Endpoint           | Description        | Payload (JSON)                                                  |
| ------- | ------------------ | ------------------ | --------------------------------------------------------------- |
| `POST`  | `/alumni/register` | Create new profile | `{ firstName, lastName, email, linkedinUrl, gradYear, degree }` |
| `GET`   | `/alumni`          | Get directory list | None                                                            |
| `GET`   | `/alumni/{id}`     | Get profile detail | None                                                            |
| `PATCH` | `/alumni/{id}`     | Admin: Update data | `{ ...fields }`                                                 |

## Data Contract

All API responses will follow this standard structure:

```json
{
  "status": "success",
  "data": { ... },
  "message": "Optional message"
}
```
