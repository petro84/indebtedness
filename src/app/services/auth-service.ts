import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { IUser } from '../models/iuser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #auth: Auth = inject(Auth);
  #firestore: Firestore = inject(Firestore);
  #injector: Injector = inject(Injector);
  router: Router = inject(Router);

  userData: any;

  constructor() {
    onAuthStateChanged(this.#auth, async (user: any) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.setItem('user', null);
        JSON.stringify(localStorage.getItem('user'));
      }
    });
  }

  get userId() {
    const token = localStorage.getItem('user');
    const user = JSON.parse(token as string);
    return user.uid;
  }

  get displayName() {
    const user = this.#auth.currentUser;
    if (user) {
      const names = user.displayName.split(' ');
      return names[0];
    }
    return '';
  }

  async createUser(user: IUser) {
    await runInInjectionContext(this.#injector, async () => {
      const newUser = await createUserWithEmailAndPassword(this.#auth, user.email, user.password);
      const userCred = newUser.user;

      await updateProfile(userCred, {
        displayName: user.firstName + ' ' + user.lastName,
      });

      await setDoc(doc(this.#firestore, 'users', userCred.uid), {});
    });
  }

  async emailLogin(user: IUser) {
    await runInInjectionContext(this.#injector, async () => {
      await signInWithEmailAndPassword(this.#auth, user.email, user.password).then(() =>
        this.router.navigate(['dashboard'])
      );
    });
  }

  async googleLogin() {
    await runInInjectionContext(this.#injector, async () => {
      await signInWithPopup(this.#auth, new GoogleAuthProvider()).then(() =>
        this.router.navigate(['dashboard'])
      );
    });
  }

  logout() {
    signOut(this.#auth).then(() => this.router.navigate(['login']));
  }
}
