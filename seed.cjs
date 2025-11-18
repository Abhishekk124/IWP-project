const mongoose = require('mongoose');

// Define schemas inline since we're using CommonJS
const stallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  owner_email: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const menuItemSchema = new mongoose.Schema({
  stall_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Stall', required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  available: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

const Stall = mongoose.model('Stall', stallSchema);
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

const MONGODB_URI = process.env.VITE_MONGODB_URI || 'mongodb://localhost:27017/festival-stalls';

async function seedDatabase() {
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Stall.deleteMany({});
    await MenuItem.deleteMany({});

    // Create stalls
    console.log('🍽️  Creating stalls...');
    const stallsData = [
      {
        name: 'Tasty Tacos',
        description: 'Authentic Mexican street tacos with fresh ingredients',
        owner_email: 'tacos@festival.com'
      },
      {
        name: 'Pizza Paradise',
        description: 'Wood-fired pizzas with gourmet toppings',
        owner_email: 'pizza@festival.com'
      },
      {
        name: 'Burger Bonanza',
        description: 'Juicy burgers with creative combinations',
        owner_email: 'burgers@festival.com'
      },
      {
        name: 'Sweet Treats',
        description: 'Artisan desserts and ice cream',
        owner_email: 'sweets@festival.com'
      }
    ];

    const stalls = await Stall.insertMany(stallsData);
    console.log(`✅ Created ${stalls.length} stalls`);

    // Create menu items
    console.log('🍴 Creating menu items...');
    const menuItemsData = [
      // Tacos
      {
        stall_id: stalls[0]._id,
        name: 'Chicken Taco',
        description: 'Grilled chicken with salsa and guacamole',
        price: 5.99,
        available: true
      },
      {
        stall_id: stalls[0]._id,
        name: 'Beef Taco',
        description: 'Seasoned beef with cheese and lettuce',
        price: 6.49,
        available: true
      },
      {
        stall_id: stalls[0]._id,
        name: 'Veggie Taco',
        description: 'Grilled vegetables with black beans',
        price: 5.49,
        available: true
      },
      // Pizza
      {
        stall_id: stalls[1]._id,
        name: 'Margherita Pizza',
        description: 'Classic tomato, mozzarella, and basil',
        price: 12.99,
        available: true
      },
      {
        stall_id: stalls[1]._id,
        name: 'Pepperoni Pizza',
        description: 'Loaded with pepperoni and cheese',
        price: 14.99,
        available: true
      },
      // Burgers
      {
        stall_id: stalls[2]._id,
        name: 'Classic Burger',
        description: 'Beef patty with lettuce, tomato, and cheese',
        price: 8.99,
        available: true
      },
      {
        stall_id: stalls[2]._id,
        name: 'Spicy Chicken Burger',
        description: 'Crispy chicken with spicy mayo',
        price: 9.49,
        available: true
      },
      // Sweet Treats
      {
        stall_id: stalls[3]._id,
        name: 'Chocolate Brownie',
        description: 'Warm brownie with vanilla ice cream',
        price: 6.99,
        available: true
      },
      {
        stall_id: stalls[3]._id,
        name: 'Fruit Smoothie',
        description: 'Fresh fruit blended with yogurt',
        price: 5.49,
        available: true
      }
    ];

    const menuItems = await MenuItem.insertMany(menuItemsData);
    console.log(`✅ Created ${menuItems.length} menu items`);

    console.log('\n🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

seedDatabase();
