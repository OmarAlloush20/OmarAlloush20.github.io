import { Component } from '@angular/core';
import { User } from '../models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  users: User[] = [
    {
      _id: '1234567890',
      firstName: 'Shehadeh',
      lastName: 'Mohamed',
      gender: 'male',
      username: 'shehadeh',
      userType: 'employee',
      isActive: true
    },
    {
      _id: '123456789',
      firstName: 'Omar',
      lastName: 'Mohamed',
      gender: 'male',
      username: 'omar',
      userType: 'admin',
      isActive: false
    },
    {
      _id: '12345678',
      firstName: 'Hesham',
      lastName: 'Mohamed',
      gender: 'male',
      username: 'hesham',
      userType: 'owner',
      isActive: true
    },
  ];


  selectedUser? : User;

  searchQuery : string = '';

  setSelectedUser(user? : User) {
    this.selectedUser = user;
  }

  addUser(user? : User) {
    if(user) {
      
    }
  }
  
  editUser(user? : User) {
    if(user) {
      
    }
  }

  deleteUser(user? : User) {
    if(user) {
      
    }
  }

  toggleUserActivation(user? : User) {
    if(user) {
      
    }
  }

  search(query : string) {
    if(query) {
      console.log(query);
    }
  }
}
