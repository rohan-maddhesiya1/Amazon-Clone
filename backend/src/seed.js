import sequelize from './config/db.js';
import Product from './models/Product.js';
import Category from './models/Category.js';

const seedData = async () => {
    try {
        // 1. Sync and Clear existing data
        // CAUTION: force: true drops tables and recreates them
        await sequelize.sync({ force: true });
        console.log('Database cleared!');

        // 2. Create Categories
        const categories = await Category.bulkCreate([
            { name: 'Electronics', description: 'Gadgets, Mobiles, and Laptops' },
            { name: 'Fashion', description: 'Clothing, Shoes, and Accessories' },
            { name: 'Home & Kitchen', description: 'Furniture and Kitchenware' },
            { name: 'Books', description: 'Fiction, Non-fiction, and Academic' }
        ]);

        console.log('Categories seeded!');

        // 3. Create Products
        // We use the ID from categories to link them
        const electronicsId = categories[0].id;
        const fashionId = categories[1].id;
        const homeId = categories[2].id;

        await Product.bulkCreate([
            {
                name: 'iPhone 15 Pro',
                description: 'The latest iPhone with Titanium design and A17 Pro chip.',
                price: 999.00,
                countInStock: 10,
                imageUrl: 'https://m.media-amazon.com/images/I/81SigAnN1KL._AC_SL1500_.jpg',
                brand: 'Apple',
                rating: 4.8,
                numReviews: 1240,
                categoryId: electronicsId
            },
            {
                name: 'Sony WH-1000XM5',
                description: 'Industry-leading noise canceling headphones.',
                price: 348.00,
                countInStock: 5,
                imageUrl: 'https://m.media-amazon.com/images/I/51aXvjzcukL._AC_SL1500_.jpg',
                brand: 'Sony',
                rating: 4.5,
                numReviews: 850,
                categoryId: electronicsId
            },
            {
                name: 'Men\'s Casual Slim Fit T-Shirt',
                description: 'Comfortable and stylish cotton t-shirt.',
                price: 25.99,
                countInStock: 50,
                imageUrl: 'https://m.media-amazon.com/images/I/719Fv9u9V8L._AC_UX679_.jpg',
                brand: 'Generic',
                rating: 4.0,
                numReviews: 320,
                categoryId: fashionId
            },
            {
                name: 'Ninja AF101 Air Fryer',
                description: '4-quart capacity air fryer that crisps and roasts.',
                price: 89.99,
                countInStock: 15,
                imageUrl: 'https://m.media-amazon.com/images/I/71S6S689W8L._AC_SL1500_.jpg',
                brand: 'Ninja',
                rating: 4.7,
                numReviews: 21000,
                categoryId: homeId
            }
        ]);

        console.log('Products seeded successfully!');
        process.exit(); // Exit the script
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();