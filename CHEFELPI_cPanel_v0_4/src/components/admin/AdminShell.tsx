'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {LayoutDashboard,UtensilsCrossed,Tags,MessageSquare,Settings,ShieldCheck,ExternalLink} from 'lucide-react';
import {LogoutButton} from './LogoutButton';
const links = [
  {href:'/admin',label:'Escritorio',Icon:LayoutDashboard},
  {href:'/admin/categorias',label:'Categorías',Icon:Tags},
  {href:'/admin/comidas',label:'Comidas',Icon:UtensilsCrossed},
  {href:'/admin/opiniones',label:'Opiniones',Icon:MessageSquare},
  {href:'/admin/configuracion',label:'Configuración',Icon:Settings},
  {href:'/admin/cuenta',label:'Mi cuenta',Icon:ShieldCheck},
];
export function AdminShell({children}:{children:React.ReactNode}){
  const path=usePathname();
  return <div className="admin-shell">
    <aside className="admin-side" aria-label="Navegación del panel">
      <strong className="admin-side-brand">CHEFELPI <span>ADMIN</span></strong>
      {links.map(({href,label,Icon})=><Link href={href} key={href} className={path===href?'current':''} aria-current={path===href?'page':undefined}><Icon size={17}/>{label}</Link>)}
      <Link href="/" target="_blank" rel="noopener noreferrer"><ExternalLink size={17}/>Ver sitio público</Link>
      <LogoutButton/>
    </aside>
    <div className="admin-content">{children}</div>
  </div>;
}
