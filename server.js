import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { Stall, MenuItem, Order } = require('./models.cjs');

const app = express();
const PORT = 3001;
const MONGODB_URI = process.env.VITE_MONGODB_URI || 'mongodb://localhost:27017/festival-stalls';

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ API Server connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes

// Root endpoint - MongoDB Admin Dashboard
app.get('/', async (req, res) => {
  try {
    const stalls = await Stall.find();
    const menuItems = await MenuItem.find();
    const orders = await Order.find();

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MongoDB Admin Dashboard</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
          .container { max-width: 1200px; margin: 0 auto; }
          h1 { color: white; margin-bottom: 30px; text-align: center; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
          .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
          .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .stat-card h3 { color: #667eea; margin-bottom: 10px; }
          .stat-card .number { font-size: 32px; font-weight: bold; color: #764ba2; }
          .section { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .section h2 { color: #667eea; margin-bottom: 15px; font-size: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th { background: #667eea; color: white; padding: 12px; text-align: left; }
          td { padding: 10px 12px; border-bottom: 1px solid #eee; }
          tr:hover { background: #f5f5f5; }
          .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
          .status.pending { background: #ffc107; color: white; }
          .status.completed { background: #28a745; color: white; }
          .status.cancelled { background: #dc3545; color: white; }
          .link { color: #667eea; text-decoration: none; }
          .link:hover { text-decoration: underline; }
          footer { text-align: center; color: white; margin-top: 40px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🍽️ MongoDB Admin Dashboard</h1>
          
          <div class="stats">
            <div class="stat-card">
              <h3>🏪 Stalls</h3>
              <div class="number">${stalls.length}</div>
            </div>
            <div class="stat-card">
              <h3>🍕 Menu Items</h3>
              <div class="number">${menuItems.length}</div>
            </div>
            <div class="stat-card">
              <h3>📦 Orders</h3>
              <div class="number">${orders.length}</div>
            </div>
          </div>

          <div class="section">
            <h2>🏪 Stalls</h2>
            <table>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Owner Email</th>
              </tr>
              ${stalls.map(s => `
                <tr>
                  <td><code>${s._id}</code></td>
                  <td>${s.name}</td>
                  <td>${s.description}</td>
                  <td>${s.owner_email}</td>
                </tr>
              `).join('')}
            </table>
          </div>

          <div class="section">
            <h2>🍕 Menu Items</h2>
            <table>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Available</th>
                <th>Stall</th>
              </tr>
              ${menuItems.map(m => `
                <tr>
                  <td><code>${m._id}</code></td>
                  <td>${m.name}</td>
                  <td>$${m.price}</td>
                  <td>${m.available ? '✅' : '❌'}</td>
                  <td>${stalls.find(s => s._id.toString() === m.stall_id.toString())?.name || 'Unknown'}</td>
                </tr>
              `).join('')}
            </table>
          </div>

          <div class="section">
            <h2>📦 Orders</h2>
            <table>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Stall</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Pickup Time</th>
              </tr>
              ${orders.map(o => `
                <tr>
                  <td><code>${o._id}</code></td>
                  <td>${o.customer_name}</td>
                  <td>${stalls.find(s => s._id.toString() === o.stall_id.toString())?.name || 'Unknown'}</td>
                  <td>${o.items.length} item(s)</td>
                  <td>$${o.total_amount}</td>
                  <td><span class="status ${o.status}">${o.status.toUpperCase()}</span></td>
                  <td>${new Date(o.pickup_time).toLocaleString()}</td>
                </tr>
              `).join('')}
            </table>
          </div>

          <footer>
            <p>API Server running at http://localhost:3001</p>
            <p>Frontend at http://localhost:5174</p>
            <p>MongoDB: ${MONGODB_URI}</p>
          </footer>
        </div>
      </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    console.error('Error loading dashboard:', error);
    res.status(500).send('Error loading dashboard');
  }
});

// Get all stalls
app.get('/api/stalls', async (req, res) => {
  try {
    const stalls = await Stall.find().sort({ name: 1 });
    res.json(stalls);
  } catch (error) {
    console.error('Error fetching stalls:', error);
    res.status(500).json({ error: 'Failed to fetch stalls' });
  }
});

// Get menu items by stall
app.get('/api/menu/:stallId', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ stall_id: req.params.stallId }).sort({ name: 1 });
    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// Create order
app.post('/api/orders', async (req, res) => {
  try {
    const { stall_id, customer_name, customer_email, customer_phone, pickup_time, total_amount, items } = req.body;

    const order = new Order({
      stall_id,
      customer_name,
      customer_email,
      customer_phone,
      pickup_time: new Date(pickup_time),
      status: 'pending',
      total_amount,
      items
    });

    const savedOrder = await order.save();
    res.json({ success: true, orderId: savedOrder._id });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get orders by stall
app.get('/api/orders/:stallId', async (req, res) => {
  try {
    const orders = await Order.find({ stall_id: req.params.stallId }).sort({ created_at: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status
app.patch('/api/orders/:orderId', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Get order details
app.get('/api/orders-detail/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('stall_id')
      .populate('items.menu_item_id');
    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running at http://localhost:${PORT}`);
});
