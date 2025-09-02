import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { providePrimeNG } from 'primeng/config';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { routes } from './app.routes';
import CustomTheme from './customeTheme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: CustomTheme,
        options: {
          name: 'primeng',
          order: 'tailwind-base, primeng, tailwind-utilities',
          darkModeSelector: '.p-dark',
        },
      },
    }),
    provideFirebaseApp(() =>
      initializeApp({

      })
    ),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideAuth(() => getAuth()),
  ],
};
