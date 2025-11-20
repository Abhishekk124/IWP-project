# Festival Stall Pre-Order and Pickup Website 


## Project Overview
A real-time web application that allows festival attendees to browse food stalls, view menus, place pre-orders, and select pickup times. Stall owners can manage incoming orders through a dedicated dashboard, updating order statuses from "Pending" to "Preparing" to "Ready for Pickup".

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
- **fetch()**: Integrated via Supabase client which uses fetch() internally for all API calls

### ✅ Backend Requirements
- **Database**: Supabase (PostgreSQL) for persistent data storage
- **CRUD Operations**:
  - **GET**: Fetching stalls, menu items, orders, order details
  - **POST**: Creating new orders and order items
  - **UPDATE**: Updating order status (pending → preparing → ready → completed)
  - **DELETE**: Cascade deletes configured in database schema
- **No .json or .txt files**: All data stored in Supabase database

### ✅ Data Storage
- **Supabase Tables**:
  1. `stalls` - Food stall information
  2. `menu_items` - Menu items for each stall
  3. `orders` - Customer orders with pickup times
  4. `order_items` - Individual items in each order
- **Row Level Security (RLS)**: Enabled on all tables with appropriate policies

### ✅ Style & Code Quality
- **Semantic HTML**: Uses `<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<button>`, `<form>`
- **CSS Classes**: All styling via Tailwind CSS classes
- **Modular Code**: Organized into separate component files
- **No Global Variables**: State managed through React hooks and class instances

## Project Structure

```
src/
├── classes/
│   ├── OrderManager.ts      # ES6 Class for order management
│   └── MenuManager.ts        # ES6 Class for menu/stall management
├── components/
│   ├── StallList.tsx         # Browse all food stalls
│   ├── MenuView.tsx          # View menu and add items to cart
│   ├── CheckoutForm.tsx      # Enter customer details and pickup time
│   ├── OrderConfirmation.tsx # Order success confirmation
│   └── StallDashboard.tsx    # Stall owner order management
├── lib/
│   └── supabase.ts           # Supabase client configuration
├── App.tsx                   # Main application with view routing
├── main.tsx                  # Application entry point
└── index.css                 # Tailwind CSS imports
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

## Technical Implementation

### ES6 Classes with Callbacks

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

### Database Schema

The database includes:
- Foreign key relationships between tables
- Check constraints for data validation
- Default values for status and timestamps
- Cascade deletes for data integrity
- RLS policies for security

### Event Handling Examples

1. **Click Events**: Stall selection, menu item add/remove, status updates
2. **Submit Events**: Checkout form submission
3. **Input Events**: Customer detail forms, stall selection dropdown
4. **Change Events**: Date/time picker for pickup time

## How to Present (6-8 minutes)

1. **Introduction (1 min)**:
   - Explain the problem: Long festival food lines
   - Solution: Pre-order and pickup system

2. **Customer Demo (3 min)**:
   - Browse stalls
   - View menu and add items
   - Complete checkout with pickup time
   - Show order confirmation

3. **Owner Dashboard Demo (2 min)**:
   - Show incoming orders
   - Update order status through workflow
   - Explain real-time updates

4. **Technical Overview (2 min)**:
   - React.js frontend with TypeScript
   - Two ES6 Classes (OrderManager, MenuManager)
   - Callbacks for component communication
   - Supabase database with RLS
   - All CRUD operations demonstrated

## Running the Application

```bash
# Development
npm run dev

# Build
npm run build

# Type check
npm run typecheck
```

## Environment Variables

The `.env` file contains Supabase connection details:
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key

## Sample Data

The database is pre-populated with:
- 4 food stalls (Tasty Tacos, Pizza Paradise, Burger Bonanza, Sweet Treats)
- 9 menu items across all stalls
- Ready to accept orders immediately
