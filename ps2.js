const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/expenses', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const expenseSchema = new mongoose.Schema({
  expense: Number,
  savings: Number,
});

const Expense = mongoose.model('Expense', expenseSchema);

app.post('/validate-expense-savings', async (req, res) => {
  const { expense, savings } = req.body;

  // Validate if savings are greater than expenses
  if (savings > expense) {
    // Save data to MongoDB
    const newExpense = new Expense({ expense, savings });
    await newExpense.save();
    res.status(200).json({ success: true, message: 'Data saved successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid data: Savings should be greater than expenses' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
