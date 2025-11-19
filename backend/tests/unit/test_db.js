const db = require("../../src/db");

test("database should exist", () => {
  expect(db).toBeDefined();
});
