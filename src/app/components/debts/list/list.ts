import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';

import { IDebts } from '../../../models/idebts';
import { AuthService } from '../../../services/auth-service';
import { DebtService } from '../../../services/debt-service';

@Component({
  selector: 'app-list',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule,
    SelectModule,
    FloatLabel,
  ],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  @ViewChild('debtList')
  debtTable: Table;

  debts: IDebts[] = [];
  categories: string[] = [];
  clonedDebt: { [s: string]: IDebts } = {};
  filteredMonth!: Date;

  authSvc: AuthService = inject(AuthService);
  debtSvc: DebtService = inject(DebtService);

  get currentYear() {
    return new Date().getFullYear();
  }

  get currentMonth() {
    return new Date().toLocaleString('default', { month: 'long' });
  }

  constructor() {
    this.debtSvc.getCategories();
    this.debtSvc.debts$.subscribe((debts) => (this.debts = debts));
    this.debtSvc.getDebts(this.currentYear, this.currentMonth);
  }

  addNewDebt() {
    const debt: IDebts = {
      id: null,
      name: '',
      dueDate: null,
      amountDue: null,
      paidDate: null,
      amountPaid: null,
      note: '',
      userId: this.authSvc.userId,
    };

    this.debts.push(debt);
    this.debtTable.initRowEdit(debt);
  }

  filterByMonth() {
    const date = new Date(this.filteredMonth);
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });

    this.debtSvc.getDebts(year, month);
  }

  currentMonthDebts() {
    this.filteredMonth = null;

    const date = new Date();
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });

    this.debtSvc.getDebts(year, month);
  }

  onRowEdit(debt: IDebts) {
    this.clonedDebt[debt.id] = { ...debt };
  }

  onRowSave(debt: IDebts) {
    const year = new Date(debt.dueDate).getFullYear();
    const month = new Date(debt.dueDate).toLocaleString('default', { month: 'long' });

    if (debt.id === null) {
      this.debtSvc.saveDebts(debt, year, month).then(() => this.debtSvc.getSummary());
    } else {
      this.debtSvc.updateDebts(debt, year, month).then(() => this.debtSvc.getSummary());
    }
  }

  onRowCancel(debt: IDebts, index: number) {
    this.debts[index] = this.clonedDebt[debt.id];
    delete this.clonedDebt[debt.id];
  }
}
