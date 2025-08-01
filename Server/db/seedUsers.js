const userService = require("../services/userService");

// Seed 5 users if none exist
async function seedUsers(createdById) {
  const count = await userService.countDocuments({ role: "user" });

  // If users already exist, do not seed
  if (count >= 5) {
    return (await userService.find({ role: "user" }, 5)).map((user) =>
      String(user._id)
    );
  }

  // Create 5 sample users
  const users = usersData.map((user) => ({
    ...user,
    createBy: createdById,
  }));

  // Insert users into the database
  const userIds = await userService.insertMany(users);

  console.log(`Seeded ${userIds.length} users.`);

  return userIds;
}

module.exports = seedUsers;

// static users data for seeding
const usersData = [
  {
    _id: "64d33173fd7ff3fa0924a101",
    email: "user1@example.com",
    password: "PasswordHash1", // پیش از insert در DB باید هش شود
    role: "user",
    username: "User One",
    deleted: false,
  },
  {
    _id: "64d33173fd7ff3fa0924a102",
    email: "user2@example.com",
    password: "PasswordHash2",
    role: "user",
    username: "User Two",
    deleted: false,
  },
  {
    _id: "64d33173fd7ff3fa0924a103",
    email: "user3@example.com",
    password: "PasswordHash3",
    role: "user",
    username: "User Three",
    deleted: false,
  },
  {
    _id: "64d33173fd7ff3fa0924a104",
    email: "user4@example.com",
    password: "PasswordHash4",
    role: "user",
    username: "User Four",
    deleted: false,
  },
  {
    _id: "64d33173fd7ff3fa0924a105",
    email: "user5@example.com",
    password: "PasswordHash5",
    role: "user",
    username: "User Five",
    deleted: false,
  },
];
