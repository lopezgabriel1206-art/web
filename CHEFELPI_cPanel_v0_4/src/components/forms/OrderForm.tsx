'use client';
import { useState } from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { customMessage, dishMessage, whatsappLink } from '@/lib/whatsapp';
export function OrderForm({phone,dish}:{phone:string,dish?:string}) {
  const [quantity,setQuantity]=useState(1);
  const [zone,setZone]=useState('');
  const [date,setDate]=useState('');
  const [notes,setNotes]=useState('');
  const [kind,setKind]=useState('');
  const [details,setDetails]=useState('');
  const isCustom=!dish;
  const complete=Boolean(phone && zone.trim().length>=2 && date && quantity>=1 && (!isCustom || (kind.trim().length>=2 && details.trim().length>=10)));
  const message=isCustom?customMessage(kind,details,quantity,zone,date,notes):dishMessage(dish!,quantity,zone,date,notes);
  const href=complete?whatsappLink(phone,message):null;
  return <form className="order-form" onSubmit={event=>{event.preventDefault(); if(href) window.open(href,'_blank','noopener,noreferrer');}}>
    <div className="form-heading"><span className="eyebrow">CONSULTA SIN COMPROMISO</span><h3>{isCustom?'Contanos qué querés preparar':'Personalizá tu consulta'}</h3><p>Completá los datos para abrir un mensaje preparado en WhatsApp. Esto no confirma el pedido.</p></div>
    {isCustom && <><label>Tipo de comida<input required minLength={2} maxLength={100} value={kind} onChange={e=>setKind(e.target.value)} placeholder="Ej. cena especial, postre..."/></label><label>¿Cómo te gustaría que sea?<textarea required minLength={10} maxLength={1000} rows={4} value={details} onChange={e=>setDetails(e.target.value)} placeholder="Describí la preparación que necesitás"/></label></>}
    <div className="form-pair"><label>{isCustom?'Cantidad de porciones':'Cantidad'}<input type="number" min={1} max={300} required value={quantity} onChange={e=>setQuantity(Number(e.target.value))}/></label><label>Fecha deseada<input type="date" required min={new Date().toLocaleDateString('en-CA')} value={date} onChange={e=>setDate(e.target.value)}/></label></div>
    <label>Zona de entrega<input required maxLength={180} minLength={2} value={zone} onChange={e=>setZone(e.target.value)} placeholder="Barrio, ciudad o localidad"/></label>
    <label>Preferencias u observaciones <span className="field-optional">(opcional)</span><textarea maxLength={700} rows={3} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Contanos lo que creas importante"/></label>
    {!phone && <p className="form-note">El número de WhatsApp todavía no fue configurado por Chefelpi. El formulario quedará disponible cuando se configure.</p>}
    <button className="btn btn-primary btn-full" type="submit" disabled={!complete || !href}><MessageCircle size={19}/> Consultar por WhatsApp <ArrowUpRight size={18}/></button><p className="form-disclaimer">La disponibilidad, el precio y la entrega se confirmarán directamente con Chefelpi.</p>
  </form>;
}
