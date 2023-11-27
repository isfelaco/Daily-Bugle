// voter microservice
const express = require("express");
const app = express();

const { MongoClient, ObjectId } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

let port = 3003;

app.use(express.json());

app.listen(port, () => console.log(`listening on port ${port}`));

// CREATE
app.post("/", async (request, response) => {
  // create an object to match our article object in mongo
  const adData = request.body;
  const ad = {
    title: adData.title,
    body: adData.body,
    views: adData.views,
    clicks: adData.clicks,
  };
  // write to mongo
  try {
    await client.connect();
    await client
      .db("dailybugle")
      .collection("ads")
      .insertOne(ad)
      .then((results) => response.send(results))
      .catch((error) => console.error(error));
  } catch (error) {
    console.error(error);
  } finally {
    client.close();
  }
});

app.get("/", async (request, response) => {
  try {
    await client.connect();
    await client
      .db("dailybugle")
      .collection("ads")
      .aggregate([{ $sample: { size: 1 } }])
      .next()
      .then((result) => {
        response.send(result);
      })
      .catch((error) => console.error(error));
  } catch (error) {
    console.error(error);
  } finally {
    client.close();
  }
});

// update ad info
// UPDATE, PUT
app.put("/", async (request, response) => {
  const filter = {
    _id: new ObjectId(request.body.id),
  };

  const fieldsToUpdate = {
    title: request.body.title,
    body: request.body.body,
    views: request.body.views,
    clicks: request.body.clicks,
  };

  // Filter out undefined or null values
  const updateAd = {
    $set: Object.fromEntries(
      Object.entries(fieldsToUpdate).filter(
        ([_, v]) => v !== undefined && v !== null
      )
    ),
  };

  try {
    await client.connect();
    await client
      .db("dailybugle")
      .collection("ads")
      .updateOne(filter, updateAd)
      .then((results) => response.send(results))
      .catch((error) => console.error(error));
  } catch (error) {
    console.error(error);
  } finally {
    client.close();
  }
});
