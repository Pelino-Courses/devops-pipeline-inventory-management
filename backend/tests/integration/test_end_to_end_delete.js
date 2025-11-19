test("Delete item", async () => {
  const created = await request(app).post("/items").send({ name: "To delete" });
  const id = created.body.id;

  const del = await request(app).delete(`/items/${id}`);
  expect(del.statusCode).toBe(200);
});
