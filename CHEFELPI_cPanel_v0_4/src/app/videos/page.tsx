import type {Metadata} from 'next';
import {ArrowUpRight,PlayCircle} from 'lucide-react';
import {EmptyState} from '@/components/site/Blocks';
import {getVideos} from '@/lib/content';
import {safePublicUrl} from '@/lib/utils';
export const metadata:Metadata={title:'Videos y recetas'};
export const dynamic='force-dynamic';
export default async function Videos(){const videos=await getVideos();return <><div className="page-hero"><div className="container"><span className="eyebrow">CHEFELPI EN ACCIÓN</span><h1>La cocina se <em>vive.</em></h1><p>Descubrí videos, recetas y momentos compartidos en nuestras redes oficiales.</p></div></div><section className="section container">{videos.length?<div className="catalog-grid">{videos.map(v=>{const href=safePublicUrl(v.sourceUrl);return <article key={v.id} className="product-card"><div className="video-cover"><PlayCircle size={54}/><span>{v.platform.toUpperCase()}</span></div><div className="product-body"><span className="eyebrow">{v.platform}</span><h3>{v.title}</h3><p>{v.description}</p>{href&&<a className="text-link" href={href} target="_blank" rel="noopener noreferrer">Ver publicación original <ArrowUpRight size={18}/></a>}</div></article>})}</div>:<EmptyState type="videos">Los videos aparecerán aquí cuando se carguen las publicaciones oficiales. No se mostrarán reproducciones ficticias.</EmptyState>}</section></>}
