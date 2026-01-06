const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <--- Import CORS
require('dotenv').config();

const app = express();

app.use(cors()); 
app.use(express.json());


// Connect Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));