const http = require("http");

const users = [];

const server = http.createServer((req, res) => {
  const start = Date.now();
  // POST /users
  if (req.method === "POST" && req.url === "/users") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const newUsers = JSON.parse(body);
      users.push(...newUsers);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Usuários adicionados!" }));
    });
  }
  // GET /superusers
  else if (req.method === "GET" && req.url === "/superusers") {
    const superUsers = users.filter(
      (user) => user.score >= 900 && user.active === true,
    );

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        time_spent: Date.now() - start,
        filtered_users: superUsers,
      }),
    );
  }
  // GET /top-countries
  else if (req.method === "GET" && req.url === "/top-countries") {
    const superUsers = users.filter(
      (user) => user.score >= 900 && user.active === true,
    );

    const countPerCountry = superUsers.reduce((acc, user) => {
      acc[user.country] = (acc[user.country] || 0) + 1;
      return acc;
    }, {});

    const sortedCountPerCountry = Object.entries(countPerCountry);
    sortedCountPerCountry.sort((a, b) => b[1] - a[1]);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(countPerCountry));
  }
  //
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(3000, "localhost", () => {
  console.log("Server running");
});

// POST /users OK
// Recebe e armazena os usuários na memória. Pode simular um banco de dados em memória.

// GET /superusers OK
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
