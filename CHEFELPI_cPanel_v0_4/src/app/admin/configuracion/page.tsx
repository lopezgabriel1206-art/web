import {redirect} from 'next/navigation';
import {getAdmin} from '@/lib/auth';
import {getSettings} from '@/lib/content';
import {AdminShell} from '@/components/admin/AdminShell';
import {SettingsEditor} from '@/components/admin/SettingsEditor';
export const dynamic='force-dynamic';
export default async function AdminSettings(){if(!await getAdmin())redirect('/admin/login');const initial=await getSettings();return <AdminShell><span className="eyebrow">CONFIGURACIÓN</span><h1>Datos generales</h1><SettingsEditor initial={initial}/></AdminShell>}
