# Technical Manual

## System architecture and design diagrams

## Explanation of core functionalities and modules

## API documentation

This document outlines all available API endpoints for the Course Review System.

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Courses](#courses)
- [Professors](#professors)
- [Reviews](#reviews)
- [Questions](#questions)
- [Policies](#policies)

## Authentication

### Auth0 Routes

```typescript
GET / api / auth / login; // Perform login with Auth0
GET / api / auth / logout; // Log the user out
GET / api / auth / callback; // Auth0 redirect after successful login
GET / api / auth / me; // Fetch user profile
```

## Users

### Create/Get User

```typescript
POST / api / users;
```

Creates a new user if they don't exist already.

**Response:**

- `200 OK` - User processed successfully
- `401 Unauthorized` - User not authenticated
- `500 Internal Server Error` - Server-side issue

```typescript
GET / api / users;
```

Retrieves user information including their reviews.

**Response:**

- `200 OK` - User data retrieved successfully
- `401 Unauthorized` - User not authenticated
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server-side issue

## Courses

### Get All Courses

```typescript
GET / api / courses;
```

Fetches all courses.

**Response:**

- `200 OK` - List of courses
- `500 Internal Server Error` - Server-side issue

### Create Course

```typescript
POST / api / courses;
```

Creates a new course.

**Required Fields:**

- `course_code`
- `course_section`
- `course_name`
- `course_description`
- `course_delivery_format_id`
- `season`
- `year`

**Response:**

- `200 OK` - Course created successfully
- `400 Bad Request` - Missing required fields
- `409 Conflict` - Course already exists
- `500 Internal Server Error` - Server-side issue

### Get Course by Code

```typescript
GET / api / courses / { courseCode };
```

Fetches course by course code.

**Query Parameters:**

- `season` (optional)
- `year` (optional)

**Response:**

- `200 OK` - Course details
- `404 Not Found` - Course not found
- `500 Internal Server Error` - Server-side issue

### Get Course Delivery Formats

```typescript
GET / api / courses / courseDelivery;
```

Fetches course delivery formats.

**Query Parameters:**

- `format` (optional) - Filter by format name
- `id` (optional) - Filter by ID

**Response:**

- `200 OK` - List of delivery formats
- `500 Internal Server Error` - Server-side issue

## Professors

### Get All Professors

```typescript
GET / api / professors;
```

Fetches all professors.

**Response:**

- `200 OK` - List of professors
- `500 Internal Server Error` - Server-side issue

### Create Professor

```typescript
POST / api / professors;
```

Creates a new professor.

**Required Fields:**

- `first_name`
- `last_name`

**Response:**

- `201 Created` - Professor created successfully
- `400 Bad Request` - Missing required fields
- `409 Conflict` - Professor already exists
- `500 Internal Server Error` - Server-side issue

### Get Professor by ID

```typescript
GET / api / professors / { professorId };
```

Fetches professor details and associated courses.

**Response:**

- `200 OK` - Professor details and courses
- `404 Not Found` - Professor not found
- `500 Internal Server Error` - Server-side issue

### Get Professors by Course

```typescript
GET / api / professors / course / { courseCode };
```

Fetches professors teaching a specific course.

**Response:**

- `200 OK` - List of professors
- `404 Not Found` - No professors found
- `500 Internal Server Error` - Server-side issue

## Reviews

### Get Course Reviews

```typescript
GET / api / reviews / courses / { courseCode };
```

Fetches reviews for a specific course.

**Query Parameters:**

- `season` (optional)
- `year` (optional)

**Response:**

- `200 OK` - Course reviews and tags
- `500 Internal Server Error` - Server-side issue

### Create Course Review

```typescript
POST / api / reviews / courses / { courseCode };
```

Creates a new course review.

**Required Fields:**

- `professorId`
- `courseName`
- `term`
- `rating`
- `questions`

**Response:**

- `201 Created` - Review created successfully
- `400 Bad Request` - Missing required fields
- `401 Unauthorized` - User not authenticated
- `500 Internal Server Error` - Server-side issue

### Get Professor Reviews

```typescript
GET / api / reviews / professors / { professorId };
```

Fetches reviews for a specific professor.

**Response:**

- `200 OK` - Professor reviews
- `500 Internal Server Error` - Server-side issue

### Create Professor Review

```typescript
POST / api / reviews / professors / { professorId };
```

Creates a new professor review.

**Required Fields:**

- `courseName`
- `term`
- `questions`
- `commentTitle`
- `comment`
- `grade`

**Response:**

- `201 Created` - Review created successfully
- `400 Bad Request` - Missing required fields
- `401 Unauthorized` - User not authenticated
- `404 Not Found` - Professor/Course not found
- `500 Internal Server Error` - Server-side issue

## Questions

### Get Questions

```typescript
GET / api / questions;
```

Fetches questions based on review type.

**Query Parameters:**

- `type` (required) - Review type ID

**Response:**

- `200 OK` - List of questions
- `400 Bad Request` - Missing review type
- `500 Internal Server Error` - Server-side issue

## Policies

### Get Policies

```typescript
GET / api / policies;
```

Fetches all review policies.

**Response:**

- `200 OK` - List of policies
- `404 Not Found` - No policies found
- `500 Internal Server Error` - Server-side issue

## Error Responses

All endpoints may return the following error responses:

- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server-side error

Each error response includes:

```json
{
  "error": {
    "code": number,
    "message": string
  }
}
```

## Success Responses

Successful responses include:

```json
{
  "data": {
    // Response data
  }
}
```


## Database schema (if applicable)

## Troubleshooting and error-handling details

### API 

## Common Error Patterns

### Authentication Errors

#### 401 Unauthorized
```typescript
{
  "error": {
    "code": 401,
    "message": "User not authenticated"
  }
}
```
**Common Causes:**
- Auth0 session has expired
- Missing or invalid authentication token
- User trying to access protected routes without logging in

**Resolution Steps:**
1. Check if user is logged in via Auth0
2. Verify the session is still valid
3. Try logging out and logging back in
4. Check if the Auth0 configuration is correct in the environment variables

### Data Validation Errors

#### 400 Bad Request
```typescript
{
  "error": {
    "code": 400,
    "message": "Missing required fields"
  }
}
```
**Common Causes in Course Creation:**
- Missing required fields:
  - `course_code`
  - `course_section`
  - `course_name`
  - `course_description`
  - `course_delivery_format_id`
  - `season`
  - `year`

**Common Causes in Review Creation:**
- Missing required fields:
  - `professorId`
  - `courseName`
  - `term`
  - `rating`
  - `questions`

**Resolution Steps:**
1. Verify all required fields are included in the request body
2. Check field data types match the expected format
3. Ensure date formats are correct (if applicable)

### Database Conflicts

#### 409 Conflict
```typescript
{
  "error": {
    "code": 409,
    "message": "This course already exists"
  }
}
```
**Common Causes:**
- Attempting to create duplicate records
- Violating unique constraints
- Trying to delete records with existing relationships

**Resolution Steps:**
1. Check if the resource already exists
2. Use the `forceUpdate` flag if you need to override (for professors)
3. Remove dependent records before deleting parent records

### Resource Not Found

#### 404 Not Found
```typescript
{
  "error": {
    "code": 404,
    "message": "Resource not found"
  }
}
```
**Common Causes:**
- Invalid IDs in URL parameters
- Deleted or non-existent resources
- Incorrect course codes or professor IDs

**Resolution Steps:**
1. Verify the resource ID exists
2. Check for case sensitivity in course codes
3. Ensure the resource hasn't been deleted

## Transaction Handling

### Review Creation Transaction Flow
```typescript
try {
  const transaction = await sequelizeInstance.transaction();
  // Create review
  // Add questions and answers
  await transaction.commit();
} catch (error) {
  await transaction.rollback();
  // Handle error
}
```

**Troubleshooting Steps for Failed Transactions:**
1. Check database logs for deadlocks
2. Verify all required relationships exist
3. Ensure database connection is stable
4. Check for concurrent operations that might conflict

## Redis Cache Issues

### Cache Invalidation
```typescript
const redisKeyPattern = `reviews:${courseCode}:*`;
```

**Common Issues:**
- Stale data
- Cache miss
- Redis connection failures

**Resolution Steps:**
1. Clear Redis cache manually:
```bash
redis-cli KEYS "reviews:*" | xargs redis-cli DEL
```
2. Verify Redis connection settings
3. Check Redis memory usage
4. Monitor cache hit/miss rates

## Logging and Debugging

### Logger Implementation
```typescript
const log = logger.child({ module: 'app/api/route.ts' });

log.info('Operation description', { contextData });
log.error('Error description', { error });
```

**Debug Checklist:**
1. Check log levels are correctly set
2. Verify log output contains necessary context
3. Monitor error patterns in logs
4. Use transaction IDs for tracking requests

## Common Integration Points

### Auth0 Integration
```typescript
export const GET = handleAuth();
```

**Troubleshooting Steps:**
1. Verify Auth0 configuration
2. Check callback URLs
3. Validate token handling
4. Monitor Auth0 logs

### Database Connection
```typescript
await connectDB();
```

**Connection Issues:**
1. Check database credentials
2. Verify network connectivity
3. Monitor connection pool
4. Check for database locks

## Performance Optimization

### Query Optimization
```typescript
const reviews = await Review.findAll({
  include: [...],
  where: {...},
  attributes: [...],
});
```

**Performance Tips:**
1. Use selective column fetching
2. Implement pagination
3. Optimize JOIN operations
4. Use appropriate indexes

### Cache Strategy
```typescript
const cachedData = await redisClient.get(`reviews:${courseCode}:${season}:${year}`);
```

**Optimization Steps:**
1. Cache frequently accessed data
2. Implement cache warming
3. Set appropriate TTL values
4. Monitor cache size

## Environment-Specific Issues

### Development Environment
- Check `.env.local` configuration
- Verify development database connection
- Monitor development logs

### Production Environment
- Validate environment variables
- Check production database connection
- Monitor production logs
- Review error tracking service

## Security Considerations

### API Protection
1. Rate limiting
2. Input validation
3. SQL injection prevention
4. XSS protection

### Data Access
1. Role-based access control
2. Data encryption
3. Secure communication channels

## Monitoring and Alerts

### Key Metrics to Monitor
1. API response times
2. Error rates
3. Database connection pool
4. Cache hit/miss ratio
5. Authentication failures

### Alert Thresholds
1. High error rates (>1%)
2. Slow response times (>2s)
3. Database connection issues
4. Cache failures
5. Authentication spikes

## Support and Escalation

### Level 1 Support
- Basic troubleshooting
- Log analysis
- Common error resolution

### Level 2 Support
- Database issues
- Performance problems
- Integration failures

### Level 3 Support
- System architecture issues
- Security incidents
- Critical production issues
