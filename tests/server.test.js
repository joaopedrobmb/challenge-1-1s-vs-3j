test("Server working!", async () => {
  const response = await fetch("http://localhost:3000");
  expect([200, 404]).toContain(response.status);
});
