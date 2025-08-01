const ADMIN_ID = "64d33173fd7ff3fa0924a109";
const MEETING_ID = "64d33173fd7ff3fa0924a205";

jest.mock("../../middelwares/auth", () => (req, res, next) => {
  // اگر هدر user ست شده باشه، از همون استفاده کن
  if (req.headers["user"]) {
    try {
      req.user = JSON.parse(req.headers["user"]);
    } catch {
      req.user = {};
    }
  } else {
    // در حالت عادی user عادی باشه
    req.user = { id: ADMIN_ID, role: "user" };
  }
  next();
});

const sinon = require("sinon");
const request = require("supertest");
const app = require("../../index");
const meetingSvc = require("../../services/meetingService");
const { ValidationError } = require("../../utils/error.util");

const validPayload = {
  agenda: "Sprint Planning - Q3",
  dateTime: "2025-08-01T09:00:00.000Z",
  participants: ["alice@example.com", "bob@example.com", "carol@example.com"],
  location: "Conference Room A",
  description: "test",
  duration: 90,
  createBy: ADMIN_ID,
};

describe("Meeting Controller", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("GET /api/meeting", () => {
    it("should return empty array when no meetings exist", async () => {
      sinon.stub(meetingSvc, "getAllMeetingViews").resolves([]);

      const res = await request(app)
        .get("/api/meeting")
        .set("user", JSON.stringify({ id: ADMIN_ID, role: "superAdmin" }));

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(0);
    });

    it("non-superAdmin sees only own meetings", async () => {
      const fake = [{ _id: "1", createBy: "u1" }];
      sinon.stub(meetingSvc, "getMeetingViewsByCreator").resolves(fake);

      const res = await request(app).get("/api/meeting");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(fake);
    });

    it("superAdmin sees all meetings", async () => {
      sinon
        .stub(meetingSvc, "getAllMeetingViews")
        .resolves([{ _id: MEETING_ID }]);

      const res = await request(app)
        .get("/api/meeting")
        .set("user", JSON.stringify({ id: ADMIN_ID, role: "superadmin" }));

      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ _id: MEETING_ID }]);
    });

    it("superAdmin filtered by createBy", async () => {
      sinon
        .stub(meetingSvc, "getMeetingViewsByCreator")
        .resolves([{ _id: MEETING_ID }]);

      const res = await request(app)
        .get("/api/meeting")
        .query({ createBy: "u2" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ _id: MEETING_ID }]);
    });
  });

  describe("GET /api/meeting/view/:id", () => {
    it("should return one meeting when found", async () => {
      const dummy = { _id: "1", agenda: "Test" };
      sinon.stub(meetingSvc, "getMeetingViewById").resolves(dummy);

      const res = await request(app).get("/api/meeting/view/1");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(dummy);
    });

    it("should 404 when service returns null", async () => {
      sinon.stub(meetingSvc, "getMeetingViewById").resolves(null);

      const res = await request(app).get("/api/meeting/view/unknown");

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toMatch(/not found/i);
    });

    it("should 400 on invalid ID format", async () => {
      const error = new ValidationError("Invalid ID");
      error.status = 400;
      sinon.stub(meetingSvc, "getMeetingViewById").rejects(error);

      const res = await request(app).get("/api/meeting/view/INVALID");

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid ID");
    });
  });

  describe("POST /api/meeting/add", () => {
    it("should create and return meeting with 201", async () => {
      const created = { _id: "2", ...validPayload };
      sinon.stub(meetingSvc, "createMeeting").resolves(created);

      const res = await request(app)
        .post("/api/meeting/add")
        .set("Content-Type", "application/json")
        .send(validPayload);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(created);
    });

    it("should 400 on validation error when service rejects", async () => {
      const error = new ValidationError("Validation failed");
      sinon.stub(meetingSvc, "createMeeting").rejects(error);

      const res = await request(app)
        .post("/api/meeting/add")
        .set("Content-Type", "application/json")
        .send(validPayload);

      expect(res.status).toBe(400);
    });

    it("should 400 on missing required fields", async () => {
      const error = new Error("Validation failed");
      error.status = 400;
      sinon.stub(meetingSvc, "createMeeting").rejects(error);

      const res = await request(app).post("/api/meeting/add").send({});

      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/meeting/edit/:id", () => {
    it("should update and return updated meeting", async () => {
      const updates = { location: "Room B" };
      const updated = { _id: "3", agenda: "A", ...updates };
      sinon.stub(meetingSvc, "updateMeeting").resolves(updated);

      const res = await request(app)
        .put("/api/meeting/edit/3")
        .set("Content-Type", "application/json")
        .send(updates);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(updated);
    });

    it("should 404 when service returns null", async () => {
      sinon.stub(meetingSvc, "updateMeeting").resolves(null);

      const res = await request(app)
        .put("/api/meeting/edit/doesnotexist")
        .set("Content-Type", "application/json")
        .send(validPayload);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message");
    });

    it("should 400 on ValidationError", async () => {
      const validationError = new ValidationError("Bad request");
      sinon.stub(meetingSvc, "updateMeeting").rejects(validationError);

      const res = await request(app)
        .put("/api/meeting/edit/3")
        .send({ agenda: "sample", attendees: ["invalid-id"] });

      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /api/meeting/delete/:id", () => {
    it("should return 204 on successful delete", async () => {
      sinon.stub(meetingSvc, "deleteMeeting").resolves({});

      const res = await request(app).delete("/api/meeting/delete/4");

      expect(res.status).toBe(204);
      expect(res.body).toEqual({});
    });

    it("should 500 on delete error", async () => {
      const err = new Error("Delete failed");
      err.status = 500;
      sinon.stub(meetingSvc, "deleteMeeting").rejects(err);

      const res = await request(app).delete("/api/meeting/delete/4");

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("message", "Delete failed");
    });
  });

  describe("POST /api/meeting/deleteMany", () => {
    it("should return deletedCount", async () => {
      sinon.stub(meetingSvc, "deleteManyMeetings").resolves(3);

      const res = await request(app)
        .post("/api/meeting/deleteMany")
        .send({ ids: ["a", "b", "c"] });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ deletedCount: 3 });
    });

    it("should 400 on bad request", async () => {
      const err = new Error("Invalid IDs array");
      err.status = 400;
      sinon.stub(meetingSvc, "deleteManyMeetings").rejects(err);

      const res = await request(app)
        .post("/api/meeting/deleteMany")
        .send({ ids: ["bad"] });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid IDs array");
    });
  });
});
