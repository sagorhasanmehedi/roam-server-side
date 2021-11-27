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
    const confirmcollection = database.collection("Confirm");

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
    app.put("/confirmbook", async (req, res) => {
      const data = req.body;
      const result = await confirmcollection.insertOne(data);
      res.send(result);
    });

    // find my order
    app.post("/findbooking", async (req, res) => {
      const email = req.query.email;
      const query = { email };
      const result = await confirmcollection.find(query).toArray();

      res.send(result);
    });

    // add new destination
    app.post("/addnew", async (req, res) => {
      const result = await Bookingcollection.insertOne(req.body);
      res.send(result);
    });

    // delete my order
    app.delete("/deletebooking/:id", async (req, res) => {
      const result = await confirmcollection.deleteOne({
        _id: req.params.id,
      });

      res.send(result);
    });

    // get addmin data
    app.get("/getadmindata", async (req, res) => {
      const result = await confirmcollection.find({}).toArray();
      res.send(result);
    });

    // update status
    app.post("/statusupdate/:id", async (req, res) => {
      const data = req.body.statusdata;
      const filter = { _id: req.params.id };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          status: data,
        },
      };
      const result = await confirmcollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });

    // delete admin data
    app.delete("/deleteaddmindata/:id", async (req, res) => {
      const result = await confirmcollection.deleteOne({ _id: req.params.id });
      res.send(result);
    });
  } finally {
    //   await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("All ok in assignment 11 server");
});

app.get("/chakingupdate", (req, res) => {
  res.send("Chaking Server Update 3.0");
});

app.listen(port, () => {
  console.log("assignment 11 server runing in port :", port);
});
