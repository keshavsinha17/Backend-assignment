# Backend Assignment - Order Management System

A comprehensive order management system with user authentication, product management, and inventory tracking.

## Features

- User Authentication & Authorization
  - User registration with email/phone verification
  - Admin user management
  - Role-based access control

- Product Management
  - CRUD operations for products
  - Warehouse management
  - Stock tracking with threshold alerts
  - Location-based product tracking

- Order Management
  - Order creation with product selection
  - Order status tracking (pending, accepted, rejected)
  - Stock management based on order status
  - Delivery location tracking

- Inventory Management
  - Real-time stock tracking
  - Low stock threshold notifications
  - Warehouse capacity management

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Postman (for API testing)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd Backend-assignment
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/backend-assignment
JWT_SECRET=your_secure_jwt_secret_key
```

4. Start the server:
```bash
node index.js
```

## API Documentation

### Postman Collection
The API documentation is available in the [Backend-Assignment.postman_collection.json](cci:7://file:///c:/Users/Tanya/OneDrive/Desktop/Backend-assignment/Backend-Assignment.postman_collection.json:0:0-0:0) file, which includes all the endpoints with example requests and responses. You can import this collection into Postman to test the API endpoints.

To use the Postman collection:
1. Import the [Backend-Assignment.postman_collection.json](cci:7://file:///c:/Users/Tanya/OneDrive/Desktop/Backend-assignment/Backend-Assignment.postman_collection.json:0:0-0:0) file into Postman
2. Set up environment variables:
   - `baseUrl`: `http://localhost:5000`
   - `jwtToken`: Your JWT token (after login)
3. Use the pre-request scripts and test scripts included in the collection
4. Test all endpoints with example data included in the collection

### Detailed API Documentation

#### Authentication

#### User Signup
- **POST** `/api/auth/signup`
- Creates a new user account (requires admin approval)
- Request Body:
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phoneNumber": "string",
  "password": "string",
  "location": {
    "latitude": number,
    "longitude": number
  }
}
```

#### Admin Signup
- **POST** `/api/auth/signup`
- Creates a new admin account (automatically approved)
- Request Body:
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phoneNumber": "string",
  "password": "string",
  "location": {
    "latitude": number,
    "longitude": number
  },
  "isAdmin": true
}
```

#### Login
- **POST** `/api/auth/login`
- Authenticate user and get JWT token
- Request Body:
```json
{
  "identifier": "email_or_phone",
  "password": "string"
}
```

### Admin Endpoints

#### Manage Users
- **GET** `/api/admin/users`
- Get list of all users

- **PUT** `/api/admin/users/:userId/status`
- Update user status
- Request Body:
```json
{
  "status": "pending|approved|rejected|blocked"
}
```

#### Manage Products
- **POST** `/api/admin/products`
- Add new product
- Request Body:
```json
{
  "name": "string",
  "description": "string",
  "price": number,
  "stock": number,
  "originalStock": number,
  "warehouseId": "ObjectId",
  "location": {
    "latitude": number,
    "longitude": number
  },
  "category": "string"
}
```

#### Manage Orders
- **PATCH** `/api/orders/:orderId`
- Update order status
- Request Body:
```json
{
  "status": "pending|accepted|rejected"
}
```

### User Endpoints

#### Create Order
- **POST** `/api/orders`
- Create new order
- Request Body:
```json
{
  "products": [
    {
      "productId": "ObjectId",
      "quantity": number
    }
  ],
  "deliveryAddress": "string",
  "deliveryLocation": {
    "latitude": number,
    "longitude": number
  }
}
```

#### Get User Orders
- **GET** `/api/orders`
- Get list of user's orders

## Technology Stack

- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT
- **Location Services**: Geolocation API
- **Stock Management**: Real-time monitoring with threshold alerts

## Security Features

- JWT-based authentication
- Password hashing
- Role-based access control
- Input validation
- Rate limiting
- Secure cookie handling

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please create an issue in the GitHub repository.
