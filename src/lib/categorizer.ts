export interface Rule {
    keyword: string;
    category: string;
}

const DEFAULT_RULES: Rule[] = [
    { keyword: 'STARBUCKS', category: 'Food & Drink' },
    { keyword: 'UBER', category: 'Transport' },
    { keyword: 'LYFT', category: 'Transport' },
    { keyword: 'NETFLIX', category: 'Entertainment' },
    { keyword: 'SPOTIFY', category: 'Entertainment' },
    { keyword: 'AMAZON', category: 'Shopping' },
    { keyword: 'WALMART', category: 'Shopping' },
    { keyword: 'SHELL', category: 'Transport' },
    { keyword: 'TOTAL', category: 'Transport' },
];

export const categorizeTransaction = (description: string, customRules: Rule[] = []): string => {
    const allRules = [...customRules, ...DEFAULT_RULES];
    const descUpper = description.toUpperCase();

    for (const rule of allRules) {
        if (descUpper.includes(rule.keyword.toUpperCase())) {
            return rule.category;
        }
    }

    return 'Uncategorized';
};
