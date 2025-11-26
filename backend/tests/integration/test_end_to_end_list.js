test("List items returns more than 0", async () => {
  // Create an item first to ensure there's data
  await request(app).post("/items").send({ name: "Test Item", quantity: 5 });
  
  const res = await request(app).get("/items");
  expect(res.body.length).toBeGreaterThan(0);
});
