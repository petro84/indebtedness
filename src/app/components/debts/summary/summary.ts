import { Component, inject, OnInit } from '@angular/core';
import { DebtService } from '../../../services/debt-service';
import { IDebts } from '../../../models/idebts';
import { ISummary } from '../../../models/isummary';
import { Card } from './card/card';

@Component({
  selector: 'app-summary',
  imports: [Card],
  templateUrl: './summary.html',
  styleUrl: './summary.css',
})
export class Summary implements OnInit {
  private debtsSvc: DebtService = inject(DebtService);

  debts: IDebts[] = [];
  summary: ISummary[] = [];

  get totalMortgage() {
    return this.summary
      .map((sum) => (sum.name === 'Mortgage' ? sum.amount : 0))
      .reduce((acc, debt) => {
        return acc + Number(debt);
      }, 0);
  }

  get totalAuto() {
    return this.summary
      .map((sum) => (sum.name === 'Auto' ? sum.amount : 0))
      .reduce((acc, debt) => {
        return acc + Number(debt);
      }, 0);
  }

  get totalCreditCard() {
    return this.summary
      .map((sum) => (sum.name === 'Credit Card' ? sum.amount : 0))
      .reduce((acc, debt) => {
        return acc + Number(debt);
      }, 0);
  }

  get totalMonthlyDebts() {
    return this.debts.reduce((acc, debts) => {
      return acc + Number(debts.amountPaid);
    }, 0);
  }

  ngOnInit(): void {
    this.debtsSvc.debts$.subscribe((debts) => (this.debts = debts));
    this.debtsSvc.summary$.subscribe((sum) => (this.summary = sum));

    this.debtsSvc.getSummary();
  }
}
