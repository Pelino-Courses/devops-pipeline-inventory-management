test("PUT /items/1 should validate body", async () => {
  const res = await request(app).put("/items/1").send({});
  expect(res.statusCode).toBe(400);
});
