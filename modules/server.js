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

    const slicedCountPerCountry = sortedCountPerCountry.slice(0, 4);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(slicedCountPerCountry.flat()));
  }
  // GET /team-insights
  else if (req.method === "GET" && req.url === "/team-insights") {
    const filtredByTeamName = users.reduce((acc, user) => {
      const teamName = user.team.name;

      if (!acc[teamName]) {
        acc[teamName] = {
          members: 0,
          leaders: 0,
          completedProjects: 0,
          activeMembers: 0,
        };
      }

      const team = acc[teamName];

      team.members++;

      if (user.team.leader == true) {
        team.leaders++;
      }

      if (user.active == true) {
        team.activeMembers++;
      }

      user.team.projects.forEach((project) => {
        if (project.completed == true) {
          team.completedProjects++;
        }
      });

      return acc;
    }, {});

    console.log(filtredByTeamName);

    const teamsInsight = Object.entries(filtredByTeamName).map(
      ([teamName, data]) => ({
        team: teamName,
        totalMembers: data.members,
        leaders: data.leaders,
        completedProjects: data.completedProjects,
        activeMembersPercentage: Number(
          ((data.activeMembers / data.members) * 100).toFixed(2),
        ),
      }),
    );

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(teamsInsight));
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

// GET /team-insights
// Agrupa por team.name.
// Retorna: total de membros, líderes, projetos concluídos e % de membros ativos.

// GET /active-users-per-day
// Conta quantos logins aconteceram por data.
// Query param opcional: ?min=3000 para filtrar dias com pelo menos 3.000 logins.
