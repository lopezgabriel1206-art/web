import { db, databaseReady } from './db';
import type { Prisma } from '@prisma/client';
const published = { status: 'PUBLISHED' as const };
const dishInclude = { category: true } as const;

// Sin BD: contenido comercial vacío, nunca inventar datos reales.
export async function getSettings() {
  if (!databaseReady()) return {} as Record<string,string>;
  try {
    const records = await db.siteSetting.findMany();
    return Object.fromEntries(records.map(r => [r.key,r.value]));
  } catch { return {} as Record<string,string>; }
}
export async function getCategories() {
  if (!databaseReady()) return [];
  return db.category.findMany({ where: {active:true}, orderBy:[{order:'asc'},{name:'asc'}] }).catch(() => []);
}
export async function getDishes() {
  if (!databaseReady()) return [];
  return db.dish.findMany({ where: published, include: dishInclude, orderBy: {createdAt:'desc'} }).catch(() => []);
}
export async function getDish(slug:string) {
  if (!databaseReady()) return null;
  return db.dish.findFirst({ where: {...published, slug}, include:dishInclude }).catch(() => null);
}
export async function getBooks() {
  if (!databaseReady()) return [];
  return db.book.findMany({ where:published, select:{id:true,slug:true,title:true,summary:true,coverUrl:true,priceCents:true,featured:true},orderBy:{createdAt:'desc'} }).catch(()=>[]);
}
export async function getBook(slug:string) {
  if (!databaseReady()) return null;
  // Whitelist: never select privateFileKey on the public route.
  return db.book.findFirst({where:{...published,slug},select:{id:true,slug:true,title:true,summary:true,description:true,topic:true,content:true,learn:true,audience:true,pageCount:true,priceCents:true,coverUrl:true,previewEnabled:true,previews:{orderBy:{order:'asc'},select:{id:true,publicUrl:true}}}}).catch(()=>null);
}
export async function getVideos() {
  if (!databaseReady()) return [];
  return db.video.findMany({where:published,orderBy:{createdAt:'desc'}}).catch(()=>[]);
}
export async function getPromotions() {
  if (!databaseReady()) return [];
  const now = new Date();
  const where: Prisma.PromotionWhereInput = { ...published, OR:[{startsAt:null},{startsAt:{lte:now}}], AND:[{OR:[{endsAt:null},{endsAt:{gte:now}}]}] };
  return db.promotion.findMany({where,orderBy:{createdAt:'desc'}}).catch(()=>[]);
}
export async function getReviews() {
  if (!databaseReady()) return [];
  return db.review.findMany({where:{status:'APPROVED',consent:true},orderBy:{createdAt:'desc'},take:30}).catch(()=>[]);
}
export async function getSocials() {
  if (!databaseReady()) return [];
  return db.socialLink.findMany({where:{active:true},orderBy:{platform:'asc'}}).catch(()=>[]);
}
