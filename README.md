# Cycle E-commerce Backend

Backend API for Cycle E-commerce Website built with Node.js and Express.

## Features

- Product management (CRUD operations)
- User authentication and authorization
- Shopping cart functionality
- RESTful API design
- MongoDB database integration

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cycle-ecommerce
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

3. Make sure MongoDB is running on your system

4. Start the server:

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Products

- `GET /api/products` - Get all products (with filters: category, search, featured, pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Users

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)

### Cart

- `GET /api/cart` - Get user cart (Protected)
- `POST /api/cart` - Add item to cart (Protected)
- `PUT /api/cart/:itemId` - Update cart item quantity (Protected)
- `DELETE /api/cart/:itemId` - Remove item from cart (Protected)
- `DELETE /api/cart` - Clear cart (Protected)

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── userController.js
│   │   └── cartController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Product.js
│   │   ├── User.js
│   │   └── Cart.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── userRoutes.js
│   │   └── cartRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```
