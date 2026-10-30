'use client';
import {useState} from 'react';
export function AccountForm() {
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [success,setSuccess]=useState('');
  async function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();setBusy(true);setError('');setSuccess('');
    const form=event.currentTarget;
    const fields=new FormData(form);
    const currentPassword=String(fields.get('currentPassword')||'');
    const newPassword=String(fields.get('newPassword')||'');
    const confirm=String(fields.get('confirmPassword')||'');
    if(newPassword!==confirm) {setError('Las contraseñas nuevas no coinciden.');setBusy(false);return;}
    try {
      const response=await fetch('/api/admin/cuenta',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({currentPassword,newPassword}),
      });
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||'No se pudo actualizar la contraseña.');
      form.reset();
      setSuccess('Contraseña actualizada. Las demás sesiones abiertas fueron cerradas.');
    }catch(e){setError(e instanceof Error?e.message:'Error inesperado.');}
    finally{setBusy(false);}
  }
  return <form className="admin-edit account-form" onSubmit={submit} aria-busy={busy}>
    <h2>Cambiar contraseña</h2>
    <p className="muted">Usá una contraseña única de al menos 14 caracteres. Se cerrarán las sesiones anteriores por seguridad.</p>
    <label>Contraseña actual<input required type="password" name="currentPassword" autoComplete="current-password" maxLength={256}/></label>
    <label>Nueva contraseña<input required type="password" name="newPassword" autoComplete="new-password" minLength={14} maxLength={128}/></label>
    <label>Repetir nueva contraseña<input required type="password" name="confirmPassword" autoComplete="new-password" minLength={14} maxLength={128}/></label>
    {error&&<p className="admin-error" role="alert">{error}</p>}
    {success&&<p className="admin-success" role="status">{success}</p>}
    <button className="btn btn-primary" type="submit" disabled={busy}>{busy?'Guardando...':'Guardar contraseña nueva'}</button>
  </form>;
}
