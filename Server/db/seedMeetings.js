const meetingService = require("../services/meetingService");
const { getRandomItems } = require("../utils/random.util");

// Seed 5 meetings if none exist
async function seedMeetings(adminId, leadIds, contactIds) {
  const count = await meetingService.countDocuments();

  // If meetings already exist, do not seed
  if (count >= 5) {
    return (await meetingService.getMeetingViews({}, 5)).map(
      (meeting) => meeting._id
    );
  }

  const meetingsData = getSeedItems(adminId, leadIds, contactIds);
  const insertedIds = await meetingService.insertMany(meetingsData);

  console.log(`Seeded ${insertedIds.length} meetings.`);

  return insertedIds;
}

module.exports = seedMeetings;

function getSeedItems(adminId, leadIds, contactIds) {
  return [
    {
      agenda: "Kickoff Project",
      attendes: getRandomItems(contactIds, 3),
      attendesLead: getRandomItems(leadIds, 1),
      location: "Conference Room A",
      related: "Project Alpha",
      dateTime: "2025-08-01T10:00:00Z",
      notes: "Discuss project scope and deliverables.",
      createBy: adminId,
    },
    {
      agenda: "Design Review",
      attendes: getRandomItems(contactIds, 5),
      attendesLead: getRandomItems(leadIds, 2),
      location: "Zoom",
      related: "UI/UX",
      dateTime: "2025-08-05T14:00:00Z",
      notes: "Review wireframes and mockups.",
      createBy: adminId,
    },
    {
      agenda: "Sprint Planning",
      attendes: getRandomItems(contactIds, 2),
      attendesLead: getRandomItems(leadIds, 1),
      location: "Office 3B",
      related: "Sprint 1",
      dateTime: "2025-08-10T09:30:00Z",
      notes: "Plan tasks for next sprint.",
      createBy: adminId,
    },
    {
      agenda: "Client Demo",
      attendes: getRandomItems(contactIds, 4),
      attendesLead: getRandomItems(leadIds, 3),
      location: "Client HQ",
      related: "Demo Beta",
      dateTime: "2025-08-15T11:00:00Z",
      notes: "Show Beta features to client.",
      createBy: adminId,
    },
    {
      agenda: "Retrospective",
      attendes: getRandomItems(contactIds, 3),
      attendesLead: getRandomItems(leadIds, 1),
      location: "Online",
      related: "Sprint 1",
      dateTime: "2025-08-20T16:00:00Z",
      notes: "Gather feedback and improvements.",
      createBy: adminId,
    },
  ];
}
