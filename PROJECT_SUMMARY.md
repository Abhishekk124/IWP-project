# Festival Stall Pre-Order and Pickup System

## Project Overview
A real-time web application that allows festival attendees to browse food stalls, view menus, place pre-orders, and select pickup times. Stall owners can manage incoming orders through a dedicated dashboard, updating order statuses from "Pending" to "Preparing" to "Ready for Pickup". Built with React + TypeScript frontend, Express.js backend, and MongoDB database.

## Project Requirements Checklist

### ✅ Frontend Requirements
- **React.js**: All components built using React with TypeScript
- **Object-Oriented JavaScript**: Two ES6 classes implemented:
  1. `OrderManager` (src/classes/OrderManager.ts) - Manages order creation, fetching, and status updates
  2. `MenuManager` (src/classes/MenuManager.ts) - Handles stall and menu item data management
- **Callbacks/Custom Events**:
  - `setOrderUpdateCallback()` in OrderManager (line 20-22)
  - `setMenuUpdateCallback()` in MenuManager (line 23-25)
  - Used to communicate state changes between classes and components
- **User Events**: Multiple event listeners implemented:
  - Click events (buttons, stall selection, menu items)
  - Submit events (checkout form)
  - Input/change events (form inputs, stall selection)
- **fetch()**: All API calls use native fetch() to communicate with Express REST API

### ✅ Backend Requirements
- **Node.js + Express**: RESTful API server with 7 endpoints
- **Database**: MongoDB (local instance) for persistent data storage
- **CRUD Operations**:
  - **GET**: /api/stalls, /api/menu/:stallId, /api/orders, /api/orders/:orderId
  - **POST**: /api/orders (create new orders)
  - **PATCH**: /api/orders/:orderId (update order status)
  - **DELETE**: Configured for cascade deletions
- **No .json or .txt files**: All data stored in MongoDB collections

### ✅ Data Storage
- **MongoDB Collections**:
  1. `stalls` - Food stall information with name, description, owner email
  2. `menuitems` - Menu items for each stall with pricing
  3. `orders` - Customer orders with status tracking
  4. `orderitems` - Individual items in each order (subdocument)
- **Schema Validation**: Mongoose schemas enforce data integrity and relationships

### ✅ Style & Code Quality
- **Semantic HTML**: Uses `<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<button>`, `<form>`
- **CSS Classes**: All styling via Tailwind CSS classes
- **Modular Code**: Organized into separate component files
- **No Global Variables**: State managed through React hooks and class instances

## Project Structure

```
project/
├── src/
│   ├── classes/
│   │   ├── OrderManager.ts      # ES6 Class for order management
│   │   └── MenuManager.ts        # ES6 Class for menu/stall management
│   ├── components/
│   │   ├── StallList.tsx         # Browse all food stalls
│   │   ├── MenuView.tsx          # View menu and add items to cart
│   │   ├── CheckoutForm.tsx      # Enter customer details and pickup time
│   │   ├── OrderConfirmation.tsx # Order success confirmation
│   │   └── StallDashboard.tsx    # Stall owner order management
│   ├── App.tsx                   # Main application with view routing
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Tailwind CSS imports
├── models.cjs                    # Mongoose schema definitions
├── seed.cjs                      # Database seeding script
├── server.js                     # Express API server with admin dashboard
├── package.json                  # Dependencies and scripts
├── vite.config.ts                # Vite configuration
└── tsconfig.json                 # TypeScript configuration
```

## Key Features

### Customer Experience
1. **Browse Stalls**: View all available food stalls with descriptions
2. **View Menus**: See menu items with prices and descriptions
3. **Add to Cart**: Select items and quantities with intuitive +/- buttons
4. **Select Pickup Time**: Choose a pickup time (minimum 30 minutes ahead)
5. **Order Confirmation**: Receive order details and pickup time confirmation

### Stall Owner Dashboard
1. **Real-time Orders**: View all orders for selected stall
2. **Order Status Updates**: Update status with single click
3. **Order Details**: View customer info, items, and pickup times
4. **Status Filtering**: Visual breakdown by status (pending/preparing/ready/completed)
5. **Refresh**: Manual refresh to get latest orders
6. **Admin Dashboard**: Access via Express server at http://localhost:3001

## Technical Implementation

