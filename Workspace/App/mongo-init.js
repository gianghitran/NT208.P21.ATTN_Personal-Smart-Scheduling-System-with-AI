db = db.getSiblingDB("dbname"); // Change your database name here match with env

db.users.insertOne({
  full_name: "Admin User",
  email: "admin@example.com",
  password: "$2b$10$kjScZTzqnFy7hNN2Nx7xoeRvjXH2Ye9bQwhW6wU9x07fJh5CS9xwu", // superAdminPassword
  admin: true,
  isVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
});
