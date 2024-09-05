// _scripts/mongo-init.js

/* 
  Resources used to create this file:
  * https://www.mongodb.com/developer/products/mongodb/cheat-sheet/#handy-commands
  
*/

// Switch to the coursemetricsDB database
db = db.getSiblingDB('coursemetricsDB');

// Creating all the collections needed
db.createCollection('users'); // Create a collection named 'users'

db.users.insertMany([
  { name: 'Alice', age: 30, email: 'alice@example.com' },
  { name: 'Bob', age: 25, email: 'bob@example.com' },
  { name: 'Charlie', age: 35, email: 'charlie@example.com' },
]);

db.createCollection('products'); // Create a collection named 'products'

db.products.insertMany([
  { name: 'Laptop', price: 1200, category: 'Electronics' },
  { name: 'Phone', price: 800, category: 'Electronics' },
  { name: 'Book', price: 20, category: 'Stationery' },
]);

print('Sample data created in the sampledb database.');
