import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const appearances = [
    "단모",
    "중장모",
    "장모",
    "치즈",
    "삼색이",
    "고등어",
    "턱시도",
    "카오스",
    "올블랙",
    "올화이트",
    "젖소",
    "블루",
    "초콜릿",
    "라일락",
    "시나몬",
  ]

  for (const label of appearances) {
    await prisma.appearance.upsert({
      where: { label },
      update: {},
      create: { label },
    })
  }

  const personalities = [
    "애교쟁이",
    "도도",
    "겁쟁이",
    "장난꾸러기",
    "차분",
    "먹보",
    "츤데레",
    "똑쟁이",
    "수다쟁이",
    "순둥이",
    "소심",
    "예민",
  ]

  for (const label of personalities) {
    await prisma.personality.upsert({
      where: { label },
      update: {},
      create: { label },
    })
  }

  console.log("🌱 Seed data inserted successfully!")
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
