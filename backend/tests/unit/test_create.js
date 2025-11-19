test("POST /items should require name", async () => {
  const res = await request(app).post("/items").send({});
  expect(res.statusCode).toBe(400);
});
