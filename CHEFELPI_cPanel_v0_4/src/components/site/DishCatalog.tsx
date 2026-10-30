'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { money } from '@/lib/utils';
type DishCard={id:string;slug:string;name:string;summary:string;priceCents:number|null;available:boolean;category:{id:string;name:string}|null};
type Category={id:string;name:string};
export function DishCatalog({dishes,categories,currency}:{dishes:DishCard[],categories:Category[],currency?:string}){
  const [search,setSearch]=useState('');const [selected,setSelected]=useState('all');
  const visible=useMemo(()=>dishes.filter(d=>(selected==='all'||d.category?.id===selected)&&d.name.toLocaleLowerCase('es').includes(search.trim().toLocaleLowerCase('es'))),[search,selected,dishes]);
  return <><div className="catalog-toolbar"><div className="search-input"><Search size={20}/><input aria-label="Buscar por nombre" placeholder="¿Qué tenés ganas de comer?" value={search} onChange={e=>setSearch(e.target.value)}/></div><div className="chip-list" aria-label="Filtrar categorías"><button className={selected==='all'?'chip selected':'chip'} onClick={()=>setSelected('all')}>Todos</button>{categories.map(c=><button key={c.id} onClick={()=>setSelected(c.id)} className={selected===c.id?'chip selected':'chip'}>{c.name}</button>)}</div></div>
    {visible.length ? <div className="catalog-grid">{visible.map(d=><article key={d.id} className="product-card"><div className="product-image"><UtensilsCrossed size={46}/><span>IMAGEN PRÓXIMAMENTE</span></div><div className="product-body"><div className="product-meta"><span>{d.category?.name||'Especialidades'}</span><span>{d.available?'Disponible':'Consultar'}</span></div><h3>{d.name}</h3><p>{d.summary||'Conocé todos los detalles de esta preparación.'}</p><div className="product-footer"><strong>{money(d.priceCents,currency)}</strong><Link href={'/comidas/'+d.slug} aria-label={'Ver '+d.name}><ArrowRight size={19}/></Link></div></div></article>)}</div> : <div className="no-results"><h3>{dishes.length?'No encontramos resultados':'El menú está en preparación'}</h3><p>{dishes.length?'Probá otra búsqueda o cambiá la categoría.':'Chefelpi incorporará sus comidas y precios reales desde el panel.'}</p></div>}
  </>;
}
