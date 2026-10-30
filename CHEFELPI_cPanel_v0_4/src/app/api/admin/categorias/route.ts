import {NextResponse} from 'next/server';
import {z} from 'zod';
import {adminOnly,apiError} from '@/lib/api';
import {db} from '@/lib/db';
import {slugify} from '@/lib/utils';
const inputSchema=z.object({name:z.string().trim().min(2).max(75),active:z.boolean().default(true),order:z.number().int().min(0).max(10000).default(0)});
export async function POST(req:Request){const forbidden=await adminOnly(req);if(forbidden)return forbidden;const data=inputSchema.safeParse(await req.json().catch(()=>null));if(!data.success)return NextResponse.json({error:'Nombre o valores inválidos.'},{status:400});try{const slug=slugify(data.data.name);if(!slug)return NextResponse.json({error:'Nombre inválido.'},{status:400});const c=await db.category.create({data:{...data.data,slug}});return NextResponse.json({ok:true,category:c},{status:201});}catch(e){return apiError(e)}}
export async function DELETE(req:Request){const forbidden=await adminOnly(req);if(forbidden)return forbidden;const json=await req.json().catch(()=>null);const data=z.object({id:z.string().min(1)}).safeParse(json);if(!data.success)return NextResponse.json({error:'ID incorrecto'},{status:400});try{await db.category.delete({where:{id:data.data.id}});return NextResponse.json({ok:true});}catch(e){return apiError(e)}}
