import {redirect} from 'next/navigation';
import {getAdmin} from '@/lib/auth';
import {db} from '@/lib/db';
import {AdminShell} from '@/components/admin/AdminShell';
import {ReviewModerator} from '@/components/admin/ReviewModerator';
export const dynamic='force-dynamic';
export default async function AdminReviews(){if(!await getAdmin())redirect('/admin/login');const reviews=await db.review.findMany({orderBy:{createdAt:'desc'},take:100});return <AdminShell><span className="eyebrow">COMUNIDAD</span><h1>Moderación de opiniones</h1><ReviewModerator reviews={reviews}/></AdminShell>}
