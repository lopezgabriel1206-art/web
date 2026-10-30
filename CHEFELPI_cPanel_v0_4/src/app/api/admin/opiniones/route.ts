import {NextResponse} from 'next/server';
import {z} from 'zod';
import {db} from '@/lib/db';
import {adminOnly,apiError} from '@/lib/api';
const schema=z.object({id:z.string().min(1),status:z.enum(['APPROVED','REJECTED','HIDDEN'])});
export async function PATCH(req:Request){const denied=await adminOnly(req);if(denied)return denied;const p=schema.safeParse(await req.json().catch(()=>null));if(!p.success)return NextResponse.json({error:'Operación inválida.'},{status:400});try{await db.review.update({where:{id:p.data.id},data:{status:p.data.status}});return NextResponse.json({ok:true});}catch(e){return apiError(e)}}
