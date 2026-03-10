import { Component, signal, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/auth/auth.service';
import { getAuthMode } from '../../../core/auth/auth-mode';


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
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loading = signal(false);
  error = signal<string | null>(null);
  showPassword = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  submit() {
    if (this.loginForm.invalid) return;

    if (getAuthMode() === 'bypass') {
      this.auth.bypass(this.loginForm.value.email ?? 'demo@example.com');
      void this.router.navigateByUrl('/dashboard');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const email = this.loginForm.value.email ?? '';
    const password = this.loginForm.value.password ?? '';
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';

    this.auth
      .login(email, password)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => void this.router.navigateByUrl(returnUrl),
        error: (e: unknown) =>
          this.error.set(e instanceof Error ? e.message : 'Login failed. Please try again.'),
      });
  }
}