### Tech Stack

**Frontend**:
- React 18.3.1 with TypeScript 5.5.3
- Vite 5.4.8 dev server
- Tailwind CSS 3.4.1
- Lucide React icons

**Backend**:
- Express 5.1.0 REST API
- Node.js 20.19.0 runtime
- Mongoose 8.20.0 ODM
- CORS 2.8.5

**Database**:
- MongoDB 8.2.1 (local instance)
- Port: 27017
- Database: festival-stalls

**OrderManager Class**:
```typescript
class OrderManager {
  private onOrderUpdateCallback?: (orders: Order[]) => void;

  setOrderUpdateCallback(callback: (orders: Order[]) => void): void {
    this.onOrderUpdateCallback = callback;
  }

  // Methods: createOrder, fetchOrdersByStall, updateOrderStatus, fetchOrderDetails
}
```

**MenuManager Class**:
```typescript
class MenuManager {
  private onMenuUpdateCallback?: (items: MenuItem[]) => void;

  setMenuUpdateCallback(callback: (items: MenuItem[]) => void): void {
    this.onMenuUpdateCallback = callback;
  }

  // Methods: fetchAllStalls, fetchMenuByStall, findStallById, findMenuItemById
}
```

### API Endpoints

- `GET /` - Admin dashboard with menu items and orders
- `GET /api/stalls` - All food stalls
- `GET /api/menu/:stallId` - Menu items for a stall
- `POST /api/orders` - Create new order
- `GET /api/orders` - All orders
- `GET /api/orders/:orderId` - Specific order details
- `PATCH /api/orders/:orderId` - Update order status

### Event Handling

1. **Click Events**: Stall selection, menu item add/remove, status updates
2. **Submit Events**: Checkout form submission
3. **Input Events**: Customer detail forms, stall selection dropdown
4. **Change Events**: Date/time picker for pickup time

## How to Present (6-8 minutes)

1. **Introduction (1 min)**:
   - Explain the problem: Long festival food lines
   - Solution: Pre-order and pickup system with real-time updates

2. **Customer Demo (3 min)**:
   - Browse stalls
   - View menu with pricing
   - Add items to cart
   - Complete checkout with pickup time
   - Show order confirmation

3. **Owner Dashboard Demo (2 min)**:
   - Show incoming orders
   - Update order status through workflow
   - Explain real-time order management

4. **Technical Overview (2 min)**:
   - React.js frontend with TypeScript
   - Express.js backend REST API
   - MongoDB database with Mongoose ODM
   - Two ES6 Classes (OrderManager, MenuManager)
   - All CRUD operations demonstrated

## Running the Application

```bash
# Install dependencies
npm install

# Seed the database with initial data
npm run seed

# Development (starts all services)
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck
```

## Manual Service Startup

If needed, start services individually:

```bash
# Start MongoDB
"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\Users\baban\AppData\Local\MongoDB\data"

# Start Express backend (in new terminal)
node server.js

# Start Vite frontend (in new terminal)
npm run dev
```

## Environment Variables

The `.env` file contains:
- `VITE_MONGODB_URI`: MongoDB connection string (defaults to mongodb://localhost:27017/festival-stalls)

## Sample Data

The database is pre-populated with:
- **4 food stalls**: Tasty Tacos, Pizza Paradise, Burger Bonanza, Sweet Treats
- **20 menu items** across all stalls:
  - **Tasty Tacos** (5 items): Chicken Taco, Beef Taco, Veggie Taco, Fish Taco, Carnitas Taco
  - **Pizza Paradise** (5 items): Margherita Pizza, Pepperoni Pizza, Vegetarian Pizza, BBQ Chicken Pizza, Four Cheese Pizza
  - **Burger Bonanza** (5 items): Classic Burger, Spicy Chicken Burger, Bacon Burger, Mushroom Swiss Burger, Double Deluxe Burger
  - **Sweet Treats** (5 items): Chocolate Brownie, Fruit Smoothie, Strawberry Cheesecake, Vanilla Ice Cream Sundae, Mango Lassi
- Ready to accept orders immediately

## Access Points

- **Customer Interface**: http://localhost:5173
- **Admin Dashboard**: http://localhost:3001
- **API Server**: http://localhost:3001/api
- **MongoDB**: localhost:27017
