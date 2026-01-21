test("Server working!", async () => {
  const response = await fetch("http://localhost:3000");
  expect(404).toBe(response.status);
});
