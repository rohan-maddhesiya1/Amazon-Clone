import sequelize from './src/config/db.js';
import Category from './src/models/Category.js';
import Product from './src/models/Product.js';
import CartItem from './src/models/Cart.js';
import { Order, OrderItem } from './src/models/Order.js';

const products = [
  {
    cat: "Books",
    name: "The Alchemist by Paulo Coelho",
    description: "The Alchemist is a timeless masterpiece by Paulo Coelho that has inspired millions of readers across the globe. The novel follows Santiago, a young Andalusian shepherd boy, on his journey to the Egyptian pyramids, following a recurring dream of finding a treasure. Along the way he meets wise men, a crystal merchant, an Englishman, and an alchemist, all of whom point him toward his Personal Legend. It is a story about daring to dream, listening to your heart, and recognizing opportunity when it arrives. A must-read for anyone searching for meaning and purpose in their life.",
    price: 299.00,
    countInStock: 50,
    brand: "HarperOne",
    rating: 4.8,
    numReviews: 312000,
    imageUrl: "/images/Alchemist_1.jpg",
    images: ["/images/Alchemist_1.jpg", "/images/Alchemist_2.jpg"]
  },
  {
    cat: "Home",
    name: "Livpure Allura RO+UV+UF Water Purifier",
    description: "The Livpure Allura is a state-of-the-art water purifier designed for modern Indian households. Equipped with advanced RO, UV, and UF purification technology, it effectively eliminates bacteria, viruses, dissolved salts, heavy metals, and other contaminants from tap water. With a tank capacity of 7 litres, it delivers up to 15 litres per hour of pure, safe drinking water. The built-in mineralizer retains essential natural minerals, ensuring that the water is not only clean but also healthy. A smart alert system notifies you when the filter needs replacement, making maintenance completely hassle-free.",
    price: 8999.00,
    countInStock: 20,
    brand: "Livpure",
    rating: 4.4,
    numReviews: 18500,
    imageUrl: "/images/LivpureAlluraWaterPurifier_1.jpg",
    images: ["/images/LivpureAlluraWaterPurifier_1.jpg", "/images/LivpureAlluraWaterPurifier_2.jpg"]
  },
  {
    cat: "Electronics",
    name: "Logitech MX Master 3S Wireless Performance Mouse",
    description: "The Logitech MX Master 3S is the pinnacle of wireless mouse engineering, designed for power users and creative professionals who demand the best. It features an ultra-precise 8000 DPI optical sensor that tracks flawlessly on virtually any surface, including glass. The MagSpeed electromagnetic scroll wheel lets you scroll through 1000 lines in one second, with quiet, satisfying clicks that won't disturb your work environment. Connect to up to three devices simultaneously via Bluetooth or the USB receiver, and switch between them instantly with the Easy-Switch button. Charges via USB-C and supports multi-device workflow like a pro.",
    price: 9495.00,
    countInStock: 35,
    brand: "Logitech",
    rating: 4.7,
    numReviews: 12800,
    imageUrl: "/images/LogitechMouse1.jpg",
    images: ["/images/LogitechMouse1.jpg", "/images/LogitechMouse2.jpg"]
  },
  {
    cat: "Fashion",
    name: "Premium PET Lover Graphic T-Shirt",
    description: "Show off your love for your furry friends with this adorable and comfortable Premium PET Lover Graphic T-Shirt. Made from 100% soft-touch cotton fabric, it offers a breathable and lightweight feel perfect for everyday casual wear. The high-resolution pet-themed print is fade-resistant, ensuring the design stays vibrant wash after wash. Designed with a relaxed unisex fit, this tee is available in multiple sizes from S to XXL, making it perfect for all body types. Whether you are a dog person, cat parent, or simply an animal lover, this shirt is the ultimate statement piece for you.",
    price: 499.00,
    countInStock: 100,
    brand: "PawPrints Co.",
    rating: 4.3,
    numReviews: 2400,
    imageUrl: "/images/PETshirt_1.jpg",
    images: ["/images/PETshirt_1.jpg", "/images/PETshirt_2.jpg"]
  }
];

async function reseed() {
  await sequelize.sync({ alter: true });

  console.log("Clearing OrderItems...");
  await OrderItem.destroy({ where: {} });

  console.log("Clearing CartItems...");
  await CartItem.destroy({ where: {} });

  console.log("Clearing Orders...");
  await Order.destroy({ where: {} });

  console.log("Clearing Products...");
  await Product.destroy({ where: {} });

  console.log("Clearing Categories...");
  await Category.destroy({ where: {} });

  console.log("Seeding 4 new products...");
  for (const item of products) {
    const [category] = await Category.findOrCreate({ where: { name: item.cat } });
    await Product.create({
      name: item.name,
      description: item.description,
      price: item.price,
      countInStock: item.countInStock,
      brand: item.brand,
      rating: item.rating,
      numReviews: item.numReviews,
      imageUrl: item.imageUrl,
      images: item.images,
      categoryId: category.id
    });
    console.log(`  ✅ ${item.name}`);
  }

  console.log("\n🎉 Done! 4 products inserted. Users are untouched.");
}

reseed().catch(console.error).finally(() => process.exit(0));
