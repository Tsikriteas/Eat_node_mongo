const mongoose = require('mongoose');
const Category = require('../models/Category');
const Item = require('../models/Item');

async function seed() {
    try {
        // Σύνδεση στη βάση δεδομένων MongoDB
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

        // Εισαγωγή κατηγοριών στη βάση
        const insertedCategories = await Category.insertMany(categories);
        console.log('Inserted categories:', insertedCategories);

        // Αρχικά δεδομένα ειδών
        const items = [
            { name: 'Margarita Pizza', description: 'Classic margarita pizza', price: 12.99, currency: 'EUR', category: insertedCategories[0]._id, imageUrl: 'https://example.com/margarita.jpg' },
            { name: 'Cheeseburger', description: 'Tasty cheeseburger', price: 8.99, currency: 'EUR', category: insertedCategories[1]._id, imageUrl: 'https://example.com/cheeseburger.jpg' },
            { name: 'Greek Salad', description: 'Healthy greek salad', price: 6.99, currency: 'EUR', category: insertedCategories[2]._id, imageUrl: 'https://example.com/greek-salad.jpg' }
        ];

        // Εισαγωγή ειδών στη βάση
        const insertedItems = await Item.insertMany(items);
        console.log('Inserted items:', insertedItems);

        // Αποσύνδεση από τη βάση δεδομένων
        console.log('Seed completed successfully!');
    } catch (err) {
        console.error('Error seeding database:', err.message);
        process.exit(1); // Έξοδος με κωδικό σφάλματος
    }
}

module.exports = seed;
