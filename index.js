const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

const app = express();
const port = 8081;

const db_link = "mongodb://mongo:27017/helloworlddb";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(db_link, options)
  .then(function () {
    console.log("MongoDB is connected");
  })
  .catch(function (err) {
    console.log(err);
  });

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "HelloWorld API",
      description: "Hello World Class",
      contact: {
        name: "DanielJaramillo",
      },
      servers: ["http://localhost:8081"],
    },
  },
  apis: ["index.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

let Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    id: { type: String },
    userName: { type: String },
    age: { type: Number, min: 0 },
  },
  { versionKey: false }
);

let User = mongoose.model("Users", userSchema);

/**
 * @swagger
 * /customers:
 *  get:
 *    description: Use to request all customers
 *    responses:
 *      '400':
 *        description: Return an error
 *      '200':
 *        description: A successful response
 */
app.get("/customers", (req, res) => {
  User.find({}).exec((err, users) => {
    if (err) res.status(400).send("Oops! Something went wrong!");
    else res.status(200).send(users);
  });
});

/**
 * @swagger
 * /customers:
 *  post:
 *    description: Create a new customer
 *    parameters:
 *        - name: id
 *          in: body
 *          description: id of customer
 *          required: true
 *          schema:
 *            type: string
 *            format: string
 *        - name: userName
 *          in: body
 *          description: userName of customer
 *          required: true
 *          schema:
 *            type: string
 *            format: string
 *        - name: age
 *          in: body
 *          description: age of customer
 *          required: true
 *          schema:
 *            type: number
 *            format: number
 *    responses:
 *      '400':
 *        description: Return an error
 *      '201':
 *        description: A successful response
 */
app.post("/new-customer", (req, res) => {
  let newUser = req.body;
  User.create(newUser, (err, user) => {
    if (err) res.status(400).send("Oops! Something went wrong!");
    else res.status(201).send(user);
  });
});

/**
 * @swagger
 * /customers:
 *  delete:
 *    description: Used to delete a customer based on one id
 *    parameters: id
 *    responses:
 *      '202':
 *        description: A successful delete
 *      '400':
 *        description: An error ocurred
 */
app.delete("/delte-customer/:id", (req, res) => {
  let id = req.params.id;
  User.deleteOne({ id }, (err, user) => {
    if (err) res.status(400).send("Oops! Something went wrong!");
    else res.status(202).send(user);
  });
});

/**
 * @swagger
 * /customers:
 *    put:
 *      description: Use to modify an existing customer
 *      parameters:
 *        - name: id
 *          in: body
 *          description: id of customer
 *          required: true
 *          schema:
 *            type: string
 *            format: string
 *        - name: userName
 *          in: body
 *          description: userName of customer
 *          required: true
 *          schema:
 *            type: string
 *            format: string
 *        - name: age
 *          in: body
 *          description: age of customer
 *          required: true
 *          schema:
 *            type: number
 *            format: number
 *      responses:
 *        '400':
 *          description: An error ocurred
 *        '200':
 *          description: Successfully response
 */
app.put("/update-customer/:id", (req, res) => {
  let id = req.params.id;
  let newUser = req.body;
  User.findOneAndUpdate({ id }, newUser, (err, user) => {
    if (err) res.status(400).send("Oops! Something went wrong!");
    else res.status(200).send(user);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at 8081`);
});
