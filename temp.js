const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 

async function main() { 
  await prisma.course.update({ where: { id: 'qaida' }, data: { bannerImage: '/qaida_banner_ai.png' } }).catch(console.error); 
  await prisma.course.update({ where: { id: 'nazra' }, data: { bannerImage: '/nazra_banner_ai.png' } }).catch(console.error); 
  await prisma.course.update({ where: { id: 'hifz' }, data: { bannerImage: '/hifz_banner_ai.png' } }).catch(console.error); 
  console.log('Done!'); 
} 

main();
