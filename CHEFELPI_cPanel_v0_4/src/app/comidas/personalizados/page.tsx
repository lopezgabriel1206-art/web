import type {Metadata} from 'next';
import { getSettings } from '@/lib/content';
import { OrderForm } from '@/components/forms/OrderForm';
export const metadata:Metadata={title:'Pedidos personalizados'};
export const dynamic='force-dynamic';
export default async function Custom(){const config=await getSettings();return <><div className="page-hero"><div className="container"><span className="eyebrow">PEDIDOS A TU MANERA</span><h1>Vos imaginás.<br/><em>Nosotros cocinamos.</em></h1><p>Una ocasión, una preparación, una idea. Contanos qué necesitás para poder consultar disponibilidad y presupuesto.</p></div></div><section className="section container"><div className="form-page"><div className="form-intro"><span className="eyebrow">UN PEDIDO DIFERENTE</span><h2>La mejor comida empieza por una buena conversación.</h2><p>Explicanos qué comida querés, para cuántas personas y dónde la necesitás. Chefelpi confirmará condiciones, precios y entrega directamente.</p><p className="muted">Si aún no hay una zona de reparto publicada, consultá por WhatsApp la disponibilidad de entregas en tu zona.</p></div><OrderForm phone={config.whatsappNumber||''}/></div></section></>}
