import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/auth';
import { AdminShell } from '@/components/admin/AdminShell';
import { AccountForm } from '@/components/admin/AccountForm';
export const dynamic='force-dynamic';
export default async function AdminAccount() {
  const admin=await getAdmin();
  if(!admin) redirect('/admin/login');
  return <AdminShell>
    <span className="eyebrow">SEGURIDAD Y ACCESO</span>
    <h1>Mi cuenta</h1>
    <p className="muted">Administrá la contraseña de acceso al panel. No existen cuentas públicas.</p>
    <div className="admin-edit">
      <h2>Datos del administrador</h2>
      <p><strong>Nombre:</strong> {admin.name}</p>
      <p><strong>Usuario:</strong> {admin.username}</p>
    </div>
    <AccountForm />
  </AdminShell>;
}
