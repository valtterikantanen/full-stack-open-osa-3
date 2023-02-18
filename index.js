const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

morgan.token('body', req => JSON.stringify(req.body));

const logger = morgan('tiny', { skip: req => req.method === 'POST' });
const postLogger = morgan(':method :url :status :res[content-length] – :response-time ms :body', {
  skip: req => req.method !== 'POST'
});

app.use(logger);
app.use(postLogger);

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
];

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`);
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

const generateId = () => {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
};

app.post('/api/persons', (req, res) => {
  const name = req.body.name;
  const number = req.body.number;
  const nameInUse = persons.some(person => person.name === name);

  if (!name) return res.status(400).json({ error: 'Name is mandatory' });
  if (!number) return res.status(400).json({ error: 'Number is mandatory' });
  if (nameInUse) return res.status(400).json({ error: 'Name must be unique' });

  const person = {
    id: generateId(),
    name,
    number
  };

  persons = [...persons, person];
  res.json(person);
});

app.get('/api/persons/:id', (req, res) => {
  const person = persons.find(person => person.id === Number(req.params.id));
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  persons = persons.filter(person => person.id !== Number(req.params.id));

  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
