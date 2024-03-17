const express = require('express');
const cors = require('cors');
const app = express();

const login = require('./api/login');
const register = require('./api/register');
const portfolios = require('./api/portfolios');
const funds = require('./api/funds');

app.use(express.json());
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}));

app.use('/sign-in', login);
app.use('/register', register);
app.use('/portfolios', portfolios);
app.use('/funds', funds);

app.listen(4000, () => console.log('🎈 http://localhost:4000 🎈'));