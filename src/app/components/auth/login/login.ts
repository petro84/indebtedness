import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ThemeSwitcher } from '../../shared/theme-switcher/theme-switcher';
import { AuthService } from '../../../services/auth-service';
import { Register } from '../register/register';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, ThemeSwitcher],
  templateUrl: './login.html',
  styleUrl: './login.css',
  providers: [DialogService]
})
export class Login implements OnInit {
  fb: FormBuilder = inject(FormBuilder);
  authSvc: AuthService = inject(AuthService);
  dialogSvc: DialogService = inject(DialogService);

  loginForm!: FormGroup;
  ref!: DynamicDialogRef;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.authSvc.emailLogin(this.loginForm.getRawValue());
  }

  googleLogin() {
    this.authSvc.googleLogin();
  }

  showRegister() {
    this.ref = this.dialogSvc.open(Register, {
      header: 'Register',
      width: '25vw',
      modal: true,
      contentStyle: { overflow: 'auto' },
      closeOnEscape: true,
      dismissableMask: true,
      closable: true
    });
  }
}
