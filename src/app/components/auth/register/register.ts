import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { AuthService } from '../../../services/auth-service';

@Component({

  selector: 'app-register',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private authSvc: AuthService = inject(AuthService);
  private ref: DynamicDialogRef = inject(DynamicDialogRef);

  form!: FormGroup;

  ngOnInit(): void {

    this.form = this.fb.group(
      {
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        email: [
          null,
          {
            validators: [Validators.required, Validators.email],
            updateOn: 'blur',
          },
        ],
        password: [
          null,
          {
            validators: [
              Validators.required,
              Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/),
            ],
            updateOn: 'blur',
          },
        ],
        confirmPassword: [
          null,
          {
            validators: [
              Validators.required,
              Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/),
            ],
            updateOn: 'blur',
          },
        ],
      },
      { validator: this.MatchingPasswords }
    );
  }

  MatchingPasswords(c: AbstractControl) {
    let pwd = c.get('password');
    let cpwd = c.get('confirmPassword');

    return pwd.value === cpwd.value ? null : { not_matching: true };
  }

  createAccount() {
    this.authSvc.createUser(this.form.getRawValue());

    setTimeout(() => {
      this.ref.close();
    }, 2000);
  }

  close() {
    this.ref.close();
  }
}
