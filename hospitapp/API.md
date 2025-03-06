# API Endpoint Documentation

## Table of Contents

1. [Search IPS by Distance, Specialties, and EPS](#search-ips-by-distance-specialties-and-eps)
2. [Get IPS by ID](#get-ips-by-id)

## Search IPS by Distance, Specialties, and EPS

### **Endpoint**  
`/api/search_ips/filter`

### **Method**  
`POST`

### **Description**
Search for IPS (Health Provider) based on geographic coordinates, maximum distance, medical specialties, and EPS (Health Provider) names.

---

### **Request Data**

#### Body Parameters (JSON):
| Field          | Type              | Required | Description                                                                 |
|----------------|-------------------|----------|-----------------------------------------------------------------------------|
| coordinates    | [number, number]  | Yes      | Geographic coordinates as [longitude, latitude]                            |
| max_distance   | number            | Yes      | Maximum search distance in meters                                          |
| specialties    | string[]          | No       | Array of medical specialties to filter by                                  |
| eps_names      | string[]          | No       | Array of EPS (Health Provider) names to filter by                          |
| page           | number            | No       | Page number for pagination (default: 1)                                    |
| page_size      | number            | No       | Number of items per page (default: 10)                                     |

#### Example Request Body:
```json
{
    "coordinates": [-74.0833, 4.5833],
    "max_distance": 5000,
    "specialties": ["cardiology", "pediatrics"],
    "eps_names": ["Sanitas", "Sura"],
    "page": 1,
    "page_size": 10
}
```

### **Response Data**

#### Body Parameters (JSON):
| Field          | Type              | Required | Description                                                                 |
|----------------|-------------------|----------|-----------------------------------------------------------------------------|
| success          | boolean          | Yes | Indicates if the request was successful or not                              |
| error            | string           | No  | Error message in case of failure                                             |
| data[]          | object[]            | No | Object containing the search results. (Default value [ ])                                        |
| data._id      | string            | Yes |Unique identifier for the IP                                                 |
| data.name     | string            | Yes |Name of the IPS                                                                |
| data.address  | string            | Yes |Address of the IPS                                                             |
| data.location | object            | Yes |Geographic coordinates of the IPS                     |
| data.location.type | string        | Yes |Type of the location (Point)                                                  |
| data.location.coordinates | [number, number] | Yes |Geographic coordinates as [longitude, latitude]                              |
| data.phone    | string or number       | No |Phone number of the IPS                                                        |
| data.email    | string            | No |Email of the IPS                                                               |
| data.level    | number            | No |Level of the IPS (I, II, III)                                                  |
| data.distance | number            | Yes |Distance in meters from the search coordinates                                |
| data.specialties | object[]      | No |Array of medical specialties provided by the IPS                              |
| data.specialties[]._id | string    | Yes |Unique identifier for the specialty                                            |
| data.specialties[].name | string   | Yes |Name of the specialty                                                          |
| data.specialties[].schedule_monday | string | No |Schedule for Monday                                                            |
| data.specialties[].schedule_tuesday | string | No |Schedule for Tuesday                                                           |
| data.specialties[].schedule_wednesday | string | No |Schedule for Wednesday                                                         |
| data.specialties[].schedule_thursday | string | No |Schedule for Thursday                                                          |
| data.specialties[].schedule_friday | string | No |Schedule for Friday                                                            |
| data.specialties[].schedule_saturday | string | No |Schedule for Saturday                                                          |
| data.specialties[].schedule_sunday | string | No |Schedule for Sunday                                                            |
| data.eps | object[]            | No |Array of EPS (Health Provider) provided by the IPS                            |
| data.eps[]._id | string        | Yes |Unique identifier for the EPS                                                  |
| data.eps[].name | string       | Yes |Name of the EPS                                                                |
| data.eps[].01_8000_phone | string    | Yes |01 8000 phone number of the EPS                                                |
| data.eps[].fax | string         | Yes |Fax number of the EPS                                                          |
| data.eps[].emails | string       | Yes |Email of the EPS                                                               |
| data.maps | string          | No |Google Maps URL for the IPS location                                          |
| data.waze | string          | No |Waze URL for the IPS location                                                 |
| pagination    | object            | No |Object containing pagination information                                      |
| pagination.page | number          | Yes |Current page number                                                            |
| pagination.page_size | number     | Yes |Number of items per page                                                      |
| pagination.total | number         | Yes |Total number of items in the search                                           |
| pagination.total_pages | number   | Yes |Total number of pages in the search                                           |

#### Example Response Body:
##### Success Response
```json
{
    "success": true,
    "data": [ // Optional Field, will be [] if no results, null or undefined
        {
            "_id": "5f8b3b3b4b3b3b3b3b3b3b3b",
            "name": "IPS Name",
            "address": "IPS Address",
            "location": {
                "type": "Point",
                "coordinates": [-74.0833, 4.5833]
            },
            "phone": "1234567890", // Optional Field
            "email": "example@ips.com", // Optional Field
            "level": 1, // Optional Field
            "distance": 1234, // Optional Field
            "specialties": [ // Optional Field, will be null or undefined if no specialties
                {
                    "_id": "5f8b3b3b4b3b3b3b3b3b3b3b",
                    "name": "Cardiology",
                    "schedule_monday": "08:00-12:00", // Optional Field
                    "schedule_tuesday": "08:00-12:00", // Optional Field
                    "schedule_wednesday": "08:00-12:00", // Optional Field
                    "schedule_thursday": "08:00-12:00", // Optional Field
                    "schedule_friday": "08:00-12:00", // Optional Field
                    "schedule_saturday": "08:00-12:00", // Optional Field
                    "schedule_sunday": "08:00-12:00" // Optional Field
                }
            ],
            "eps": [ // Optional Field, will be null or undefined if no EPS
                {
                    "_id": "5f8b3b3b4b3b3b3b3b3b3b3b",
                    "name": "EPS Name",
                    "01_8000_phone": "1234567890",
                    "fax": "1234567890",
                    "emails": "exampleeps@example.com"
                }
            ],
            "maps": "https://www.google.com/maps/place/4.5833,-74.0833", // Optional Field
            "waze": "https://www.waze.com/ul?ll=4.5833,-74.0833" // Optional Field
        }
    ], // Optional Field
    "pagination": {
        "page": 1,
        "page_size": 10,
        "total": 1,
        "total_pages": 1
    }
}
```

##### Success Response with no results
```json
{
    "success": true,
    "data": [], // Optional Field
    "pagination": {
        "page": 1,
        "page_size": 10,
        "total": 0,
        "total_pages": 0
    }
}
```

##### Error Response (400 Bad Request)

```json
{
    "success": false,
    "error": "Error message"
}
```

##### Error Response (500 Internal Server Error)

```json
{
    "success": false,
    "error": "Internal Server Error"
}
```

## Get IPS by ID

### **Endpoint**  
`/api/ips/[id]`

### **Method**  
`POST`

### **Description**
Retrieve detailed information about a specific IPS using its unique identifier.

---

### **Request Data**

#### Body Parameters (JSON):
| Field | Type   | Required | Description                |
|-------|--------|----------|----------------------------|
| _id   | string | Yes      | Unique identifier for IPS  |

#### Example Request Body:
```json
{
    "_id": "5f8b3b3b4b3b3b3b3b3b3b3b"
}
```

### **Response Data**

#### Body Parameters (JSON):

| Field          | Type              | Required | Description                                                                 |
|----------------|-------------------|----------|-----------------------------------------------------------------------------|
| success          | boolean          | Yes | Indicates if the request was successful or not                              |
| error            | string           | No  | Error message in case of failure                                             |
| data          | object           | No | Object containing the searched IPS.                                        |
| data._id      | string            | Yes |Unique identifier for the IP                                                 |
| data.name     | string            | Yes |Name of the IPS                                                                |
| data.address  | string            | Yes |Address of the IPS                                                             |
| data.location | object            | Yes |Geographic coordinates of the IPS                     |
| data.location.type | string        | Yes |Type of the location (Point)                                                  |
| data.location.coordinates | [number, number] | Yes |Geographic coordinates as [longitude, latitude]                              |
| data.phone    | string or number       | No |Phone number of the IPS                                                        |
| data.email    | string            | No |Email of the IPS                                                               |
| data.level    | number            | No |Level of the IPS (I, II, III)                                                  |
| data.distance | number            | Yes |Distance in meters from the search coordinates                                |
| data.specialties | object[]      | No |Array of medical specialties provided by the IPS                              |
| data.specialties[]._id | string    | Yes |Unique identifier for the specialty                                            |
| data.specialties[].name | string   | Yes |Name of the specialty                                                          |
| data.specialties[].schedule_monday | string | No |Schedule for Monday                                                            |
| data.specialties[].schedule_tuesday | string | No |Schedule for Tuesday                                                           |
| data.specialties[].schedule_wednesday | string | No |Schedule for Wednesday                                                         |
| data.specialties[].schedule_thursday | string | No |Schedule for Thursday                                                          |
| data.specialties[].schedule_friday | string | No |Schedule for Friday                                                            |
| data.specialties[].schedule_saturday | string | No |Schedule for Saturday                                                          |
| data.specialties[].schedule_sunday | string | No |Schedule for Sunday                                                            |
| data.eps | object[]            | No |Array of EPS (Health Provider) provided by the IPS                            |
| data.eps[]._id | string        | Yes |Unique identifier for the EPS                                                  |
| data.eps[].name | string       | Yes |Name of the EPS                                                                |
| data.eps[].01_8000_phone | string    | Yes |01 8000 phone number of the EPS                                                |
| data.eps[].fax | string         | Yes |Fax number of the EPS                                                          |
| data.eps[].emails | string       | Yes |Email of the EPS                                                               |
| data.maps | string          | No |Google Maps URL for the IPS location                                          |
| data.waze | string          | No |Waze URL for the IPS location                                                 |                                       |


#### Example Response Body:
##### Success Response
```json
{
    "success": true,
    "data": {
        "_id": "5f8b3b3b4b3b3b3b3b3b3b3b",
        "name": "IPS Name",
        "address": "IPS Address",
        "location": {
            "type": "Point",
            "coordinates": [-74.0833, 4.5833]
        },
        "phone": "1234567890", // Optional Field
        "email": "example@gmail.com", // Optional Field
        "level": 1, // Optional Field
        "distance": 1234, // Optional Field
        "specialties": [ // Optional Field, will be null or undefined if no specialties
            {
                "_id": "5f8b3b3b4b3b3b3b3b3b3b3b",
                "name": "Cardiology",
                "schedule_monday": "08:00-12:00", // Optional Field
                "schedule_tuesday": "08:00-12:00", // Optional Field
                "schedule_wednesday": "08:00-12:00", // Optional Field
                "schedule_thursday": "08:00-12:00", // Optional Field
                "schedule_friday": "08:00-12:00", // Optional Field
                "schedule_saturday": "08:00-12:00", // Optional Field
                "schedule_sunday": "08:00-12:00" // Optional Field
            }
        ],
        "eps": [ // Optional Field, will be null or undefined if no EPS
            {
                "_id": "5f8b3b3b4b3b3b3b3b3b3b3b",
                "name": "EPS Name",
                "01_8000_phone": "1234567890",
                "fax": "1234567890",
                "emails": "
            }
        ],
        "maps": "https://www.google.com/maps/place/4.5833,-74.0833", // Optional Field
        "waze": "https://www.waze.com/ul?ll=4.5833,-74.0833" // Optional Field
    }
}
```

##### Error Response (400 Bad Request)

```json
{
    "success": false,
    "error": "Error message"
}
```

##### Error Response (500 Internal Server Error)

```json
{
    "success": false,
    "error": "Internal Server Error"
}
```