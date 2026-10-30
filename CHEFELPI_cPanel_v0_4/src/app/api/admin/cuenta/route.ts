import { NextResponse } from 'next/server';
import { compare, hash } from 'bcryptjs';
import { z } from 'zod';
import { adminOnly, apiError } from '@/lib/api';
import { db } from '@/lib/db';
import { getAdmin, createSession } from '@/lib/auth';
import { isStrongAdminPassword } from '@/lib/auth-policy.mjs';

export const dynamic = 'force-dynamic';
const bodySchema = z.object({
  currentPassword: z.string().min(1).max(256),
  newPassword: z.string().min(14).max(128),
});

export async function POST(req: Request) {
  const forbidden = await adminOnly(req);
  if (forbidden) return forbidden;
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({error:'Sesión vencida.'},{status:401});
  const parsed = bodySchema.safeParse(await req.json().catch(()=>null));
  if (!parsed.success || !isStrongAdminPassword(parsed.data.newPassword)) {
    return NextResponse.json({error:'La nueva contraseña debe tener entre 14 y 128 caracteres (máximo 72 bytes), sin espacios en los extremos.'},{status:400});
  }
  if (parsed.data.currentPassword === parsed.data.newPassword) {
    return NextResponse.json({error:'Elegí una contraseña diferente de la actual.'},{status:400});
  }
  try {
    const account = await db.adminUser.findUnique({where:{id:admin.id}});
    if (!account || !await compare(parsed.data.currentPassword, account.passwordHash)) {
      return NextResponse.json({error:'La contraseña actual no es correcta.'},{status:401});
    }
    const newHash = await hash(parsed.data.newPassword,12);
    await db.$transaction(async (tx)=>{
      await tx.adminUser.update({where:{id:admin.id},data:{passwordHash:newHash}});
      await tx.adminSession.updateMany({where:{userId:admin.id,revokedAt:null},data:{revokedAt:new Date()}});
    });
    // La sesión actual se renueva; las sesiones anteriores quedan revocadas.
    await createSession(admin.id);
    return NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}});
  } catch(e) {return apiError(e);}
}
