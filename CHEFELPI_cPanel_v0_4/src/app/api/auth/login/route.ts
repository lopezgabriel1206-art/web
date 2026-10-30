import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { z } from 'zod';
import { db, databaseReady } from '@/lib/db';
import { createSession, validateOrigin } from '@/lib/auth';
import { LOGIN_WINDOW_MS, MAX_LOGIN_ATTEMPTS, normalizedAdminUsername, validAdminUsername } from '@/lib/auth-policy.mjs';

export const dynamic = 'force-dynamic';
const credentials = z.object({ username: z.string().trim().min(3).max(40), password: z.string().min(1).max(256) });
const noStore = {'Cache-Control': 'no-store'};

export async function POST(req: Request) {
  if (!validateOrigin(req)) return NextResponse.json({error:'Origen no autorizado.'},{status:403,headers:noStore});
  if (!databaseReady()) return NextResponse.json({error:'La base de datos todavía no está configurada.'},{status:503,headers:noStore});
  const parsed = credentials.safeParse(await req.json().catch(()=>null));
  if (!parsed.success) return NextResponse.json({error:'Comprobá el usuario y la contraseña.'},{status:400,headers:noStore});
  const username = normalizedAdminUsername(parsed.data.username);
  if (!validAdminUsername(username)) return NextResponse.json({error:'Usuario o contraseña incorrectos.'},{status:401,headers:noStore});
  const cutoff = new Date(Date.now()-LOGIN_WINDOW_MS);
  try {
    const failed = await db.loginAttempt.count({where:{loginKey:username,createdAt:{gte:cutoff}}});
    if (failed >= MAX_LOGIN_ATTEMPTS) return NextResponse.json(
      {error:'Demasiados intentos. Intentá nuevamente dentro de 15 minutos.'},
      {status:429,headers:{...noStore,'Retry-After':'900'}}
    );
    const user = await db.adminUser.findUnique({where:{username}});
    // El mismo error para usuarios existentes e inexistentes.
    const valid = user ? await compare(parsed.data.password,user.passwordHash) : false;
    if (!user || !valid) {
      await db.loginAttempt.create({data:{loginKey:username}});
      return NextResponse.json({error:'Usuario o contraseña incorrectos.'},{status:401,headers:noStore});
    }
    // No se cancela el acceso hasta que la sesión se haya persistido correctamente.
    await createSession(user.id);
    await db.loginAttempt.deleteMany({where:{loginKey:username}}).catch(()=>{});
    return NextResponse.json({ok:true},{headers:noStore});
  } catch (error) {
    console.error('[CHEFELPI] Login no disponible',error);
    return NextResponse.json({error:'No se pudo verificar la cuenta. Intentá más tarde.'},{status:503,headers:noStore});
  }
}
