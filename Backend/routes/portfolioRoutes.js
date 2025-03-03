const express = require('express');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const multer = require('multer');
const authenticateUser = require('../middlewares/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('image'), (req, res) => {
  res.json({ url: `/uploads/${req.file.filename}` });
});

router.post('/portfolio/save', async (req, res) => {
  const { userId, sections } = req.body;
  await Portfolio.findOneAndUpdate({ userId }, { sections }, { upsert: true });
  res.json({ success: true });
});

// Fetch portfolio by userId
router.get('/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const portfolio = await Portfolio.findOne({ userId });
  
      if (!portfolio) {
        return res.status(404).json({ error: "Portfolio not found" });
      }
  
      res.json(portfolio);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
module.exports = router;
