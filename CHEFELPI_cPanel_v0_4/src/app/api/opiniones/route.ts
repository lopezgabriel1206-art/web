import {NextResponse} from 'next/server';
import {createHash} from 'node:crypto';
import {z} from 'zod';
import {db,databaseReady} from '@/lib/db';
import {validateOrigin} from '@/lib/auth';
const schema=z.object({displayName:z.string().trim().min(2).max(60),experience:z.enum(['comida','libro']),rating:z.number().int().min(1).max(5),comment:z.string().trim().min(10).max(1500),consent:z.literal(true),website:z.string().optional()});
export async function POST(req:Request){
 if(!validateOrigin(req))return NextResponse.json({error:'Solicitud no autorizada'},{status:403});
 if(!databaseReady()||!process.env.REVIEW_HASH_PEPPER)return NextResponse.json({error:'El formulario todavía no está habilitado por el administrador.'},{status:503});
 const data=schema.safeParse(await req.json().catch(()=>null));
 if(!data.success)return NextResponse.json({error:'Revisá los campos y el consentimiento.'},{status:400});
 if(data.data.website)return NextResponse.json({ok:true},{status:202}); // Trampa para bots, sin guardar.
 const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
 const ipHash=createHash('sha256').update(ip+process.env.REVIEW_HASH_PEPPER).digest('hex');
 try{
   const recent=await db.review.count({where:{submissionIpHash:ipHash,createdAt:{gte:new Date(Date.now()-24*3600*1000)}}});
   if(recent>=3)return NextResponse.json({error:'Se alcanzó el límite de envíos. Intentá más adelante.'},{status:429});
   await db.$transaction(async tx=>{
     const review=await tx.review.create({data:{displayName:data.data.displayName,experience:data.data.experience,rating:data.data.rating,comment:data.data.comment,consent:true,submissionIpHash:ipHash}});
     await tx.notification.create({data:{kind:'REVIEW_PENDING',title:'Nueva reseña pendiente',message:`Se recibió una reseña que requiere aprobación.`,href:'/admin/opiniones',dedupKey:'review:'+review.id}});
   });
   return NextResponse.json({ok:true,moderation:'PENDING'},{status:202});
 }catch(e){console.error('[chefelpi] Error storing review',e);return NextResponse.json({error:'No se pudo guardar tu opinión.'},{status:503});}
}
