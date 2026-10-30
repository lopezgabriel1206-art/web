import type {Metadata} from 'next';
import {EmptyState} from '@/components/site/Blocks';
import {getPromotions} from '@/lib/content';
import {safePublicUrl} from '@/lib/utils';
import {ArrowUpRight} from 'lucide-react';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Promociones y novedades'};
export default async function Promotions(){const promos=await getPromotions();return <><div className="page-hero"><div className="container"><span className="eyebrow">ACTUALIDAD</span><h1>Algo bueno está <em>por venir.</em></h1><p>Nuevos platos, anuncios especiales, propuestas y promociones vigentes.</p></div></div><section className="section container">{promos.length?<div className="simple-grid">{promos.map(p=><article key={p.id} className="simple-card"><span>NOVEDAD</span><h3>{p.title}</h3><p>{p.description}</p>{safePublicUrl(p.linkUrl)&&<a href={safePublicUrl(p.linkUrl)} target="_blank" rel="noopener noreferrer" className="text-link">Más detalles <ArrowUpRight size={18}/></a>}</article>)}</div>:<EmptyState type="promociones">Por ahora no hay promociones activas. Las ofertas publicadas tendrán fechas de vigencia reales.</EmptyState>}</section></>}
