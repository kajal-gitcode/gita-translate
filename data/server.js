const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/chapters', (req, res) => {
  fs.readFile('verse.json', 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading verse.json:", err);
      return res.status(500).send("Internal Server Error");
    }
    try {
      const parsedData = JSON.parse(data);
      res.json(parsedData);
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
      res.status(500).send("Invalid JSON format");
    }
  });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});