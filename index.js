const express = require("express");
const app = express();
const usersRoutes = require("./api/routes/userRoute");

app.use(express.json());

usersRoutes(app); 

app.listen(3000, () => {
  console.log('User routes service running on port 3000');
});

module.exports = app;
