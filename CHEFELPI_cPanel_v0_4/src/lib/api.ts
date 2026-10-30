import { NextResponse } from 'next/server';
import { getAdmin, validateOrigin } from './auth';
export async function adminOnly(request: Request) {
  if (!validateOrigin(request)) return NextResponse.json({error:'Origen no autorizado.'},{status:403});
  if (!await getAdmin()) return NextResponse.json({error:'Sesión no autorizada.'},{status:401});
  return null;
}
export function apiError(e:unknown) {
  console.error('[chefelpi] API error', e);
  return NextResponse.json({error:'No se pudo completar la operación.'},{status:500});
}
