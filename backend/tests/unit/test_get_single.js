test("GET /items/1 returns item", async () => {
  const res = await request(app).get("/items/1");
  expect(res.statusCode).toBe(200);
});
