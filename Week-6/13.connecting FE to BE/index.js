const express = require("express");
const jwt = require("jsonwebtoken");
const jwt_SECRET = "I'm a web3 developer";

const app = express();

app.use(express.json());

let users = [];

function auth(req, res, next) {
  const token = req.headers.token;
  const decodedData = jwt.verify(token, jwt_SECRET);

  const validUser = users.find(
    (user) => user.username === decodedData.username
  );

  if (validUser) {
    req.username = validUser.username;
    req.password = validUser.password;
    next();
  } else {
    res.json({
      message: "unauthorizd user",
    });
  }
}

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/signup", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  users.push({
    username: username,
    password: password,
  });

  res.json({
    message: "successfully signed up",
  });
});

app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const findUser = users.find(
    (user) => user.username === username && user.password === password
  );

  if (findUser) {
    const token = jwt.sign({ username: findUser.username }, jwt_SECRET);
    res.json({
      token: token,
    });
  } else {
    res.json({
      message:
        "Kindly register first or please check your username and paswword",
    });
  }
});

app.get("/me", auth, function (req, res) {
  res.json({
    username: req.username,
    password: req.password,
  });
});

app.listen(3000);
