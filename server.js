const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = 3000;
const DATA_PATH = path.join(__dirname, 'data.json');

app.use(express.static('public'));
app.use(express.json());

function getData() {
  const data = fs.readFileSync(DATA_PATH, 'utf8');
  return JSON.parse(data);
}

function saveData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data));
}

app.get('/count', (req, res) => {
  const data = getData();
  res.json({ count: data.count });
});

app.post('/count', (req, res) => {
  const data = getData();
  data.count += req.body.change;
  saveData(data);
  res.json({ count: data.count });
});

app.post('/reset', (req, res) => {
  const data = { count: 0 };
  saveData(data);
  res.json({ count: 0 });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
