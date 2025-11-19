test("List items returns more than 0", async () => {
  const res = await request(app).get("/items");
  expect(res.body.length).toBeGreaterThan(0);
});
