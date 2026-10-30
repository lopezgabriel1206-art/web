import {NextResponse} from 'next/server';
import {z} from 'zod';
import {db} from '@/lib/db';
import {adminOnly,apiError} from '@/lib/api';
const schema=z.object({whatsappNumber:z.string().regex(/^\d{8,15}$/).or(z.literal('')),contactEmail:z.email().or(z.literal('')),currencyCode:z.enum(['ARS','VES','USD','EUR',''])});
export async function POST(req:Request){const forbidden=await adminOnly(req);if(forbidden)return forbidden;const values=schema.safeParse(await req.json().catch(()=>null));if(!values.success)return NextResponse.json({error:'WhatsApp debe tener entre 8 y 15 dígitos, sin +, o estar vacío.'},{status:400});try{await db.$transaction(Object.entries(values.data).map(([key,value])=>db.siteSetting.upsert({where:{key},create:{key,value},update:{value}})));return NextResponse.json({ok:true})}catch(e){return apiError(e)}}
