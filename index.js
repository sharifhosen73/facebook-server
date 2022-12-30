const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.v5n2r.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const usersCollection = client
      .db("social-media-application")
      .collection("users");
    const userPersonalCollection = client
      .db("social-media-application")
      .collection("information");
    const postCollection = client
      .db("social-media-application")
      .collection("post");
    const likeCollection = client
      .db("social-media-application")
      .collection("like");
    const commentCollection = client
      .db("social-media-application")
      .collection("Comment");

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // user personal information
    app.get("/user-information", async (req, res) => {
      const query = {};
      const result = await userPersonalCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/user-personal", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await userPersonalCollection.findOne(query);
      res.send(result);
    });

    app.patch("/user-personal", async (req, res) => {
      const user = req.body;
      const result = await userPersonalCollection.insertOne(user);
      res.send(result);
    });

    //post
    app.get("/post", async (req, res) => {
      const query = {};
      const post = await postCollection.find(query).toArray();
      res.send(post);
    });

    app.get("/post/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await postCollection.findOne(query);
      res.send(result);
    });

    app.get("/user-post", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await postCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/post", async (req, res) => {
      const post = req.body;
      const result = await postCollection.insertOne(post);
      res.send(result);
    });

    // like
    app.get("/like", async (req, res) => {
      const query = {};
      const result = await likeCollection.find(query).toArray();
      res.send(result);
    });

    // the conditional query of like and post
    app.get("/like/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = {};
      const post = await postCollection.find(query).toArray();
      const like = await likeCollection.find(query).toArray();

      const postLike = like.filter((n) => n.likePost === id);
      res.send(postLike);
    });

    app.get("/single-like", async (req, res) => {
      const likePost = req.query.likePost;
      const query = { likePost: likePost };
      console.log(likePost);
      const result = await likeCollection.findOne(query).toArray();
      res.send(result);
    });

    app.post("/like", async (req, res) => {
      const like = req.body;
      const result = await likeCollection.insertOne(like);
      res.send(result);
    });

    // comment
    app.get("/comment", async (req, res) => {
      const query = {};
      const result = await commentCollection.find(query).toArray();
      res.send(result);
    });

    // the conditional query of comment and post
    app.get("/comment/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = {};
      const post = await postCollection.find(query).toArray();
      const comment = await commentCollection.find(query).toArray();

      const postComment = comment.filter((n) => n.commentPost === id);
      res.send(postComment);
    });

    app.post("/comment", async (req, res) => {
      const comment = req.body;
      const result = await commentCollection.insertOne(comment);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Social media application is running on 5000");
});

app.listen(port, () => {
  console.log("Social media application is running on ", port);
});
