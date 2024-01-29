const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}));

app.get('/test', (req, res) => {
  res.json('gargara');
});

app.listen(4000, () => console.log('🎈 http://localhost:4000 🎈'));