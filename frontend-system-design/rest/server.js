import express from 'express';

const app = express();

app.use(express.json());

const PORT = 3000;

let problems = [
    {id: 0, title: "Polyfill of Array.map", description: "Create a polyfill for the Array.map method."},
    {id: 1, title: "Implement a Queue using Stacks", description: "Design a queue data structure using two stacks."},
    {id: 2, title: "Debounce Function", description: "Implement a debounce function that limits the rate at which a function can fire."},
]

app.get('/api/problems', (req, res) => {
  res.json(problems);
});

app.post('/api/problems', (req, res) => {
  const { title, description } = req.body;
  const newProblem = {
    id: problems.length,
    title,
    description
  };
  problems.push(newProblem);
  res.status(201).json(newProblem);
});

app.get('/api/problems/:id', (req, res) => {
  const problemId = parseInt(req.params.id);
  const problem = problems.find(p => p.id === problemId);
  if (problem) {
    res.json(problem);
  } else {
    res.status(404).json({ message: "Problem not found" });
  }
});

app.delete('/api/problems/:id', (req, res) => {
  const problemId = parseInt(req.params.id);
  const problemIndex = problems.findIndex(p => p.id === problemId);
  if (problemIndex !== -1) {
    problems.splice(problemIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "Problem not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});