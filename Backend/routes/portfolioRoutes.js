// routes/portfolio.js
const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');

const Portfolio = require('../models/Portfolio');
const auth = require('../middlewares/authMiddleware');

router.post('/save', auth, async (req, res) => {
  const { title, items } = req.body;
  try {
    const newPortfolio = new Portfolio({
      user: req.user.id,
      title,
      items,
    });
    await newPortfolio.save();
    res.status(201).json({ id: newPortfolio._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/', auth, async (req, res) => {
  try {
    console.log("Received request for portfolios from user:", req.user);
    const portfolios = await Portfolio.find({ user: req.user.id });
    res.json(portfolios);
  } catch (err) {
    console.log("Received request for portfolios from user:", req.user);
    console.error(err.message);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    if (portfolio.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

router.put('/edit/:id', auth, async (req, res) => {
  const { title, items } = req.body;
  try {
    let portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    if (portfolio.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    portfolio.title = title;
    portfolio.items = items;
    await portfolio.save();
    res.json({ msg: 'Portfolio updated' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

router.post('/download-pdf/:id', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    if (portfolio.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.writeHead(200, {
        'Content-Length': pdfData.length,
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment;filename=portfolio.pdf',
      });
      res.end(pdfData);
    });

    doc.fontSize(25).text(portfolio.title, { align: 'center' });
    doc.moveDown();

    portfolio.items.forEach((item) => {
      if (item.type === 'text') {
        doc.fontSize(12).text(`Text: ${item.text}`);
        doc.moveDown();
      } else if (item.type === 'image') {
        const matches = item.src.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const imgBuffer = Buffer.from(matches[2], 'base64');
          try {
            doc.image(imgBuffer, { width: item.width / 2, height: item.height / 2 });
          } catch (error) {
            doc.text('Error loading image');
          }
        } else {
          doc.text('Invalid image format');
        }
        doc.moveDown();
      }
    });
    doc.end();
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

module.exports = router;
