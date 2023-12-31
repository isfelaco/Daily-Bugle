// voter microservice
const express = require("express");
const app = express();

const { MongoClient, ObjectId } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

let port = 3001;

app.use(express.json());

app.listen(port, () => console.log(`listening on port ${port}`));

// CREATE
app.post("/", async (request, response) => {
  // create an object to match our article object in mongo
  const articleData = request.body;
  const article = {
    title: articleData.title,
    categories: articleData.categories,
    teaser: articleData.teaser,
    body: articleData.body,
  };
  // write to mongo
  try {
    await client.connect();
    await client
      .db("dailybugle")
      .collection("articles")
      .insertOne(article)
      .then((results) => response.send(results))
      .catch((error) => console.error(error));
  } catch (error) {
    console.error(error);
  } finally {
    client.close();
  }
});

// READ
app.get("/", async (request, response) => {
  try {
    await client.connect();
    await client
      .db("dailybugle")
      .collection("articles")
      .find()
      .toArray()
      .then((results) => {
        response.send(results);
      })
      .catch((error) => console.error(error));
  } catch (error) {
    console.error(error);
  } finally {
    client.close();
  }
});

// UPDATE, PUT
app.put("/", async (request, response) => {
  const filter = {
    _id: new ObjectId(request.body.id),
  };

  const fieldsToUpdate = {
    title: request.body.title,
    body: request.body.body,
    teaser: request.body.teaser,
  };

  // Filter out undefined or null values
  const updateArticle = {
    $set: Object.fromEntries(
      Object.entries(fieldsToUpdate).filter(
        ([_, v]) => v !== undefined && v !== null
      )
    ),
    $push: { categories: request.body.category },
    $push: { comments: request.body.comment },
  };

  try {
    await client.connect();
    await client
      .db("dailybugle")
      .collection("articles")
      .updateOne(filter, updateArticle)
      .then((results) => response.send(results))
      .catch((error) => console.error(error));
  } catch (error) {
    console.error(error);
  } finally {
    client.close();
  }
});

// DELETE, DELETE
app.delete("/", async (request, response) => {
  const articleData = request.body;
  const article = { title: articleData.title };
  try {
    await client.connect();
    await client
      .db("dailybugle")
      .collection("articles")
      .deleteOne(article)
      .then((results) => response.send(results))
      .catch((error) => console.error(error));
  } catch (error) {
    console.error(error);
  } finally {
    client.close();
  }
});
