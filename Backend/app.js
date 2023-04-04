const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const connection = require("./connection");
const { v4: uuidv4 } = require('uuid');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/createDocuments', (req, res) => {
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

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;