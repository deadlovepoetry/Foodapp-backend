const mongoose = require('mongoose');

// Replace <password> with your actual password, percent-encoded if it contains special characters
const mongoURI = 'mongodb+srv://deadlovepoetry:%40AnAm2003%23@cluster0.8e4y8kv.mongodb.net/food_item?retryWrites=true&w=majority&appName=Cluster0';

const mongoDB = async () => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    console.log("Fetching data from 'food' and 'foodCategory' collections");

    // Fetch data from the 'food' collection
    const foodCollection = db.collection("food");
    const foodData = await foodCollection.find({}).toArray();
    if (foodData.length === 0) {
      console.log("No data found in 'food' collection");
    }
    global.food_items = foodData;
    console.log('food_items:', global.food_items);

    // Fetch data from the 'foodCategory' collection
    const foodCategoryCollection = db.collection("foodCategory");
    const foodCategoryData = await foodCategoryCollection.find({}).toArray();
    if (foodCategoryData.length === 0) {
      console.log("No data found in 'foodCategory' collection");
    }
    global.foodCategory = foodCategoryData;
    console.log('foodCategory:', global.foodCategory);

    // Construct the response array
    global.responseData = [global.food_items, global.foodCategory];

  } catch (error) {
    console.error("Error connecting to MongoDB or fetching data:", error);
    process.exit(1); // Exit the process with an error code
  }
};

module.exports = mongoDB;
