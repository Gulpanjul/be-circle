import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.thread.deleteMany();
  await prisma.like.deleteMany();
  await prisma.reply.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.profile.deleteMany();
  // Seed 4 Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alice@example.com',
        username: 'alice',
        password: 'hashedpassword1',
        profile: {
          create: {
            fullName: 'Alice Wonderland',
            avatarUrl: 'https://example.com/alice.jpg',
            bannerUrl: 'https://example.com/banner-alice.jpg',
            bio: 'Explorer of the unknown.',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob@example.com',
        username: 'bob',
        password: 'hashedpassword2',
        profile: {
          create: {
            fullName: 'Bob Builder',
            avatarUrl: 'https://example.com/bob.jpg',
            bannerUrl: 'https://example.com/banner-bob.jpg',
            bio: 'Can we fix it? Yes we can!',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'charlie@example.com',
        username: 'charlie',
        password: 'hashedpassword3',
        profile: {
          create: {
            fullName: 'Charlie Chaplin',
            avatarUrl: 'https://example.com/charlie.jpg',
            bannerUrl: 'https://example.com/banner-charlie.jpg',
            bio: 'Silent movie legend.',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'diana@example.com',
        username: 'diana',
        password: 'hashedpassword4',
        profile: {
          create: {
            fullName: 'Diana Prince',
            avatarUrl: 'https://example.com/diana.jpg',
            bannerUrl: 'https://example.com/banner-diana.jpg',
            bio: 'Amazon warrior princess.',
          },
        },
      },
    }),
  ]);

  // Seed Threads
  const threads = await Promise.all([
    prisma.thread.create({
      data: {
        content: 'Hello from Alice!',
        images: 'https://example.com/thread-alice.jpg',
        userId: users[0].id,
      },
    }),
    prisma.thread.create({
      data: {
        content: 'Bob is building a house.',
        userId: users[1].id,
      },
    }),
    prisma.thread.create({
      data: {
        content: 'Charlie shares a silent story.',
        userId: users[2].id,
      },
    }),
    prisma.thread.create({
      data: {
        content: 'Diana stands for justice.',
        userId: users[3].id,
      },
    }),
  ]);

  // Seed Likes
  await prisma.like.createMany({
    data: [
      { userId: users[1].id, threadId: threads[0].id }, // Bob likes Alice
      { userId: users[2].id, threadId: threads[1].id }, // Charlie likes Bob
      { userId: users[3].id, threadId: threads[2].id }, // Diana likes Charlie
      { userId: users[0].id, threadId: threads[3].id }, // Alice likes Diana
    ],
  });

  // Seed Replies
  await prisma.reply.createMany({
    data: [
      {
        content: 'Nice post, Alice!',
        userId: users[1].id,
        threadId: threads[0].id,
      },
      {
        content: 'Great work, Bob!',
        userId: users[2].id,
        threadId: threads[1].id,
      },
      {
        content: 'Love your style, Charlie!',
        userId: users[3].id,
        threadId: threads[2].id,
      },
      {
        content: 'Diana for the win!',
        userId: users[0].id,
        threadId: threads[3].id,
      },
    ],
  });

  // Seed Follows
  await prisma.follow.createMany({
    data: [
      { followedId: users[0].id, followingId: users[1].id }, // Bob follows Alice
      { followedId: users[1].id, followingId: users[2].id }, // Charlie follows Bob
      { followedId: users[2].id, followingId: users[3].id }, // Diana follows Charlie
      { followedId: users[3].id, followingId: users[0].id }, // Alice follows Diana
    ],
  });
}

main()
  .then(async () => {
    console.log('✅ Seeding complete!');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
