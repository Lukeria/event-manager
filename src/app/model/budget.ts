export interface Budget {
    id: number;
    expectedAmount: number;
    plannedAmount: number;
    paidAmount: number;
    budgetCategoryList: BudgetCategory[];
}

export interface BudgetCategory {
    id: number;
    name: string;
    description: string;
    plannedAmount: number;
    paidAmount: number;
    paymentList: Payment[];
}

export interface Payment {
    id: number;
    expenseName: string;
    description: string;
    amount: number;
    budgetCategoryId: number;
}