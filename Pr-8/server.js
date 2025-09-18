const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = 3001;
const DATA_PATH = path.join(__dirname, 'data.json');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function getData() {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      // Create data.json if it doesn't exist
      const initialData = { count: 0 };
      fs.writeFileSync(DATA_PATH, JSON.stringify(initialData, null, 2));
      return initialData;
    }

    const data = fs.readFileSync(DATA_PATH, 'utf8');
    const parsedData = JSON.parse(data);

    // Ensure the data has the correct structure
    if (typeof parsedData.count !== 'number') {
      parsedData.count = 0;
    }

    return parsedData;
  } catch (error) {
    console.error('Error reading data:', error);
    return { count: 0 };
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

app.get('/count', (req, res) => {
  try {
    const data = getData();
    res.json({ count: data.count });
  } catch (error) {
    console.error('Error getting count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/count', (req, res) => {
  try {
    const data = getData();
    const change = parseInt(req.body.change) || 0;
    data.count += change;
    saveData(data);
    res.json({ count: data.count });
  } catch (error) {
    console.error('Error updating count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/reset', (req, res) => {
  try {
    const data = { count: 0 };
    saveData(data);
    res.json({ count: 0 });
  } catch (error) {
    console.error('Error resetting count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', port: PORT });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
  console.log(`📊 Data file: ${DATA_PATH}`);

  // Initialize data file if needed
  getData();
});
