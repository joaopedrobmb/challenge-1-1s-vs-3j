# Technical Challenge - API Performance and Data Analysis

## Objective

Create an API that receives a JSON file with 100,000 users and provides high-performance, well-structured endpoints for data analysis.

- [100,00 users file](https://drive.google.com/file/d/1zOweCB2jidgHwirp_8oBnFyDgJKkWdDA/view?usp=sharing)

## JSON Example

```JSON
{
"id": "uuid",
"name": "string",
"age": "int",
"score": "int",
"active": "bool",
"country": "string",
"team": {
"name": "string",
"leader": "bool",
"projects": [{ "name": "string", "completed": "bool" }]
},
"logs": [{ "date": "YYYY-MM-DD", "action": "login/logout" }]
}
```

## Mandatory Endpoints

### `POST /users`

Receives and stores users in memory. It may simulate an in-memory database.

### `GET /superusers`

Filter: score >= 900 and active = true
Returns the data and the request processing time.

### `GET /top-countries`

Groups superusers by country.
Returns the top 5 countries with the highest number of superusers.

### `GET /team-insights`

Groups by team.name.
Returns: total members, leaders, completed projects, and percentage of active members.

### `GET /active-users-per-day`

Counts how many logins occurred per date.

### `GET /evaluation`

Must perform a self-evaluation of the main API endpoints and return a scoring report.

The evaluation must test:

- Whether the returned status is 200
- The response time in milliseconds
- Whether the response is valid JSON

_This endpoint can run test scripts embedded in the project itself and return a JSON with the results. It will be used to automatically and quickly validate the submission._

## Technical Requirements

- Response time < 1s per endpoint.
- All endpoints must return the processing time (in milliseconds) and the request timestamp.
- Clean, modular code with well-defined functions.
- Any language/framework may be used.
- Documentation or a final explanation earns bonus points.
- Use of AI is not allowed.
