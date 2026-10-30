import Link from 'next/link';
export default function NotFound(){return <section className="notfound container"><span className="eyebrow">404 — NO ENCONTRADO</span><h1>Esta receta no está en el menú.</h1><p>La dirección que buscás no existe o el contenido todavía no está publicado.</p><Link className="btn btn-primary" href="/">Volver al inicio</Link></section>}
