var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

router.post('/createDocument', (req, res) => {
  const newDocument = req.body;
  const documentId = uuidv4();
  const latestUpdate = moment().format('YYYY-MM-DD HH:mm:ss');
  const latestUpdateFormated = new Date().toString().substring(0, 33);
  const changeHistory = `${newDocument.newDocumentAuthor} created this document on ${latestUpdateFormated}`;

  connection.connect((err) => {
    if (err) {
      console.log("err", err);
    }

    const sql = `INSERT INTO documents (documentId, documentTitle, latestUpdate, changeHistory, content) VALUES 
      ('${documentId}', '${newDocument.newDocumentTitle}', '${latestUpdate}', '${changeHistory}', '${newDocument.newDocumentContent}')`;

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

    const sql = `
      SELECT documents.documentId, documents.documentTitle,
        COALESCE(changeHistory.changeTitle, documents.documentTitle) AS title,
        COALESCE(changeHistory.latestUpdate, documents.latestUpdate) AS latestUpdate
        FROM documents
      LEFT JOIN changeHistory ON documents.documentId = changeHistory.documentId
        AND changeHistory.latestUpdate = (SELECT MAX(latestUpdate) FROM changeHistory WHERE documentId = documents.documentId)
      ORDER BY documents.documentTitle
    `;
    
    connection.query(sql, (err, result) => {
      if (err) {
        console.log("err", err);
      }

      res.json(result);
    });
  });
});

router.get('/:documentId', (req, res) => {
  const documentId = req.params.documentId;

  connection.connect((err) => {
    if (err) {
      console.log("err", err);
    }

    const sql = `
      SELECT documents.documentTitle, documents.content,
        COALESCE(changeHistory.changeTitle, documents.documentTitle) AS title,
        COALESCE(changeHistory.changeContent, documents.content) AS content
        FROM documents
      LEFT JOIN changeHistory ON documents.documentId = changeHistory.documentId
        AND changeHistory.latestUpdate = (SELECT MAX(latestUpdate) FROM changeHistory WHERE documentId = '${documentId}')
      WHERE documents.documentId = '${documentId}';
    `;

    connection.query(sql, (err, result) => {
      if (err) {
        console.log("err", err);
      }

      res.json(result[0]);
    });
  });
});

router.post('/saveChange', (req, res) => {
  const updatedDocument = req.body;
  const id = uuidv4();
  const documentId = updatedDocument.documentId;
  const latestUpdate = moment().format('YYYY-MM-DD HH:mm:ss');
  const latestUpdateFormated = new Date().toString().substring(0, 33);
  const changeHistory = `${updatedDocument.changeAuthor} updated this document on ${latestUpdateFormated}`;

  connection.connect((err) => {
    if (err) {
      console.log("err", err);
    }

    const sql = `INSERT INTO changeHistory (id, documentId, changeTitle, changeContent, latestUpdate, changeHistory) VALUES 
      ('${id}', '${documentId}', '${updatedDocument.changeTitle}', '${updatedDocument.changeContent}', '${latestUpdate}', '${changeHistory}')`;

    connection.query(sql, (err, data) => {
      if (err) {
        console.log("err", err);
      }

      res.json(id);
    });
  });
});

router.get('/changeHistory/:documentId', (req, res) => {
  const documentId = req.params.documentId;

  connection.connect((err) => {
    if (err) {
      console.log("err", err);
    }

    const sql = `
      SELECT documentId, changeHistory, latestUpdate FROM documents WHERE documentId = '${documentId}'
      UNION ALL
      SELECT documentId, changeHistory, latestUpdate FROM changeHistory WHERE documentId = '${documentId}' 
      ORDER BY latestUpdate DESC;
    `;

    connection.query(sql, (err, result) => {
      if (err) {
        console.log("err", err);
      }

      res.json(result);
    });
  });
});

module.exports = router;
