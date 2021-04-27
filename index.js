import express from "express";
import { render } from "preact-render-to-string";
import session from "express-session";
import bodyParser from "body-parser";

import { User, Topic, Forum, dbSync } from "./models/index.js";
import { HtmlPage } from "./template.js";
import { IndexPage } from "./pages/index.js";
import { ForumPage } from "./pages/forum.js";
import { TopicPage } from "./pages/topic.js";

const SESSION_SECRET = "just trust me";

const app = express();
const PORT = process.env.PORT || 8080;

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
  console.log(messages.map((m) => m.user));
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
        maxAge: 60 * 525602,
      },
    })
  );

  app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Ready on http://localhost:${PORT}`);
  });
};

start().catch((e) => console.error(e));
