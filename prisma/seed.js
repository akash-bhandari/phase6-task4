const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const maya = await prisma.user.create({
    data: { name: 'Maya', email: 'maya@example.com' },
  });
  const ravi = await prisma.user.create({
    data: { name: 'Ravi', email: 'ravi@example.com' },
  });
  const sana = await prisma.user.create({
    data: { name: 'Sana', email: 'sana@example.com' }, // zero posts
  });
  const omar = await prisma.user.create({
    data: { name: 'Omar', email: 'omar@example.com' },
  });

  const post1 = await prisma.post.create({
    data: {
      title: 'Designing Tables Before Writing Queries',
      authorId: maya.id,
      createdAt: new Date('2026-09-01T09:00:00Z'),
    },
  });
  const post2 = await prisma.post.create({
    data: {
      title: 'Why Foreign Keys Save You Later',
      authorId: maya.id,
      createdAt: new Date('2026-09-03T09:00:00Z'),
    },
  });
  const post3 = await prisma.post.create({
    data: {
      title: 'Mongoose Populate in Five Minutes',
      authorId: ravi.id,
      createdAt: new Date('2026-09-05T09:00:00Z'),
    },
  });
  const post4 = await prisma.post.create({
    data: {
      title: 'Indexes Explained With a Library Analogy',
      authorId: omar.id,
      createdAt: new Date('2026-09-07T09:00:00Z'),
    }, // zero comments
  });

  await prisma.comment.createMany({
    data: [
      { text: 'This cleared up normalization for me', postId: post1.id, authorId: ravi.id, createdAt: new Date('2026-09-02T10:00:00Z') },
      { text: 'Great examples, thanks',               postId: post1.id, authorId: sana.id, createdAt: new Date('2026-09-06T10:00:00Z') },
      { text: 'Learned this the hard way',            postId: post2.id, authorId: sana.id, createdAt: new Date('2026-09-04T10:00:00Z') },
      { text: 'Foreign keys caught my bug once',      postId: post2.id, authorId: omar.id, createdAt: new Date('2026-09-08T10:00:00Z') },
      { text: 'Populate finally makes sense',         postId: post3.id, authorId: maya.id, createdAt: new Date('2026-09-09T10:00:00Z') },
      { text: 'Bookmarked for the next project',      postId: post3.id, authorId: sana.id, createdAt: new Date('2026-09-10T10:00:00Z') },
    ],
  });

  console.log('Seed complete:', {
    users: 4,
    posts: 4,
    comments: 6,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });