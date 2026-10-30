import type {MetadataRoute} from 'next';
export default function sitemap():MetadataRoute.Sitemap{const host=process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000';return ['/','/sobre-chefelpi','/comidas','/comidas/personalizados','/libros','/videos','/promociones','/opiniones','/contacto'].map(url=>({url:host+url,changeFrequency:'weekly',priority:url==='/'?1:0.7}));}
