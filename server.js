const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const app = express();
const rateLimit = require("express-rate-limit");
const database = require("./database");
const checkToken = require("./middlewares/checkToken");
require("dotenv").config();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10000
});
app.use(limiter);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(checkToken);


app.use((error, req, res, next) => {
  res.status(error.status).json({ message: error.message });
});

app.set("json spaces", 2);

(async () => {
  const Farm = await database.auth();
  const controllers = require("./controllers")(Farm);

  global = Object.assign(global, { Farm, controllers });
  app.use(require("./routes/api"));
  app.listen(process.env.PORT || 303);
  console.log(`Server is running on port ${process.env.PORT || 303}`);
})();
