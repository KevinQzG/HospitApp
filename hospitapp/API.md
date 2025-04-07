# API Endpoint Documentation

## Table of Contents

1. [Search IPS by Filter](#search-ips-by-filter)
2. [Get IPS by Name](#get-ips-by-name)
3. [Check Session](#check-session)
4. [User Login](#user-login)
5. [User Registration](#user-registration)
6. [Search IPS by Filter (v1.0.0)](#search-ips-by-filter-v100)
7. [Search IPS by Filter with Pagination (v1.0.0)](#search-ips-by-filter-with-pagination-v100)
8. [Get IPS by Name (v1.0.0)](#get-ips-by-name-v100)
9. [Get IPS by Name with Pagination (v1.0.0)](#get-ips-by-name-with-pagination-v100)
10. [Create Review (v1.0.0)](#create-review-v100)
11. [Delete Review (v1.0.0)](#delete-review-v100)
12. [Edit Review (v1.0.0)](#edit-review-v100)
13. [Get Review by ID (v1.0.0)](#get-review-by-id-v100)
14. [Get All Reviews (v1.0.0)](#get-all-reviews-v100)
15. [Get All Reviews with Pagination (v1.0.0)](#get-all-reviews-with-pagination-v100)
16. [Get Authentication Data from Session](#get-authentication-data-from-session)
17. [Verify Authentication Data from Session](#verify-authentication-data-from-session)

---

## Search IPS by Filter

### **Endpoint**  
`/api/search_ips/filter`

### **Method**  
`POST`

### **Description**  
Search for IPS (Health Providers) based on geographic coordinates, maximum distance, specialties, EPS names, town, and review availability, with pagination support.

### **Request Data**

#### Body Parameters (JSON):
| Field          | Type              | Required | Description                                                                 |
|----------------|-------------------|----------|-----------------------------------------------------------------------------|
| coordinates    | [number, number]  | No       | Geographic coordinates as [longitude, latitude]                            |
| max_distance   | number            | No       | Maximum search distance in meters                                          |
| specialties    | string[]          | No       | Array of medical specialties to filter by                                  |
| eps_names      | string[]          | No       | Array of EPS (Health Provider) names to filter by                          |
| page           | number            | No       | Page number for pagination (default: 1)                                    |
| page_size      | number            | No       | Number of items per page (default: 10)                                     |
| town           | string            | No       | Town name to filter by                                                     |
| hasReviews     | boolean           | No       | Filter by IPS with reviews (default: false)                                |

#### Example Request Body:
```typescript
{
    "coordinates": [-74.0833, 4.5833],
    "max_distance": 5000,
    "specialties": ["cardiology", "pediatrics"],
    "eps_names": ["Sanitas", "Sura"],
    "page": 1,
    "page_size": 10,
    "town": "Bogotá",
    "hasReviews": true
}
```

### **Response Data**

#### Body Parameters (JSON):
| Field            | Type              | Description                                                                 |
|------------------|-------------------|-----------------------------------------------------------------------------|
| success          | boolean          | Indicates if the request was successful                                     |
| error            | string           | Error message if success is false (optional)                                |
| data             | IpsResponse[]    | Array of IPS documents (optional)                                           |
| pagination       | object           | Pagination information (optional)                                           |
| pagination.total | number           | Total number of items in the search                                         |
| pagination.totalPages | number      | Total number of pages in the search                                         |
| pagination.page  | number           | Current page number                                                         |
| pagination.pageSize | number        | Number of items per page                                                    |

#### Example Success Response:
```typescript
{
    "success": true,
    "data": [
        {
            "_id": "5f8b3b3b4b3b3b3b3b3b3b3b",
            "name": "IPS Name",
            "address": "IPS Address",
            "location": {
                "type": "Point",
                "coordinates": [-74.0833, 4.5833]
            },
            "distance": 1234
        }
    ],
    "pagination": {
        "total": 25,
        "totalPages": 3,
        "page": 1,
        "pageSize": 10
    }
}
```

#### Example Error Response:
```typescript
{
    "success": false,
    "error": "Invalid request: coordinates must be an array of two numbers [longitude, latitude]."
}
```

---

## Get IPS by Name

### **Endpoint**  
`/api/search_ips/ips`

### **Method**  
`POST`

### **Description**  
Retrieve an IPS (Health Provider) by its name.

### **Request Data**

#### Body Parameters (JSON):
| Field | Type   | Required | Description                       |
|-------|--------|----------|-----------------------------------|
| name  | string | Yes      | Name of the IPS to retrieve       |

#### Example Request Body:
```typescript
{
    "name": "IPS Name"
}
```

### **Response Data**

#### Body Parameters (JSON):
| Field   | Type        | Description                                              |
|---------|-------------|----------------------------------------------------------|
| success | boolean     | Indicates if the request was successful                  |
| error   | string      | Error message if success is false (optional)             |
| data    | IpsResponse | IPS data if success is true (optional)                   |

#### Example Success Response:
```typescript
{
    "success": true,
    "data": {
        "_id": "5f8b3b3b4b3b3b3b3b3b3b3b",
        "name": "IPS Name",
        "address": "IPS Address"
    }
}
```

#### Example Error Response:
```typescript
{
    "success": false,
    "error": "IPS not found"
}
```

---

## Check Session

### **Endpoint**  
`/api/session`

### **Method**  
`GET`

### **Description**  
Check if a user is logged in by verifying the session token in the cookie.

### **Request Data**
- No body required, uses cookies from headers.

### **Response Data**

#### Body Parameters (JSON):
| Field    | Type   | Description                                              |
|----------|--------|----------------------------------------------------------|
| loggedIn | boolean| Indicates if the user is logged in                       |
| user     | object | User data if logged in (optional)                        |

#### Example Success Response (Logged In):
```typescript
{
    "loggedIn": true,
    "user": {
        "email": "user@example.com"
    }
}
```

#### Example Response (Not Logged In):
```typescript
{
    "loggedIn": false
}
```

---

## User Login

### **Endpoint**  
`/api/login`

### **Method**  
`POST`

### **Description**  
Authenticate a user and create a session cookie.

### **Request Data**

#### Body Parameters (JSON):
| Field    | Type   | Required | Description                       |
|----------|--------|----------|-----------------------------------|
| email    | string | Yes      | User's email                      |
| password | string | Yes      | User's password                   |

#### Example Request Body:
```typescript
{
    "email": "user@example.com",
    "password": "password123"
}
```

### **Response Data**

#### Body Parameters (JSON):
| Field   | Type   | Description                                              |
|---------|--------|----------------------------------------------------------|
| success | boolean| Indicates if the request was successful                  |
| error   | string | Error message if success is false (optional)             |

#### Example Success Response:
```typescript
{
    "success": true
}
```

- Sets a `session` cookie with a 1-hour expiration.

#### Example Error Response:
```typescript
{
    "success": false,
    "error": "Invalid email or password."
}
```

---

## User Registration

### **Endpoint**  
`/api/create`

### **Method**  
`POST`

### **Description**  
Register a new user with email, password, phone, and EPS.

### **Request Data**

#### Body Parameters (JSON):
| Field    | Type   | Required | Description                       |
|----------|--------|----------|-----------------------------------|
| email    | string | Yes      | User's email                      |
| password | string | Yes      | User's password                   |
| phone    | string | Yes      | User's phone number               |
| eps      | string | Yes      | User's EPS (Health Provider)      |

#### Example Request Body:
```typescript
{
    "email": "user@example.com",
    "password": "password123",
    "phone": "1234567890",
    "eps": "Sanitas"
}
```

### **Response Data**

#### Body Parameters (JSON):
| Field   | Type   | Description                                              |
|---------|--------|----------------------------------------------------------|
| success | boolean| Indicates if the request was successful                  |
| error   | string | Error message if success is false (optional)             |

#### Example Success Response:
```typescript
{
    "success": true
}
```

#### Example Error Response:
```typescript
{
    "success": false,
    "error": "Invalid email or password."
}
```

---

## Search IPS by Filter (v1.0.0)

### **Endpoint**  
`/api/v1.0.0/ips/filter`

### **Method**  
`POST`

### **Description**  
Search for IPS without pagination, based on coordinates, distance, specialties, EPS names, town, and review availability.

### **Request Data**

#### Body Parameters (JSON):
| Field       | Type             | Required | Description                                      |
|-------------|------------------|----------|--------------------------------------------------|
| coordinates | [number, number] | No       | Geographic coordinates [longitude, latitude]     |
| maxDistance | number           | No       | Maximum search distance in meters                |
| specialties | string[]         | No       | Array of medical specialties                     |
| epsNames    | string[]         | No       | Array of EPS names                               |
| town        | string           | No       | Town name to filter by                           |
| hasReviews  | boolean          | No       | Filter by IPS with reviews (default: false)      |

#### Example Request Body:
```typescript
{
    "coordinates": [-74.0833, 4.5833],
    "maxDistance": 5000,
    "specialties": ["cardiology"],
    "epsNames": ["Sura"],
    "town": "Bogotá",
    "hasReviews": true
}
```

### **Response Data**

#### Body Parameters (JSON):
| Field   | Type        | Description                                              |
|---------|-------------|----------------------------------------------------------|
| success | boolean     | Indicates if the request was successful                  |
| error   | string      | Error message if success is false (optional)             |
| data    | IpsResponse[] | Array of IPS documents (optional)                      |

#### Example Success Response:
```typescript
{
    "success": true,
    "data": [
        {
            "_id": "5f8b3b3b4b3b3b3b3b3b3b3b",
            "name": "IPS Name",
            "address": "IPS Address"
        }
    ]
}
```

---

## Search IPS by Filter with Pagination (v1.0.0)

### **Endpoint**  
`/api/v1.0.0/ips/filter/pagination`

### **Method**  
`POST`

### **Description**  
Search for IPS with pagination support, based on coordinates, distance, specialties, EPS names, town, and review availability.

### **Request Data**

#### Body Parameters (JSON):
| Field       | Type             | Required | Description                                      |
|-------------|------------------|----------|--------------------------------------------------|
| coordinates | [number, number] | No       | Geographic coordinates [longitude, latitude]     |
| maxDistance | number           | No       | Maximum search distance in meters                |
| specialties | string[]         | No       | Array of medical specialties                     |
| epsNames    | string[]         | No       | Array of EPS names                               |
| page        | number           | No       | Page number (default: 1)                         |
| pageSize    | number           | No       | Items per page (default: 10)                     |
| town        | string           | No       | Town name to filter by                           |
| hasReviews  | boolean          | No       | Filter by IPS with reviews (default: false)      |

#### Example Request Body:
```typescript
{
    "coordinates": [-74.0833, 4.5833],
    "maxDistance": 5000,
    "page": 1,
    "pageSize": 10
}
```

### **Response Data**

#### Body Parameters (JSON):
| Field            | Type        | Description                                              |
|------------------|-------------|----------------------------------------------------------|
| success          | boolean     | Indicates if the request was successful                  |
| error            | string      | Error message if success is false (optional)             |
| data             | IpsResponse[] | Array of IPS documents (optional)                      |
| pagination       | object      | Pagination information (optional)                        |

#### Example Success Response:
```typescript
{
    "success": true,
    "data": [
        {
            "_id": "5f8b3b3b4b3b3b3b3b3b3b3b",
            "name": "IPS Name"
        }
    ],
    "pagination": {
        "total": 25,
        "totalPages": 3,
        "page": 1,
        "pageSize": 10
    }
}
```

---

## Get IPS by Name (v1.0.0)

### **Endpoint**  
`/api/v1.0.0/ips/get`

### **Method**  
`POST`

### **Description**  
Retrieve an IPS by name with optional review sorting.

### **Request Data**

#### Body Parameters (JSON):
| Field  | Type           | Required | Description                                      |
|--------|----------------|----------|--------------------------------------------------|
| name   | string         | Yes      | Name of the IPS                                  |
| sorts  | SortCriteria[] | No       | Array of sorting criteria for reviews            |
| ratingFilter | number | No       | Number which the rating field must match           |

#### Example Request Body:
```typescript
{
    "name": "IPS Name",
    "sorts": [{"field": "rating", "direction": -1}],
    "ratingFilter": 5
}
```

### **Response Data**

#### Body Parameters (JSON):
| Field         | Type          | Description                                              |
|---------------|---------------|----------------------------------------------------------|
| success       | boolean       | Indicates if the request was successful                  |
| error         | string        | Error message if success is false (optional)             |
| data          | IpsResponse   | IPS data (optional)                                      |
| reviewsResult | ReviewResponse[] | Array of reviews (optional)                           |

#### Example Success Response:
```typescript
{
    "success": true,
    "data": {
        "_id": "5f8b3b3b4b3b3b3b3b3b3b3b",
        "name": "IPS Name"
    },
    "reviewsResult": [
        {
            "_id": "review123",
            "rating": 5,
            "comments": "Great service"
        }
    ]
}
```

---

## Get IPS by Name with Pagination (v1.0.0)

### **Endpoint**  
`/api/v1.0.0/ips/get/pagination`

### **Method**  
`POST`

### **Description**  
Retrieve an IPS by name with paginated reviews.

### **Request Data**

#### Body Parameters (JSON):
| Field          | Type           | Required | Description                                      |
|----------------|----------------|----------|--------------------------------------------------|
| name           | string         | Yes      | Name of the IPS                                  |
| reviewsPage    | number         | No       | Page number for reviews (default: 1)             |
| reviewsPageSize| number         | No       | Items per page for reviews (default: 10)         |
| sorts          | SortCriteria[] | No       | Array of sorting criteria for reviews            |
| ratingFilter | number | No       | Number which the rating field must match           |

#### Example Request Body:
```typescript
{
    "name": "IPS Name",
    "reviewsPage": 1,
    "reviewsPageSize": 10,
    "sorts": [{"field": "rating", "direction": -1}],
    "ratingFilter": 5
}
```

### **Response Data**

#### Body Parameters (JSON):
| Field            | Type          | Description                                              |
|------------------|---------------|----------------------------------------------------------|
| success          | boolean       | Indicates if the request was successful                  |
| error            | string        | Error message if success is false (optional)             |
| data             | IpsResponse   | IPS data (optional)                                      |
| reviewsResult    | object        | Paginated reviews (optional)                             |

#### Example Success Response:
```typescript
{
    "success": true,
    "data": {
        "_id": "5f8b3b3b4b3b3b3b3b3b3b3b",
        "name": "IPS Name"
    },
    "reviewsResult": {
        "reviews": [
            {
                "_id": "review123",
                "rating": 5,
                "comments": "Great service"
            }
        ],
        "pagination": {
            "total": 20,
            "totalPages": 2,
            "page": 1,
            "pageSize": 10
        }
    }
}
```

---

## Create Review (v1.0.0)

### **Endpoint**  
`/api/v1.0.0/reviews/create`

### **Method**  
`POST`

### **Description**  
Create a new review for an IPS (requires authentication).

### **Request Data**

#### Body Parameters (JSON):
| Field    | Type   | Required | Description                       |
|----------|--------|----------|-----------------------------------|
| ips      | string | Yes      | ID of the IPS                     |
| rating   | number | Yes      | Rating (e.g., 1-5)                |
| comments | string | Yes      | Review comments                   |

#### Example Request Body:
```typescript
{
    "ips": "5f8b3b3b4b3b3b3b3b3b3b3b",
    "rating": 5,
    "comments": "Excellent service"
}
```

### **Response Data**

#### Body Parameters (JSON):
| Field   | Type   | Description                                              |
|---------|--------|----------------------------------------------------------|
| success | boolean| Indicates if the request was successful                  |
| error   | string | Error message if success is false (optional)             |
| review  | string | ID of the created review (optional)                      |

#### Example Success Response:
```typescript
{
    "success": true,
    "review": "review123"
}
```

---

## Delete Review (v1.0.0)

### **Endpoint**  
`/api/v1.0.0/reviews/delete`

### **Method**  
`POST`

### **Description**  
Delete a review by ID (requires authentication and ownership or admin role).

### **Request Data**

#### Body Parameters (JSON):
| Field | Type   | Required | Description                       |
|-------|--------|----------|-----------------------------------|
| id    | string | Yes      | ID of the review to delete        |

#### Example Request Body:
```typescript
{
    "id": "review123"
}
```

### **Response Data**

#### Body Parameters (JSON):
| Field   | Type   | Description                                              |
|---------|--------|----------------------------------------------------------|
| success | boolean| Indicates if the request was successful                  |
| message | string | Success or error message                                 |

#### Example Success Response:
```typescript
{
    "success": true,
    "message": "Review deleted successfully"
}
```

---

## Edit Review (v1.0.0)

### **Endpoint**  
`/api/v1.0.0/reviews/edit`

### **Method**  
`POST`

### **Description**  
Edit an existing review (requires authentication and ownership).

### **Request Data**

#### Body Parameters (JSON):
| Field    | Type   | Required | Description                       |
|----------|--------|----------|-----------------------------------|
| id       | string | Yes      | ID of the review to edit          |
| rating   | number | Yes      | New rating                        |
| comments | string | Yes      | New comments                      |

#### Example Request Body:
```typescript
{
    "id": "review123",
    "rating": 4,
    "comments": "Updated review"
}
```

### **Response Data**

#### Body Parameters (JSON):
| Field   | Type          | Description                                              |
|---------|---------------|----------------------------------------------------------|
| success | boolean       | Indicates if the request was successful                  |
| error   | string        | Error message if success is false (optional)             |
| data    | ReviewResponse| Updated review data (optional)                           |

#### Example Success Response:
```typescript
{
    "success": true,
    "data": {
        "_id": "review123",
        "rating": 4,
        "comments": "Updated review"
    }
}
```

---

## Get Review by ID (v1.0.0)

### **Endpoint**  
`/api/v1.0.0/reviews/get`

### **Method**  
`POST`

### **Description**  
Retrieve a review by ID (requires authentication and ownership or admin role).

### **Request Data**

#### Body Parameters (JSON):
| Field | Type   | Required | Description                       |
|-------|--------|----------|-----------------------------------|
| id    | string | Yes      | ID of the review to retrieve      |

#### Example Request Body:
```typescript
{
    "id": "review123"
}
```

### **Response Data**

#### Body Parameters (JSON):
| Field   | Type          | Description                                              |
|---------|---------------|----------------------------------------------------------|
| success | boolean       | Indicates if the request was successful                  |
| error   | string        | Error message if success is false (optional)             |
| data    | ReviewResponse| Review data (optional)                                   |

#### Example Success Response:
```typescript
{
    "success": true,
    "data": {
        "_id": "review123",
        "rating": 5,
        "comments": "Great service"
    }
}
```

---

## Get All Reviews (v1.0.0)

### **Endpoint**  
`/api/v1.0.0/reviews/get/all`

### **Method**  
`POST`

### **Description**  
Retrieve all reviews (requires admin role).

### **Request Data**

#### Body Parameters (JSON):
| Field | Type           | Required | Description                                      |
|-------|----------------|----------|--------------------------------------------------|
| sorts | SortCriteria[] | No       | Array of sorting criteria for reviews            |
| ratingFilter | number | No       | Number which the rating field must match           |

#### Example Request Body:
```typescript
{
    "sorts": [{"field": "rating", "direction": -1}],
    "ratingFilter": 5
}
```

### **Response Data**

#### Body Parameters (JSON):
| Field   | Type            | Description                                              |
|---------|-----------------|----------------------------------------------------------|
| success | boolean         | Indicates if the request was successful                  |
| error   | string          | Error message if success is false (optional)             |
| data    | ReviewResponse[]| Array of all reviews (optional)                          |

#### Example Success Response:
```typescript
{
    "success": true,
    "data": [
        {
            "_id": "review123",
            "rating": 5,
            "comments": "Great service"
        }
    ]
}
```

---

## Get All Reviews with Pagination (v1.0.0)

### **Endpoint**  
`/api/v1.0.0/reviews/get/all/pagination`

### **Method**  
`POST`

### **Description**  
Retrieve all reviews with pagination (requires admin role).

### **Request Data**

#### Body Parameters (JSON):
| Field    | Type           | Required | Description                                      |
|----------|----------------|----------|--------------------------------------------------|
| page     | number         | No       | Page number (default: 1)                         |
| pageSize | number         | No       | Items per page (default: 10)                     |
| sorts    | SortCriteria[] | No       | Array of sorting criteria for reviews            |
| ratingFilter | number | No       | Number which the rating field must match           |

#### Example Request Body:
```typescript
{
    "page": 1,
    "pageSize": 10,
    "sorts": [{"field": "rating", "direction": -1}],
    "ratingFilter": 5
}
```

### **Response Data**

#### Body Parameters (JSON):
| Field            | Type            | Description                                              |
|------------------|-----------------|----------------------------------------------------------|
| success          | boolean         | Indicates if the request was successful                  |
| error            | string          | Error message if success is false (optional)             |
| data             | object          | Review data with pagination (optional)                   |
| data.result      | ReviewResponse[]| Array of reviews                                         |
| data.pagination  | object          | Pagination information                                   |

#### Example Success Response:
```typescript
{
    "success": true,
    "data": {
        "result": [
            {
                "_id": "review123",
                "rating": 5,
                "comments": "Great service"
            }
        ],
        "pagination": {
            "total": 20,
            "totalPages": 2,
            "page": 1,
            "pageSize": 10
        }
    }
}
```

## Verify Authentication Data from Session

### **Endpoint**  
`/api/v1.0.0/auth/verification`

### **Method**  
`POST`

### **Description**  
Verifies the authentication data from the session. This endpoint checks if the user is authenticated and matches the required roles.

### **Request Data**

#### Body Parameters (JSON):
| Field    | Type           | Required | Description                                      |
|----------|----------------|----------|--------------------------------------------------|
| authenticationNeeded     | boolean         | Yes       | Boolean which says if authentication is needed or not                        |
| authenticationRoles | boolean         | No       | Array with the roles allowed (Optional)                     |


#### Example Request Body:
```typescript
{
    "authenticationNeeded": true,
    "authenticationRoles": ["ADMIN"]
}
```

### **Response Data**

#### Body Parameters (JSON):
| Field            | Type            | Description                                              |
|------------------|-----------------|----------------------------------------------------------|
| success          | boolean         | Indicates if the request was successful                  |
| message            | string          | message informing the operation             |

#### Example Success Response:
```typescript
{
    "success": true,
    "message": "User Authenticated"
}
```

