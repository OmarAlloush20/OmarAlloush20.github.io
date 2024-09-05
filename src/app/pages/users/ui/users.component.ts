import { Component } from '@angular/core';
import { User } from '../models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  tableHeaders: string[] = [
    'First Name',
    'Last Name',
    'Middle Name',
    'Username',
    'Gender',
    'Role',
    'Active',
  ];

  headerToValue = (header: string, user: User): string | undefined => {
    switch (header) {
      case 'First Name':
        return user.firstName;

      case 'Last Name':
        return user.lastName;

      case 'Middle Name':
        return user.middleName;

      case 'Username':
        return user.username;

      case 'Gender':
        return user.gender;

      case 'Role':
        return user.userType;

      case 'Active':
        return user.isActive ? 'Yes' : 'No';
    }

    return undefined;
  };

  users: User[] = [
    {
      _id: '1234567890',
      firstName: 'Shehadeh',
      lastName: 'Mohamed',
      gender: 'male',
      username: 'shehadeh',
      userType: 'employee',
      isActive: true,
    },
    {
      _id: '123456789',
      firstName: 'Omar',
      lastName: 'Mohamed',
      gender: 'male',
      username: 'omar',
      userType: 'admin',
      isActive: false,
    },
    {
      _id: '12345678',
      firstName: 'Hesham',
      lastName: 'Mohamed',
      gender: 'male',
      username: 'hesham',
      userType: 'owner',
      isActive: true,
    },
  ];

  addUser(user: User) {
    if (user) {
      console.log(`adding: ${user.username}`);
    }
  }

  editUser(user: User) {
    if (user) {
      console.log(`editting: ${user.username}`);
    }
  }

  deleteUser(user: User) {
    if (user) {
      console.log(`deleting: ${user.username}`);
    }
  }

  search(query: string) {
    console.log(query);
  }
}
