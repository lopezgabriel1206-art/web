import type {Metadata} from 'next';
import {BookGrid} from '@/components/site/BookGrid';
import {EmptyState} from '@/components/site/Blocks';
import {getBooks,getSettings} from '@/lib/content';
export const metadata:Metadata={title:'Libros digitales',description:'Recetarios digitales en PDF de Chefelpi.'};
export const dynamic='force-dynamic';
export default async function Books(){const [books,settings]=await Promise.all([getBooks(),getSettings()]);return <><div className="page-hero"><div className="container"><span className="eyebrow">NUESTRA BIBLIOTECA</span><h1>Recetas para <em>volver a crear.</em></h1><p>Ideas, técnicas y sabores reunidos en recetarios digitales. Aprendé a tu ritmo, en tu cocina.</p></div></div><section className="section container">{books.length?<BookGrid books={books} currency={settings.currencyCode}/>:<EmptyState type="libros">Todavía no hay recetarios publicados. Las portadas, precios y vistas previas se incorporarán con contenido oficial.</EmptyState>}</section></>}
