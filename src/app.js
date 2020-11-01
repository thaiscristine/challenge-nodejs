const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// List all the repositories
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

// id, title, url, techs, likes
// It receives title, url and techs in the request body.
// ID using uuid and starting likes as 0 by default
app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;
  const repository = { id: uuid(),title, url, techs, likes: 0};

  repositories.push(repository);

  return response.json(repository);
});

// updates repository based in the id resource 
// receives id from request params
// receives title, url and techs from request body
// collect likes using index of id
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found'});
  }
  const likes = repositories[repositoryIndex].likes;
  const repository = {id, title, url, techs, likes};
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

// search for the index of the id in repositories and delete it using splice
// return status 204 
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found'});
  }
  repositories.splice(repositoryIndex, 1)

  return response.status(204).json({ message: 'successfully deleted' });
});

// search for the index of the id in repositories and add 1 to the value likes in repositories
// return status 200
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  if(repositoryIndex < 0 ) {
    return response.status(400).json({ error: "Repository not found"});
  }

  repositories[repositoryIndex].likes = repositories[repositoryIndex].likes + 1
  return response.status(200).send({ likes: repositories[repositoryIndex].likes });
});

module.exports = app;
