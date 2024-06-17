const mongoose = require('mongoose');
const Category = require('../models/Category');
const Item = require('../models/Item');
const User= require('../models/User')
const bcrypt = require('bcryptjs');

async function seed() {
    try {
        //MongoDB connection
        await mongoose.connect('mongodb://localhost:27017/online-delivery', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Αρχικά δεδομένα κατηγοριών
        const categories = [
            { name: 'Pizza', description: 'Delicious pizzas' },
            { name: 'Burgers', description: 'Juicy burgers' },
            { name: 'Salads', description: 'Fresh salads' }
        ];

        // insert categories
        const insertedCategories = await Category.insertMany(categories);
        console.log('Inserted categories:', insertedCategories);

        //insert items
        const items = [
            { name: 'Pepperoni Pizza', description: 'Classic pepperoni pizza with mozzarella cheese and tangy tomato sauce.', price: 13.49, currency: 'EUR', category: insertedCategories[0]._id, imageUrl: ' '},
            { name: 'Hawaiian Pizza', description: 'Sweet and savory with juicy.', price: 11.99, currency: 'EUR', category: insertedCategories[0]._id, imageUrl: ' '},
            { name: 'Veggie Supreme Pizza', description: 'Loaded with colorful bell peppers, mushrooms, onions, and olives.', price: 14.99, currency: 'EUR', category: insertedCategories[0]._id, imageUrl: ' '},
            { name: 'Bacon Cheeseburger', description: 'Cheeseburger with crispy bacon and all the classic toppings.', price: 9.99, currency: 'EUR', category: insertedCategories[1]._id, imageUrl: ' '},
            { name: 'BBQ Chicken Burger', description: 'Grilled chicken breast with smoky BBQ sauce and crispy onions.', price: 10.49, currency: 'EUR', category: insertedCategories[1]._id, imageUrl: ' '},
            { name: 'Mushroom Burger', description: 'Angus beef patty with sautéed mushrooms and melted Swiss cheese.', price: 11.49, currency: 'EUR', category: insertedCategories[1]._id, imageUrl: ' '},
            { name: 'Caesar Salad', description: 'Romaine lettuce tossed with creamy Caesar dressing, croutons, and Parmesan cheese.', price: 7.99, currency: 'EUR', category: insertedCategories[2]._id, imageUrl: ' '},
            { name: 'Chef Salad', description: 'Caesar salad with grilled chicken breast for added protein.', price: 9.49, currency: 'EUR', category: insertedCategories[2]._id, imageUrl: ' '},
            { name: 'Cobb Salad', description: 'Hearty salad with grilled chicken, bacon, avocado, tomatoes, and blue cheese crumbles.', price: 8.99, currency: 'EUR', category: insertedCategories[2]._id, imageUrl: ' '}
        ];

        const insertedItems = await Item.insertMany(items);
        console.log('Seed items completed successfully!');

        const users = [
            { username: 'test', password: '12345678', role: 'user', customerAddress: 'Ampelokipi, Athens', customerPhone: '69999999999' },
            { username: 'admin', password: 'admin', role: 'merchant', customerAddress: 'Athens', customerPhone: '6987654321' },
        ];

        for (const user of users) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }

        const insertedUsers = await User.insertMany(users);
        console.log('Seed users completed successfully!');

    } catch (err) {
        console.error('Error seeding database:', err.message);
        process.exit(1);
    }
}

module.exports = seed;
