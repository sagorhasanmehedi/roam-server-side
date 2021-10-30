const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 7000;
const cors = require("cors");

app.use(cors());
app.use(express.json());
require("dotenv").config();

// mongodb uri and clint

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sovrn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    // database and collection
    const database = client.db("Assignment-11");
    const Bookingcollection = database.collection("Booking");

    //  get booking
    app.get("/services", async (req, res) => {
      const result = await Bookingcollection.find({}).toArray();
      res.send(result);
    });

    // get singale booking
    app.post("/singalebooking/:id", async (req, res) => {
      const result = await Bookingcollection.findOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });

    // booking confirm
    app.put("/confirmbook/:id", async (req, res) => {
      const data = req.body;
      const options = { upsert: true };
      const filter = { _id: ObjectId(req.params.id) };
      const updateDoc = {
        $set: {
          email: data.email,
          status: data.status,
          userINFO: data.userINFO,
        },
      };
      const result = await Bookingcollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });

    // find my order
    app.post("/findbooking", (req, res) => {
      console.log(req.query);
    });
  } finally {
    //   await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("All ok in assignment 11 server");
});

app.get("/chaking", (req, res) => {
  res.send("Chaking Server Update");
});

app.listen(port, () => {
  console.log("assignment 11 server runing in port :", port);
});
