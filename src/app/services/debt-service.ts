import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { collection, collectionGroup, doc, Firestore, getDocs, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

import { IDebts } from '../models/idebts';
import { AuthService } from './auth-service';
import { ISummary } from '../models/isummary';
@Injectable({
  providedIn: 'root'
})
export class DebtService {
  #firestore: Firestore = inject(Firestore);
  #injector: Injector = inject(Injector);
  authSvc: AuthService = inject(AuthService);

  private categories = new BehaviorSubject<string[]>([]);
  categories$ = this.categories.asObservable();

  private debts = new BehaviorSubject<IDebts[]>([]);
  debts$ = this.debts.asObservable();

  private summary = new BehaviorSubject<ISummary[]>([]);
  summary$ = this.summary.asObservable();

  userId: string;

  async getCategories() {
    const collRef = collection(this.#firestore, 'categories');
    const descriptions = [];

    await runInInjectionContext(this.#injector, async () => {
      const q = await getDocs(collRef);

      q.forEach(doc => descriptions.push(doc.data()['description']));

      this.setCategories(descriptions);
    })
  }

  setCategories(categories: string[]) {
    this.categories.next(categories);
  }

  async getDebts(year: number, month: string) {
    this.userId = this.authSvc.userId;
    const defaultPath = `users/${this.userId}/year/${year}/month/${month}/expenses`;
    const debts: IDebts[] = [];

    const collRef = collection(this.#firestore, defaultPath);
    const q = query(collRef, orderBy('dueDate'));

    await runInInjectionContext(this.#injector, async () => {
      const snapshot = await getDocs(q);

      snapshot.forEach((doc) => {
        const debt = {
          id: doc.id,
          name: doc.data()['name'],
          dueDate: doc.data()['dueDate'],
          amountDue: doc.data()['amountDue'],
          amountPaid: doc.data()['amountPaid'],
          paidDate: doc.data()['paidDate'],
          note: doc.data()['note'],
          userId: doc.data()['userId']
        };

        debts.push(debt);
      });
    });

    this.setDebts(debts);
  }

  setDebts(debts: IDebts[]) {
    this.debts.next(debts);
  }

  async saveDebts(debt: IDebts, year: number, month: string) {
    const defaultPath = `users/${this.userId}/year/${year}/month/${month}/expenses`;
    const collRef = collection(this.#firestore, defaultPath);
    const newDoc = doc(collRef);
    const docId = newDoc.id;

    if (docId) {
      debt.id = docId;
    }

    await setDoc(newDoc, debt);

    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    if (month !== currentMonth) {
      this.getDebts(year, currentMonth);
    } else {
      this.getDebts(year, month);
    }
  }

  async updateDebts(debt: IDebts, year: number, month: string) {
    const defaultPath = `users/${this.userId}/year/${year}/month/${month}/expenses`;
    const docRef = doc(this.#firestore, defaultPath, debt.id);

    await updateDoc(docRef, { ...debt });
  }

  setSummary(summary: ISummary[]) {
    this.summary.next(summary);
  }

  async getSummary() {
    const summary: ISummary[] = []

    await runInInjectionContext(this.#injector, async () => {
      const q = query(collectionGroup(this.#firestore, 'expenses'), where("userId", "==", this.userId));
      const snapshot = await getDocs(q);

      snapshot.forEach(sum => {
        const debt: ISummary = {
          name: sum.data()['name'],
          amount: sum.data()['amountPaid'],
          userId: sum.data()['userId']
        };

        summary.push(debt);
      });
    });

    this.setSummary(summary);
  }
}
