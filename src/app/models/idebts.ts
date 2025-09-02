export interface IDebts {
  id: string;
  name: string;
  dueDate: Date | null;
  amountDue: number;
  amountPaid: number;
  paidDate: Date | null;
  note: string;
  userId: string;
}
