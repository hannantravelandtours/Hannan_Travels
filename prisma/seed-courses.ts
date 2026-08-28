import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const mockCourses = [
  {
    id: "noorani-qaida",
    name: "Noorani Qaida",
    category: "QURAN",
    description: "Learn basic Arabic alphabets, letter joints, correct pronunciation, and basic phonics. Essential foundation for reading the Quran.",
  },
  {
    id: "quran-reading",
    name: "Quran Reading",
    category: "QURAN",
    description: "Practice reading the full Quran with flow, correct pronunciation, and breathing pauses. Suitable for those who completed Noorani Qaida.",
  },
  {
    id: "quran-tajweed",
    name: "Quran with Tajweed",
    category: "TAJWEED",
    description: "Learn the formal rules of Tajweed (Makharij, Sifaat, Madd, Noon Sakinah) to recite beautifully with rules like a professional Qari.",
  },
  {
    id: "hifz-quran",
    name: "Hifz-ul-Quran Memorization",
    category: "HIFZ",
    description: "Structured, 1-on-1 memorization program designed for students wanting to memorize specific Juz or become a complete Hafiz/Hafiza.",
  },
  {
    id: "arabic-language",
    name: "Arabic Language Grammar",
    category: "ARABIC",
    description: "Build comprehensive skills in Classical and Modern Arabic. Focuses on vocabulary, verb conjugation, and direct translation of Quran verses.",
  },
  {
    id: "islamic-studies",
    name: "Islamic Studies & Fiqh",
    category: "ISLAMIC_STUDIES",
    description: "Study pillars of Islam, Hadith, Seerah, Islamic history, and jurisprudence (Fiqh) relative to daily acts of worship.",
  },
  {
    id: "tafseer-quran",
    name: "Tafseer (Quran Explanation)",
    category: "ISLAMIC_STUDIES",
    description: "Understand the deep historical contexts, background reasons for revelation, and theological interpretations of Quranic verses.",
  },
  {
    id: "hadith-studies",
    name: "Hadith Studies (Riyadhus Saliheen)",
    category: "ISLAMIC_STUDIES",
    description: "Analysis of prophetic traditions (Hadith), learning their context, authenticity, and practical application in everyday life.",
  },
  {
    id: "quran-for-kids",
    name: "Quran Classes for Kids",
    category: "KIDS",
    description: "Fun, engaging, and gamified Quran learning customized to capture children's focus. Combines reading, short Surah memorization, and Islamic manners.",
  },
  {
    id: "quran-for-females",
    name: "Quran Classes for Females",
    category: "FEMALE_ONLY",
    description: "1-on-1 private lessons conducted exclusively by certified, native female scholars in a secure online setting. Covers Tajweed, Hifz, or Fiqh.",
  },
  {
    id: "hajj-information",
    name: "Hajj Information",
    category: "ISLAMIC_STUDIES",
    description: "Complete guide on Hajj and Umrah performance. Includes step-by-step procedures, practical rules, supplications, and spiritual guidelines.",
  }
];

async function main() {
  console.log("Seeding old static courses...");
  for (const course of mockCourses) {
    await prisma.course.upsert({
      where: { id: course.id },
      update: {
        name: course.name,
        category: course.category as any,
        description: course.description,
        isActive: true,
      },
      create: {
        id: course.id,
        name: course.name,
        category: course.category as any,
        description: course.description,
        isActive: true,
      },
    });
  }
  console.log("Courses seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
