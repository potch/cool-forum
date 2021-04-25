import express from "express";
import { render } from "preact-render-to-string";
import BigSequelize from "sequelize";
import session from "express-session";
import bodyParser from "body-parser";

const SESSION_SECRET = "just trust me";

const { Sequelize, DataTypes } = BigSequelize;

const app = express();
const PORT = process.env.PORT || 8080;

const sequelize = new Sequelize("sqlite:db.sqlite3");
const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {}
);
const Forum = sequelize.define(
  "Forum",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {}
);
const Topic = sequelize.define(
  "Topic",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {}
);
const Message = sequelize.define("Message", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

Forum.hasMany(Topic);
Topic.belongsTo(Forum);
Topic.hasMany(Message);
Message.belongsTo(Topic);
User.hasMany(Message);
Message.belongsTo(User);
Topic.hasOne(User);

import { HtmlPage } from "./template.js";
import { IndexPage } from "./pages/index.js";
import { ForumPage } from "./pages/forum.js";
import { TopicPage } from "./pages/topic.js";

const renderPage = (title, page) => {
  return HtmlPage({ title, content: render(page) });
};

app.get("/", async (req, res) => {
  const forums = await Forum.findAll();
  res.end(
    renderPage("Home", IndexPage({ forums, user: { username: "potch" } }))
  );
});

app.get("/forum/:forumId", async (req, res) => {
  const forum = await Forum.findByPk(req.params.forumId);
  const topics = await forum.getTopics();
  console.log("t", topics);
  console.log(topics[0], topics[0].name);
  res.end(
    renderPage(
      forum.name,
      ForumPage({ forum, topics, user: { username: "potch" } })
    )
  );
});

app.get("/topic/:topicId", async (req, res) => {
  const topic = await Topic.findByPk(req.params.topicId);
  const messages = await topic.getMessages({ include: User });
  console.log(messages.map(m => m.user));
  res.end(
    renderPage(
      topic.name,
      TopicPage({ topic, messages, user: { username: "potch" } })
    )
  );
});

app.get("/dbsync", async (req, res) => {
  await dbSync();
  res.end("aw hell yea");
});

async function dbSync() {
  await sequelize.sync({ force: true });

  const potch = await User.create({
    username: "potch",
    bio: "dababy enthusiast",
  });
  const osmose = await User.create({
    username: "osmose",
    bio: "final fantasy-type beat",
  });
  const forum = await Forum.create({ name: "Title Screen" });
  const topic = await Topic.create({
    name: "the first topic",
    // forumId: forum.id,
  });
  await topic.setForum(forum);

  const message1 = await Message.create({
    title: "Whatup fam",
    body: "hows it hanging",
    date: Date.now(),
  });
  await message1.setUser(osmose);
  await message1.setTopic(topic);
  const message2 = await Message.create({
    title: "Re: Re: Whatup fam",
    body: "nm how bout u",
    date: Date.now(),
  });
  await message2.setUser(potch);
  await message2.setTopic(topic);
}

const start = async () => {
  app.use("/wp-content", express.static("wp-content"));

  app.use(bodyParser.urlencoded({ extended: true }));

  await dbSync();

  console.log("All models were synchronized successfully.");

  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 60 * 525_602,
      },
    })
  );

  app.listen(PORT, err => {
    if (err) throw err;
    console.log(`Ready on http://localhost:${PORT}`);
  });
};

start().catch(e => console.error(e));
