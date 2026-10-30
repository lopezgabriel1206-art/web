import {redirect} from 'next/navigation';
import {getAdmin} from '@/lib/auth';
import {db} from '@/lib/db';
import {AdminShell} from '@/components/admin/AdminShell';
import {CategoryEditor} from '@/components/admin/CategoryEditor';
export const dynamic='force-dynamic';
export default async function AdminCategories(){if(!await getAdmin())redirect('/admin/login');const categories=await db.category.findMany({orderBy:{name:'asc'}});return <AdminShell><span className="eyebrow">CATÁLOGO</span><h1>Categorías</h1><CategoryEditor categories={categories}/></AdminShell>}
