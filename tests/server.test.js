test("Server working!", async () => {
  const response = await fetch("http://localhost:3000");
  expect(404).toBe(response.status);
});

test("Endpoint /evaluation working!", async () => {
  const response = await fetch("http://localhost:3000/evaluation", {
    method: "GET",
  });
  expect(response.status).toBe(200);
  expect(typeof response).toBe("object");
});
