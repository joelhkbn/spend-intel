import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { query } from '@/lib/db';
import { generateTransactionHash } from '@/lib/csv-parser';
import { categorizeTransaction } from '@/lib/categorizer';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { transactions } = await req.json();
        const userId = (session.user as any).id;

        // Get categories mapping
        const catRes = await query("SELECT id, name FROM categories");
        const catMap: Record<string, number> = {};
        catRes.rows.forEach(r => catMap[r.name] = r.id);

        const results = [];
        for (const item of transactions) {
            // If AI already provided a category, try to match it, otherwise use categorizer
            let categoryId = catMap[item.category];
            if (!categoryId) {
                const categoryName = categorizeTransaction(item.description);
                categoryId = catMap[categoryName] || catMap['Uncategorized'];
            }

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
