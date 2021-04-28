import SequelizeDefault from "sequelize";
const { Sequelize, DataTypes } = SequelizeDefault;

const sequelize = new Sequelize("sqlite:db.sqlite3");

export const User = sequelize.define(
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

export const Forum = sequelize.define(
  "Forum",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {}
);

export const Topic = sequelize.define(
  "Topic",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {}
);

export const Message = sequelize.define(
  "Message",
  {
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
  },
  {}
);

// Relationships
Forum.hasMany(Topic);
Topic.belongsTo(Forum);

Topic.hasMany(Message);
Message.belongsTo(Topic);

User.hasMany(Message);
Message.belongsTo(User);

Topic.hasOne(User);

export async function dbSync() {
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
