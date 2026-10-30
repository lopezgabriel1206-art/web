import { NextResponse } from 'next/server';
import { deleteSession, validateOrigin } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  if(!validateOrigin(req)) return NextResponse.json({error:'Origen no autorizado.'},{status:403});
  try {
    await deleteSession();
    return NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}});
  } catch {
    return NextResponse.json({error:'No se pudo revocar la sesión. Intentá de nuevo.'},{status:503,headers:{'Cache-Control':'no-store'}});
  }
}
