import { PrismaClient, Role, CourseCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@quranacademy.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@quranacademy.com',
      password: adminPassword,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // 2. Create Teacher Users and Profiles
  const teacherPassword = await bcrypt.hash('teacher123', 10);
  
  const teacher1 = await prisma.user.upsert({
    where: { email: 'ahmad.teacher@quranacademy.com' },
    update: {},
    create: {
      name: 'Ahmad Ali',
      email: 'ahmad.teacher@quranacademy.com',
      password: teacherPassword,
      role: Role.TEACHER,
      emailVerified: new Date(),
      teacherProfile: {
        create: {
          bio: 'Experienced in teaching Qaida and Nazra.',
          qualification: 'Hafiz-e-Quran, Qari',
          monthlySalaryAmount: 50000,
        },
      },
    },
  });
  console.log(`Created teacher user: ${teacher1.email}`);

  const teacher2 = await prisma.user.upsert({
    where: { email: 'fatima.teacher@quranacademy.com' },
    update: {},
    create: {
      name: 'Fatima Zohra',
      email: 'fatima.teacher@quranacademy.com',
      password: teacherPassword,
      role: Role.TEACHER,
      emailVerified: new Date(),
      teacherProfile: {
        create: {
          bio: 'Specializes in Hifz for children.',
          qualification: 'Alimah, Hafiza',
          monthlySalaryAmount: 45000,
        },
      },
    },
  });
  console.log(`Created teacher user: ${teacher2.email}`);

  // Get teacher profiles
  const teacher1Profile = await prisma.teacherProfile.findUnique({ where: { userId: teacher1.id } });
  const teacher2Profile = await prisma.teacherProfile.findUnique({ where: { userId: teacher2.id } });

  if (!teacher1Profile || !teacher2Profile) {
      throw new Error('Failed to create teacher profiles');
  }

  // 3. Create Courses
  const qaidaCourse = await prisma.course.create({
    data: {
      name: 'Beginner Qaida',
      category: CourseCategory.QAIDA,
      timingNote: 'Suitable for kids',
      description: 'Foundation course for beginners to learn reading Arabic letters.',
    },
  });

  const nazraCourse = await prisma.course.create({
    data: {
      name: 'Nazra Quran',
      category: CourseCategory.NAZRA,
      timingNote: 'Advanced level',
      description: 'Learn the rules of Tajweed to recite the Quran correctly.',
    },
  });

  const hifzCourse = await prisma.course.create({
    data: {
      name: 'Hifz Program',
      category: CourseCategory.HIFZ,
      timingNote: 'Flexible scheduling',
      description: 'Complete memorization of the Holy Quran with proper Tajweed.',
    },
  });
  console.log(`Created courses: Qaida, Nazra, Hifz`);

  // 4. Create Batches
  const batch1 = await prisma.batch.create({
    data: {
      name: 'Qaida - Evening A',
      courseId: qaidaCourse.id,
      teacherId: teacher1Profile.id,
      daysOfWeek: ['Mon', 'Wed', 'Fri'],
      time: '18:00-19:00',
    },
  });

  const batch2 = await prisma.batch.create({
    data: {
      name: 'Hifz - Morning A',
      courseId: hifzCourse.id,
      teacherId: teacher2Profile.id,
      daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      time: '06:00-08:00',
    },
  });
  console.log(`Created batches: ${batch1.name}, ${batch2.name}`);

  // 5. Create a Student and Registration
  const studentPassword = await bcrypt.hash('student123', 10);
  const student = await prisma.user.upsert({
    where: { email: 'student1@example.com' },
    update: {},
    create: {
      name: 'Ali Raza',
      email: 'student1@example.com',
      password: studentPassword,
      role: Role.STUDENT,
      emailVerified: new Date(),
      studentProfile: {
        create: {
          fatherName: 'Raza Khan',
          address: 'Lahore, Pakistan',
          country: 'Pakistan',
          age: 12,
        },
      },
    },
  });
  
  const studentProfile = await prisma.studentProfile.findUnique({ where: { userId: student.id } });
  
  if (studentProfile) {
    const registration = await prisma.registration.create({
        data: {
            studentId: studentProfile.id,
            courseId: qaidaCourse.id,
            batchId: batch1.id,
            status: 'ACTIVE',
        }
    });
    console.log(`Created student user and registration: ${student.email}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
