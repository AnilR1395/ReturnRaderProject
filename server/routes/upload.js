// server/routes/upload.js - Receipt and document upload handler
const path = require('node:path');
const fs = require('node:fs');
const { randomUUID } = require('node:crypto');

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'public', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function registerUploadRoutes(app) {
  app.post('/api/upload', (req, res) => {
    // Check if multipart files are present
    if (req.body && req.body.files && req.body.files.file) {
      const file = req.body.files.file;
      const ext = path.extname(file.filename) || '.jpg';
      const safeFilename = `receipt-${Date.now()}-${randomUUID().slice(0, 6)}${ext}`;
      const filePath = path.join(UPLOADS_DIR, safeFilename);

      fs.writeFileSync(filePath, file.data);
      return res.json({
        success: true,
        url: `/uploads/${safeFilename}`,
        filename: safeFilename
      });
    }

    // Check if base64 image was sent via JSON
    if (req.body && req.body.image_base64) {
      const rawBase64 = req.body.image_base64;
      const matches = rawBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let ext = '.png';
      let buffer;

      if (matches && matches.length === 3) {
        const mime = matches[1];
        if (mime.includes('jpeg') || mime.includes('jpg')) ext = '.jpg';
        if (mime.includes('webp')) ext = '.webp';
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(rawBase64, 'base64');
      }

      const safeFilename = `receipt-${Date.now()}-${randomUUID().slice(0, 6)}${ext}`;
      const filePath = path.join(UPLOADS_DIR, safeFilename);

      fs.writeFileSync(filePath, buffer);
      return res.json({
        success: true,
        url: `/uploads/${safeFilename}`,
        filename: safeFilename
      });
    }

    res.status(400).json({ error: 'No file or image_base64 data provided' });
  });
}

module.exports = {
  registerUploadRoutes
};
