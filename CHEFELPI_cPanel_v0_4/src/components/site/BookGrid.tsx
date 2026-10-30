import Link from 'next/link';
import { BookOpen, ArrowUpRight } from 'lucide-react';
import { money } from '@/lib/utils';
type BookCard={id:string,slug:string,title:string,summary:string,coverUrl:string|null,priceCents:number|null};
export function BookGrid({books,currency}:{books:BookCard[],currency?:string}) {return <div className="catalog-grid">{books.map(b=><article key={b.id} className="product-card"><div className="book-cover"><BookOpen size={52}/><span>RECETARIO DIGITAL</span></div><div className="product-body"><div className="product-meta"><span>FORMATO PDF</span></div><h3>{b.title}</h3><p>{b.summary}</p><div className="product-footer"><strong>{money(b.priceCents,currency)}</strong><Link href={'/libros/'+b.slug} aria-label={'Ver libro '+b.title}><ArrowUpRight size={19}/></Link></div></div></article>)}</div>}
