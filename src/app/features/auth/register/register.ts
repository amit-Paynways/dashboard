import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    RouterModule 
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

}
