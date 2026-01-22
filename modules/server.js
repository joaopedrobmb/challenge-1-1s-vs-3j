const http = require("http");

const users = [];

const server = http.createServer((req, res) => {
  const timestampStart = Date.now();
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
      res.end(
        JSON.stringify({
          timestamp: Date.now(),
          time_response: Date.now() - timestampStart,
          message: "Usuários adicionados!",
        }),
      );
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
        timestamp: Date.now(),
        time_response: Date.now() - timestampStart,
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
    res.end(
      JSON.stringify({
        timestamp: Date.now(),
        time_response: Date.now() - timestampStart,
        top_countries: slicedCountPerCountry.flat(),
      }),
    );
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
    res.end(
      JSON.stringify({
        timestamp: Date.now(),
        time_response: Date.now() - timestampStart,
        teams_insight: teamsInsight,
      }),
    );
  }
  //GET /active-users-per-day
  else if (req.method === "GET" && req.url === "/active-users-per-day") {
    const logsByDate = users.reduce((acc, user) => {
      user.logs.forEach((log) => {
        if (log.action === "login") {
          acc[log.date] = (acc[log.date] || 0) + 1;
        }
      });
      return acc;
    }, {});

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        timestamp: Date.now(),
        time_response: Date.now() - timestampStart,
        logs_by_date: logsByDate,
      }),
    );
  }
  //GET /evaluation
  else if (req.method === "GET" && req.url === "/evaluation") {
    async function callEndpoints() {
      const callResponseSU = await fetch("http://localhost:3000/superusers", {
        method: "GET",
      });

      const dataSU = await callResponseSU.json();

      const callResponseTopCountries = await fetch(
        "http://localhost:3000/top-countries",
        {
          method: "GET",
        },
      );

      const dataTC = await callResponseTopCountries.json();

      const callResponseTeamInsights = await fetch(
        "http://localhost:3000/team-insights",
        {
          method: "GET",
        },
      );

      const dataTI = await callResponseTeamInsights.json();

      const callResponseActiveUsersPerDay = await fetch(
        "http://localhost:3000/active-users-per-day",
        {
          method: "GET",
        },
      );

      const dataAU = await callResponseActiveUsersPerDay.json();

      function isJson(str) {
        try {
          JSON.parse(str);
        } catch (error) {
          return false;
        }
        return true;
      }

      console.log(isJson(callResponseTopCountries));

      const endpointStatus = {
        superusers: {
          status: callResponseSU.status,
          time_response: dataSU.time_response,
          is_json: isJson(callResponseSU),
        },
        top_countries: {
          status: callResponseTopCountries.status,
          time_response: dataTC.time_response,
          is_json: isJson(callResponseTopCountries),
        },
        team_insights: {
          status: callResponseTeamInsights.status,
          time_response: dataTI.time_response,
          is_json: isJson(callResponseTeamInsights),
        },
        active_users_per_day: {
          status: callResponseActiveUsersPerDay.status,
          time_response: dataAU.time_response,
          is_json: isJson(callResponseActiveUsersPerDay),
        },
      };

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(endpointStatus));
    }

    try {
      callEndpoints();
    } catch (error) {
      console.log(error);
    }
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
