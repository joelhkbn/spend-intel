import Papa from 'papaparse';
import { createHash } from 'crypto';

export interface RawTransaction {
    date: string;
    description: string;
    amount: number;
    merchant?: string;
}

export interface NormalizedTransaction extends RawTransaction {
    hash: string;
}

export const parseCSV = (csvContent: string): Promise<RawTransaction[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(csvContent, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const transactions: RawTransaction[] = results.data.map((row: any) => {
                    // Flexible header mapping logic
                    const date = row.date || row.Date || row.Timestamp || '';
                    const description = row.description || row.Description || row.Memo || '';
                    const amountStr = row.amount || row.Amount || row.Value || '0';

                    // Clean amount: Remove currency symbols, commas
                    const amount = parseFloat(amountStr.replace(/[^\d.-]/g, ''));

                    return {
                        date,
                        description,
                        amount: isNaN(amount) ? 0 : amount,
                        merchant: description, // Default merchant to description for now
                    };
                }).filter(t => t.date && t.description);

                resolve(transactions);
            },
            error: (error: any) => reject(error),
        });
    });
};

export const generateTransactionHash = (userId: number, t: RawTransaction): string => {
    const data = `${userId}-${t.date}-${t.amount}-${t.description}`;
    return createHash('sha256').update(data).digest('hex');
};
