'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {Eye,EyeOff,LockKeyhole,ShieldCheck} from 'lucide-react';
export function LoginForm() {
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const [visible,setVisible]=useState(false);
  const router=useRouter();
  async function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();setBusy(true);setError('');
    const data=new FormData(e.currentTarget);
    try {
      const response=await fetch('/api/auth/login',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({username:data.get('username'),password:data.get('password')}),
        cache:'no-store',
      });
      const result=await response.json();
      if(!response.ok) throw new Error(result.error||'No se pudo iniciar sesión.');
      router.replace('/admin');router.refresh();
    } catch(e) {setError(e instanceof Error?e.message:'Ocurrió un error.');}
    finally {setBusy(false);}
  }
  return <section className="admin-login-container">
    <div className="admin-login-intro">
      <div className="admin-login-icon"><LockKeyhole size={27}/></div>
      <span className="eyebrow">PANEL PRIVADO · CHEFELPI</span>
      <h1>Bienvenido de nuevo.</h1>
      <p>El centro de control de tu cocina. Entrá con tu cuenta para administrar el contenido de CHEFELPI.</p>
      <div className="admin-secure-note"><ShieldCheck size={18}/><span>Acceso exclusivo para el administrador.</span></div>
    </div>
    <form className="admin-login" onSubmit={submit} aria-busy={busy}>
      <h2>Iniciar sesión</h2>
      <p className="muted">Ingresá las credenciales creadas al instalar la plataforma.</p>
      <label htmlFor="chefelpi-admin-username">Nombre de usuario</label>
      <input id="chefelpi-admin-username" required type="text" name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} minLength={3} maxLength={40} placeholder="enriquevalladares"/>
      <label htmlFor="chefelpi-admin-password">Contraseña</label>
      <div className="admin-password-field">
        <input id="chefelpi-admin-password" required type={visible?'text':'password'} name="password" autoComplete="current-password" maxLength={256} placeholder="Ingresá tu contraseña"/>
        <button type="button" onClick={()=>setVisible(x=>!x)} aria-label={visible?'Ocultar contraseña':'Mostrar contraseña'} title={visible?'Ocultar contraseña':'Mostrar contraseña'}>{visible?<EyeOff size={19}/>:<Eye size={19}/>}</button>
      </div>
      {error&&<p className="admin-error" role="alert">{error}</p>}
      <button disabled={busy} className="btn btn-primary btn-full" type="submit">{busy?'Verificando cuenta...':'Entrar al panel'}</button>
      <div className="admin-login-footer"><Link href="/">← Volver al sitio público</Link><span>No hay registro público</span></div>
    </form>
  </section>;
}
