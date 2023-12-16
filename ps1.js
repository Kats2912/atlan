const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/slangs', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const slangSchema = new mongoose.Schema({
  city: String,
  slangs: [String],
});

const Slang = mongoose.model('Slang', slangSchema);

app.get('/cities', async (req, res) => {
  try {
    const cities = await Slang.find().distinct('city');
    res.json({ success: true, cities });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/slangs/:city', async (req, res) => {
  const { city } = req.params;
  try {
    const slangData = await Slang.findOne({ city });
    if (slangData) {
      res.json({ success: true, slangs: slangData.slangs });
    } else {
      res.status(404).json({ success: false, message: 'Slangs not found for the selected city' });
    }
  } catch (error) {
    console.error('Error fetching slangs:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
