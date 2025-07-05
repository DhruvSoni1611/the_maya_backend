const prisma = require("../lib/prisma").default;

async function handleImageSave({ email, prompt, imageUrl, format }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  if (user.tokens <= 0) {
    return { success: false, message: "No tokens left" };
  }

  const [savedPrompt, updatedUser] = await prisma.$transaction([
    prisma.prompt.create({
      data: {
        userId: user.id,
        prompt,
        imageUrl,
        format,
      },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { tokens: { decrement: 1 } },
    }),
  ]);

  return {
    success: true,
    prompt: savedPrompt,
    remainingTokens: updatedUser.tokens,
  };
}

module.exports = { handleImageSave };
