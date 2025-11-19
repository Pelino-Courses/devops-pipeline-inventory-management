const request = require("supertest");
const app = require("../../src/app");

test("GET /items returns array", async () => {
  const res = await request(app).get("/items");
  expect(Array.isArray(res.body)).toBe(true);
});
