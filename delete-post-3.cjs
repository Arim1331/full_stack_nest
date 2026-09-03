const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const postId = 3;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      member: {
        select: {
          id: true,
          memberName: true,
        },
      },
      comment: true,
      postImage: true,
      postLike: true,
      postIngredientUsed: true,
    },
  });

  console.log("삭제 전 게시글:", post);

  if (!post) {
    console.log("id 3 게시글이 없습니다.");
    return;
  }

  await prisma.comment.deleteMany({
    where: { postId },
  });

  await prisma.postLike.deleteMany({
    where: { postId },
  });

  await prisma.postImage.deleteMany({
    where: { postId },
  });

  await prisma.postIngredientUsed.deleteMany({
    where: { postId },
  });

  await prisma.post.delete({
    where: { id: postId },
  });

  console.log("삭제 완료! postId:", postId);
}

main()
  .catch((error) => {
    console.error("삭제 중 에러:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
