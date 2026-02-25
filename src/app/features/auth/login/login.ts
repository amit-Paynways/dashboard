import { Component, signal, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule 
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class LoginComponent {

  private fb = inject(FormBuilder); // available immediately

  loading = signal(false);
  showPassword = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  submit() {
    if (this.loginForm.invalid) return;

    this.loading.set(true);

    console.log(this.loginForm.value);

    setTimeout(() => {
      this.loading.set(false);
      alert("Fake login success!");
    }, 1200);
  }
}
