import {redirect} from 'next/navigation';
import {LoginForm} from '@/components/admin/LoginForm';
import {getAdmin} from '@/lib/auth';
export const dynamic='force-dynamic';
export default async function AdminLogin(){if(await getAdmin())redirect('/admin');return <LoginForm/>}
