import Link from 'next/link';
import { ArrowRight, CookingPot, BookOpen, Clapperboard, Sparkles } from 'lucide-react';
import { money } from '@/lib/utils';
export function SectionTitle({kicker,title,description,href,linkText}:{kicker:string,title:string,description?:string,href?:string,linkText?:string}) {
  return <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/>{kicker}</div><h2>{title}</h2>{description && <p>{description}</p>}</div>{href && <Link className="text-link" href={href}>{linkText || 'Ver todo'} <ArrowRight size={17}/></Link>}</div>;
}
export function EmptyState({type='contenido',children}:{type?:'comidas'|'libros'|'videos'|'opiniones'|'promociones'|'contenido',children?:React.ReactNode}) {
  const icons = {comidas:CookingPot,libros:BookOpen,videos:Clapperboard,opiniones:Sparkles,promociones:Sparkles,contenido:Sparkles};
  const Icon=icons[type];
  return <div className="empty-state"><div className="empty-icon"><Icon size={28}/></div><h3>Estamos preparando esta sección</h3><p>{children || 'Los contenidos oficiales estarán disponibles cuando Chefelpi los publique desde su panel.'}</p></div>;
}
export function Price({cents}:{cents?:number|null}) { return <span className="price">{money(cents)}</span>; }
