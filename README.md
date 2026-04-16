# AmazonClone E-Commerce Application

A full-stack e-commerce application inspired by Amazon, built with modern web technologies.

## Features

- **User Authentication**: Secure login and signup with JWT tokens
- **Product Management**: Browse, search, and view detailed product information
- **Shopping Cart**: Add, remove, and manage cart items
- **Order Management**: Place orders and track order history
- **Responsive Design**: Mobile-friendly interface
- **Admin Features**: Product and category management (backend ready)

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** for database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Frontend
- **React** with Vite for fast development
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Axios** for API calls
- **Tailwind CSS** for styling (assumed based on structure)

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. Seed the database (optional):
   ```bash
   npm run seed
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173` (Vite default).

## Usage

1. Register a new account or login with existing credentials
2. Browse products on the homepage
3. Use the search functionality to find specific products
4. Add items to your cart
5. Proceed to checkout to place an order
6. View your order history in the Orders page

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID

## Project Structure

```
amazon-2.0/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── server.js
│   ├── package.json
│   └── vercel.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── store/
    ├── public/
    ├── package.json
    ├── vite.config.js
    └── vercel.json
```


## Acknowledgments

- Inspired by Amazon's e-commerce platform
- Built with modern web development best practices
