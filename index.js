const express = require("express");
const server = express();

server.use(express.json());

const projects = [
  {
    id: 1,
    title: "Novo projeto",
    tasks: ["Nova tarefa"]
  }
];
// Middlewares
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(404).json("Resource not found!");
  }

  next();
}

function requestsCount(req, res, next) {
  console.count("Requests count");

  return next();
}

server.use(requestsCount);

//Rotas
server.get("/projects", (req, res) => {
  return res.status(200).json({ projects: projects });
});

server.post("/projects", (req, res) => {
  const { title, id, tasks = "" } = req.body;
  const project = {
    id,
    title,
    tasks: [tasks]
  };
  projects.push(project);

  return res.status(201).json({ projects: projects });
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.status(201).json(project);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.status(201).json(project);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.listen(3000);
