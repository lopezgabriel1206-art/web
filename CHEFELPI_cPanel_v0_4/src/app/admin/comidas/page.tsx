import {redirect} from 'next/navigation';
import {getAdmin} from '@/lib/auth';
import {db} from '@/lib/db';
import {AdminShell} from '@/components/admin/AdminShell';
import {DishEditor} from '@/components/admin/DishEditor';
export const dynamic='force-dynamic';
export default async function AdminDishes(){if(!await getAdmin())redirect('/admin/login');const [dishes,categories]=await Promise.all([db.dish.findMany({include:{category:true},orderBy:{createdAt:'desc'}}),db.category.findMany({orderBy:{name:'asc'}})]);return <AdminShell><span className="eyebrow">CATÁLOGO</span><h1>Gestión de comidas</h1><DishEditor dishes={dishes} categories={categories}/></AdminShell>}
