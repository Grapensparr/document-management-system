var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.post('/createDocument', (req, res) => {
  const newDocument = req.body;
  const documentId = uuidv4();
  const creationDate = new Date();
  const creationDateFormat = creationDate.toString().substring(0, 33);
  const changeHistory = `${newDocument.newDocumentAuthor} created this document on ${creationDateFormat}`;

  connection.connect((err) => {
    if (err) {
      console.log("err", err);
    }

    const sql = `INSERT INTO documents (documentId, documentTitle, creationDate, latestUpdate, changeHistory, content) VALUES 
      ('${documentId}', '${newDocument.newDocumentTitle}', '${creationDateFormat}', '${creationDateFormat}', '${changeHistory}', '${newDocument.newDocumentContent}')`;

    connection.query(sql, (err, data) => {
      if (err) {
        console.log("err", err);
      }

      res.json(documentId);
    });
  });
});

router.get('/listDocuments', (req, res) => {
  connection.connect((err) => {
    if (err) {
      console.log("err", err);
    }

    const sql = `SELECT documentId, documentTitle, latestUpdate FROM documents`;
    
    connection.query(sql, (err, result) => {
      if (err) {
        console.log("err", err);
      }

      res.json(result);
    });
  });
});

module.exports = router;
