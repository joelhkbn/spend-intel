import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { query } from '@/lib/db';
import { parseCSV, generateTransactionHash } from '@/lib/csv-parser';
import { categorizeTransaction } from '@/lib/categorizer';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = (session.user as any).id;
    const res = await query(
        `SELECT t.*, c.name as category_name 
     FROM transactions t 
     LEFT JOIN categories c ON t.category_id = c.id 
     WHERE t.user_id = $1 
     ORDER BY t.date DESC`,
        [userId]
    );

    return NextResponse.json(res.rows);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { csvContent } = await req.json();
        const userId = (session.user as any).id;
        const items = await parseCSV(csvContent);

        // Get categories mapping for v0.1
        const catRes = await query("SELECT id, name FROM categories");
        const catMap: Record<string, number> = {};
        catRes.rows.forEach(r => catMap[r.name] = r.id);

        const results = [];
        for (const item of items) {
            const categoryName = categorizeTransaction(item.description);
            const categoryId = catMap[categoryName] || catMap['Uncategorized'];
            const hash = generateTransactionHash(userId, item);

            try {
                await query(
                    `INSERT INTO transactions (user_id, date, description, amount, category_id, transaction_hash)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (user_id, transaction_hash) DO NOTHING`,
                    [userId, item.date, item.description, item.amount, categoryId, hash]
                );
                results.push({ ...item, status: 'imported' });
            } catch (e) {
                results.push({ ...item, status: 'error' });
            }
        }

        return NextResponse.json({ success: true, count: results.length });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
