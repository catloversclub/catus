import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.appearance.deleteMany({})
  await prisma.personality.deleteMany({})

  const appearances = [
    { id: 1, label: "단모" },
    { id: 2, label: "중장모" },
    { id: 3, label: "장모" },
    { id: 4, label: "치즈 🧀" },
    { id: 5, label: "삼색이 🌈" },
    { id: 6, label: "고등어 🐟" },
    { id: 7, label: "턱시도 👔" },
    { id: 8, label: "카오스 🍪" },
    { id: 9, label: "올블랙 🖤" },
    { id: 10, label: "올화이트 🤍" },
    { id: 11, label: "젖소 🐄" },
    { id: 12, label: "블루 💙" },
    { id: 13, label: "초콜릿 🍫" },
    { id: 14, label: "라일락 🩶" },
    { id: 15, label: "시나몬 🤎" },
  ]

  for (const appearance of appearances) {
    await prisma.appearance.upsert({
      where: { id: appearance.id },
      update: { label: appearance.label },
      create: appearance,
    })
  }

  const personalities = [
    { id: 1, label: "애교쟁이 💕" },
    { id: 2, label: "도도 ✨" },
    { id: 3, label: "겁쟁이 🥺" },
    { id: 4, label: "장난꾸러기 😜" },
    { id: 5, label: "차분 🌿" },
    { id: 6, label: "먹보 🍩" },
    { id: 7, label: "츤데레 😤" },
    { id: 8, label: "똑쟁이 📖" },
    { id: 9, label: "수다쟁이 💨" },
    { id: 10, label: "순둥이 🧸" },
    { id: 11, label: "소심 ☔" },
    { id: 12, label: "예민 🔥" },
  ]

  for (const personality of personalities) {
    await prisma.personality.upsert({
      where: { id: personality.id },
      update: { label: personality.label },
      create: personality,
    })
  }

  console.log("🌱 Seed updated successfully!")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
