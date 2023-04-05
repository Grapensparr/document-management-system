var express = require('express');
var router = express.Router();
const crypto = require('crypto-js');
const { v4: uuidv4 } = require('uuid');

router.post('/register', (req, res) => {
  const newUser = req.body;
  const userId = uuidv4();
  const encryptedPassword = crypto.AES.encrypt(newUser.newPassword, process.env.SALT).toString();

  const sqlCheck = `SELECT * FROM users WHERE userName='${newUser.newUsername}'`;

  connection.connect((err) => {
    if (err) {
      console.log("err", err);
    } else {
      connection.query(sqlCheck, (err, result) => {
        if (err) {
          console.log("err", err);
        } else if (result.length > 0) {
          res.status(409).json({ error: 'The username already exists' });
        } else {
          const sql = `INSERT INTO users (userId, userName, userPassword) VALUES ('${userId}', '${newUser.newUsername}', '${encryptedPassword}')`;

          connection.query(sql, (err, data) => {
            if (err) {
              console.log("err", err);
            }

            res.json({ userId });
          });
        }
      });
    }
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  connection.connect((err) => {
    if (err) {
      console.log("err", err);
    }

    const sql = `SELECT userId, userName, userPassword FROM users WHERE userName='${username}'`;

    connection.query(sql, (err, result) => {
      if (err) {
        console.log("err", err);
      }

      if (result.length > 0) {
        const decryptedPassword = crypto.AES.decrypt(result[0].userPassword, process.env.SALT).toString(crypto.enc.Utf8);

        if (password === decryptedPassword) {
          res.json({ userId: result[0].userId, userName: result[0].userName });
        } else {
          res.status(401).json({ error: 'The password you entered is incorrect' });
        }

      } else {
        res.status(401).json({ error: 'The username you entered does not exist' });
      }
    });
  });
});

module.exports = router;