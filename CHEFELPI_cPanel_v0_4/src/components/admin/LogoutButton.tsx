'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {LogOut} from 'lucide-react';
export function LogoutButton(){
  const router=useRouter();const [busy,setBusy]=useState(false);
  async function logout(){
    setBusy(true);
    try {
      const response=await fetch('/api/auth/logout',{method:'POST',cache:'no-store'});
      if(!response.ok)throw new Error('No se pudo cerrar sesión.');
      router.replace('/admin/login');router.refresh();
    }catch {setBusy(false);window.alert('No se pudo cerrar la sesión. Intentá nuevamente.');}
  }
  return <button className="admin-logout" disabled={busy} onClick={logout}><LogOut size={17}/>{busy?'Cerrando...':'Cerrar sesión'}</button>;
}
