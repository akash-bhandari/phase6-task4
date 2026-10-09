require('dotenv').config();
const dns = require('dns');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

dns.setServers(['1.1.1.1', '8.8.8.8']);
const d = (s) => new Date(s);

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Promise.all([User.deleteMany({}), Post.deleteMany({}), Comment.deleteMany({})]);

  const [maya, ravi, sana, omar] = await User.insertMany([
    { name: 'Maya', email: 'maya@example.com' },
    { name: 'Ravi', email: 'ravi@example.com' },
    { name: 'Sana', email: 'sana@example.com' }, // zero posts
    { name: 'Omar', email: 'omar@example.com' },
  ]);

  const [p1, p2, p3] = await Post.insertMany([
    { title: 'Designing Tables Before Writing Queries', authorId: maya._id, createdAt: d('2026-09-01T09:00:00Z') },
    { title: 'Why Foreign Keys Save You Later',         authorId: maya._id, createdAt: d('2026-09-03T09:00:00Z') },
    { title: 'Mongoose Populate in Five Minutes',       authorId: ravi._id, createdAt: d('2026-09-05T09:00:00Z') },
    { title: 'Indexes Explained With a Library Analogy', authorId: omar._id, createdAt: d('2026-09-07T09:00:00Z') }, // zero comments
  ]);

  await Comment.insertMany([
    { text: 'This cleared up normalization for me', postId: p1._id, authorId: ravi._id, createdAt: d('2026-09-02T10:00:00Z') },
    { text: 'Great examples, thanks',               postId: p1._id, authorId: sana._id, createdAt: d('2026-09-06T10:00:00Z') },
    { text: 'Learned this the hard way',            postId: p2._id, authorId: sana._id, createdAt: d('2026-09-04T10:00:00Z') },
    { text: 'Foreign keys caught my bug once',      postId: p2._id, authorId: omar._id, createdAt: d('2026-09-08T10:00:00Z') },
    { text: 'Populate finally makes sense',         postId: p3._id, authorId: maya._id, createdAt: d('2026-09-09T10:00:00Z') },
    { text: 'Bookmarked for the next project',      postId: p3._id, authorId: sana._id, createdAt: d('2026-09-10T10:00:00Z') },
  ]);

  console.log('Mongo seed complete:', { users: 4, posts: 4, comments: 6 });
  await mongoose.disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });