const contactService = require("../services/contactService");

// Seed 5 contacts if none exist
async function seedContacts(createdById) {
  const count = await contactService.countDocuments();

  // If contacts already exist, do not seed
  if (count >= 5) {
    return (await contactService.find({}, 5)).map((contact) =>
      String(contact._id)
    );
  }

  // Create 5 sample contacts
  const contacts = contactsData.map((contact) => ({
    ...contact,
    createBy: createdById,
  }));

  // Insert contacts into the database
  const insertedIds = await contactService.insertMany(contacts);

  console.log(`Seeded ${insertedIds.length} contacts.`);

  return insertedIds;
}

module.exports = seedContacts;

// static contacts data for seeding
const contactsData = [
  {
    _id: "75e44182ab12cd345678901a",
    firstName: "Alice",
    lastName: "Smith",
    createBy: "64d33173fd7ff3fa0924a101",
    deleted: false,
  },
  {
    _id: "75e44182ab12cd345678901b",
    firstName: "Bob",
    lastName: "Johnson",
    createBy: "64d33173fd7ff3fa0924a102",
    deleted: false,
  },
  {
    _id: "75e44182ab12cd345678901c",
    firstName: "Carol",
    lastName: "Williams",
    createBy: "64d33173fd7ff3fa0924a103",
    deleted: false,
  },
  {
    _id: "75e44182ab12cd345678901d",
    firstName: "David",
    lastName: "Brown",
    createBy: "64d33173fd7ff3fa0924a104",
    deleted: false,
  },
  {
    _id: "75e44182ab12cd345678901e",
    firstName: "Eve",
    lastName: "Davis",
    createBy: "64d33173fd7ff3fa0924a105",
    deleted: false,
  },
];
