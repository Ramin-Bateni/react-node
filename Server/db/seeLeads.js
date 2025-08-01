const mongoose = require("mongoose");
const leadService = require("../services/leadService");

// Seed 5 leads if none exist
async function seedLeads(createdById) {
  const count = await leadService.countDocuments();

  // If leads already exist, do not seed
  if (count >= 5) {
    return (await leadService.find({}, 5)).map((lead) => String(lead._id));
  }

  // Create 5 sample leads
  const leads = getLeads(createdById);

  // Insert leads into the database
  const leadIds = await leadService.insertMany(leads);

  console.log(`Seeded ${leadIds.length} leads.`);

  return leadIds;
}

module.exports = seedLeads;

function getLeads(createdById) {
  // static leads data for seeding
  const leadsData = [
    {
      _id: new mongoose.Types.ObjectId("64d33173fd7ff3fa0924a201"),
      leadName: "Project Manager",
      createBy: createdById,
      deleted: false,
    },
    {
      _id: new mongoose.Types.ObjectId("64d33173fd7ff3fa0924a202"),
      leadName: "Business Analyst",
      createBy: createdById,
      deleted: false,
    },
    {
      _id: new mongoose.Types.ObjectId("64d33173fd7ff3fa0924a203"),
      leadName: "Technical Lead",
      createBy: createdById,
      deleted: false,
    },
    {
      _id: new mongoose.Types.ObjectId("64d33173fd7ff3fa0924a204"),
      leadName: "QA Lead",
      createBy: createdById,
      deleted: false,
    },
    {
      _id: new mongoose.Types.ObjectId("64d33173fd7ff3fa0924a205"),
      leadName: "DevOps Lead",
      createBy: createdById,
      deleted: false,
    },
  ];

  return leadsData;
}
