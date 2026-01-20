const http = require("http");

const users = [];

const server = http.createServer((req, res) => {
  // POST /users
  if (req.method === "POST" && req.url === "/users") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;

      req.on("end", () => {
        const newUsers = JSON.parse(body);
        users.push(...newUsers);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Usuários adicionados!" }));
      });
    });
  }
  // GET /superusers
  if (req.method === "GET" && req.url === "/superusers") {
    res.on("end", () => {
      const filteredUsers = users.filter(
        (user) => user.score >= 900 && user.active === true,
      );

      res.writeHead(200, { Content_Type: "application/json" });
      res.end(JSON.stringify({ filtered_users: filteredUsers }));
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(3000, "localhost", () => {
  console.log("Server running");
});

// POST /users OK
// Recebe e armazena os usuários na memória. Pode simular um banco de dados em memória.

// GET /superusers
// Filtro: score >= 900 e active = true
// Retorna os dados e o tempo de processamento da requisição.

// GET /top-countries
// Agrupa os superusuários por país.
// Retorna os 5 países com maior número de superusuários.

// GET /team-insights
// Agrupa por team.name.
// Retorna: total de membros, líderes, projetos concluídos e % de membros ativos.

// GET /active-users-per-day
// Conta quantos logins aconteceram por data.
// Query param opcional: ?min=3000 para filtrar dias com pelo menos 3.000 logins.
