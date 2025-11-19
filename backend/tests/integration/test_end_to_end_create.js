test("Create item then fetch it", async () => {
  const create = await request(app).post("/items").send({ name: "Test" });
  const id = create.body.id;

  const get = await request(app).get(`/items/${id}`);
  expect(get.body.name).toBe("Test");
});
