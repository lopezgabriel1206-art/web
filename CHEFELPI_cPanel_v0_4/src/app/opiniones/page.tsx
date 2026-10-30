import type {Metadata} from 'next';
import {ReviewForm} from '@/components/forms/ReviewForm';
import {getReviews} from '@/lib/content';
import {EmptyState} from '@/components/site/Blocks';
export const metadata:Metadata={title:'Opiniones de clientes'};
export const dynamic='force-dynamic';
export default async function Reviews(){const reviews=await getReviews();return <><div className="page-hero"><div className="container"><span className="eyebrow">COMUNIDAD CHEFELPI</span><h1>Lo mejor es <em>compartir.</em></h1><p>Opiniones auténticas de quienes ya disfrutaron una preparación o un recetario de Chefelpi.</p></div></div><section className="section container review-layout"><div><h2>Experiencias compartidas</h2>{reviews.length?reviews.map(r=><article key={r.id} className="review-card"><div className="stars" aria-label={`${r.rating} de 5 estrellas`}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div><p>{r.comment}</p><strong>{r.displayName}</strong><small>{r.experience==='libro'?'Recetario digital':'Comida'}</small></article>):<EmptyState type="opiniones">Todavía no hay opiniones aprobadas. Nunca se publicarán testimonios inventados ni reseñas sin consentimiento.</EmptyState>}</div><ReviewForm/></section></>}
