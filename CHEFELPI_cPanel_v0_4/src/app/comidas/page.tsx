import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { DishCatalog } from '@/components/site/DishCatalog';
import { getCategories, getDishes, getSettings } from '@/lib/content';
export const metadata:Metadata={title:'Comidas',description:'Catálogo de comidas de Chefelpi. Consultá por WhatsApp.'};
export const dynamic='force-dynamic';
export default async function Comidas(){const [dishes,categories,settings]=await Promise.all([getDishes(),getCategories(),getSettings()]);return <><div className="page-hero"><div className="container"><span className="eyebrow">EL MENÚ</span><h1>Hecho para <em>disfrutar.</em></h1><p>Comidas preparadas con dedicación. Encontrá la tuya o consultanos por una creación especial.</p><Link href="/comidas/personalizados" className="btn btn-primary">Quiero algo personalizado <ArrowUpRight size={18}/></Link></div></div><section className="section container"><DishCatalog dishes={dishes} categories={categories} currency={settings.currencyCode}/></section></>}
