'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { BookOpen, ChefHat, House, Mail, Menu, Play, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
const items = [
  {label:'Inicio', href:'/'},
  {label:'Pedir comida', href:'/comidas', sub:[{label:'Catálogo de comidas',href:'/comidas'},{label:'Pedidos personalizados',href:'/comidas/personalizados'}]},
  {label:'Libros',href:'/libros'},
  {label:'Contenido',href:'/videos',sub:[{label:'Videos y recetas',href:'/videos'},{label:'Sobre Chefelpi',href:'/sobre-chefelpi'},{label:'Opiniones',href:'/opiniones'}]},
  {label:'Promociones',href:'/promociones'},
  {label:'Contacto',href:'/contacto'},
];
const mobile = [
  {label:'Inicio',href:'/',Icon:House}, {label:'Comidas',href:'/comidas',Icon:ChefHat},
  {label:'Libros',href:'/libros',Icon:BookOpen}, {label:'Videos',href:'/videos',Icon:Play},
  {label:'Contacto',href:'/contacto',Icon:Mail},
];
function NavGroup({item,active}:{item:{label:string,href:string,sub?:{label:string,href:string}[]},active:boolean}){
  const [expanded,setExpanded]=useState(false);
  return <div className={'menu-group '+(active?'active ':'')+(expanded?'open':'')} onMouseEnter={()=>setExpanded(true)} onMouseLeave={()=>setExpanded(false)} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node))setExpanded(false)}} onKeyDown={event=>{if(event.key==='Escape')setExpanded(false)}}>
    <button type="button" aria-haspopup="true" aria-expanded={expanded} onClick={()=>setExpanded(value=>!value)}>{item.label}<ChevronDown size={14}/></button>
    {expanded && <div className="dropdown-panel">{item.sub?.map(child=><Link href={child.href} key={child.href} onClick={()=>setExpanded(false)}>{child.label}<ArrowUpRight size={15}/></Link>)}</div>}
  </div>;
}
export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const isCurrent = (href:string) => href === '/' ? path === '/' : path.startsWith(href);
  return <>
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" onClick={()=>setOpen(false)} aria-label="Chefelpi, ir al inicio">
          <span className="brand-mark"><Image src="/images/chefelpi-emblema.jpg" alt="" width={44} height={44}/></span>
          <span className="brand-text">CHEFELPI<small>COCINA CON IDENTIDAD</small></span>
        </Link>
        <nav className="desktop-menu" aria-label="Navegación principal">
          {items.map(item => item.sub ? <NavGroup key={item.href} item={item} active={isCurrent(item.href)}/> : <Link key={item.href} className={'nav-link '+(isCurrent(item.href)?'active':'')} href={item.href}>{item.label}</Link>)}
        </nav>
        <div className="header-actions"><ThemeToggle/><button className="menu-toggle" onClick={()=>setOpen(v=>!v)} aria-label={open?'Cerrar menú':'Abrir menú'} aria-expanded={open} aria-controls="mobile-expanded-menu">{open?<X size={24}/>:<Menu size={24}/>}</button></div>
      </div>
      {open && <nav id="mobile-expanded-menu" className="mobile-expanded" aria-label="Menú completo">{items.map(item=><div key={item.href} className="mobile-entry"><Link href={item.href} onClick={()=>setOpen(false)}>{item.label}</Link>{item.sub?.map(child=><Link className="mobile-subentry" key={child.href} href={child.href} onClick={()=>setOpen(false)}>{child.label}</Link>)}</div>)}</nav>}
    </header>
    <nav className="mobile-bottom" aria-label="Accesos rápidos">{mobile.map(({Icon,...item})=><Link key={item.href} className={isCurrent(item.href)?'selected':''} href={item.href} onClick={()=>setOpen(false)} aria-current={isCurrent(item.href)?'page':undefined}><Icon size={20}/><span>{item.label}</span></Link>)}</nav>
  </>;
}
