var express = require('express');
var router = express.Router();
const crypto = require('crypto-js');
const { v4: uuidv4 } = require('uuid');

router.post('/register', (req, res) => {
  const newUser = req.body;
  const userId = uuidv4();
  const encryptedPassword = crypto.SHA3(newUser.newPassword).toString();
  
  connection.connect((err) => {
    if (err) {
      console.log("err", err);
    }

    const sql = `INSERT INTO users (userId, userName, userPassword) VALUES ('${userId}', '${newUser.newUsername}', '${encryptedPassword}')`;

    connection.query(sql, (err, data) => {
      if (err) {
        console.log("err", err);
      }

      res.json(userId);
    });
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const encryptedPassword = crypto.SHA3(password).toString();

  connection.connect((err) => {
    if (err) {
      console.log("err", err);
    }

    const sql = `SELECT userId, userName FROM users WHERE userName='${username}' AND userPassword='${encryptedPassword}'`;

    connection.query(sql, (err, result) => {
      if (err) {
        console.log("err", err);
      }

      if (result.length > 0) {
        res.json({ userId: result[0].userId, userName: result[0].userName });
      } else {
        res.status(401).json('Invalid username or password');
      }
    });
  });
});

module.exports = router;
