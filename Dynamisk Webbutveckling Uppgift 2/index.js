require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const todosRouter = require("./routes/todo-routes.js");
const app = express();

app.use(express.urlencoded({ extended: true }));

app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
  })
);

app.set("view engine", "hbs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/todos", todosRouter);

app.listen(8080, () => {
  console.log("http://localhost:8080/");
});
