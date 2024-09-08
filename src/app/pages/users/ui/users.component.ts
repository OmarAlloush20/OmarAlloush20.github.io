import { Component } from '@angular/core';
import { User } from '../models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { UserModalComponent } from './user-modal/user-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { map } from 'rxjs';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataTableComponent,
    UserModalComponent,
    MatDialogModule,
  ],
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

  constructor(private dialog : MatDialog) {}

  addUser() {
      const modalRef = this.dialog.open(UserModalComponent);
      
      modalRef.afterClosed().pipe(map((val) => {
        console.log(val);
      }))
  }

  editUser(user: User) {
    const modalRef = this.dialog.open(UserModalComponent);
    modalRef.componentInstance.user = user;
      
    modalRef.afterClosed().pipe(map((val) => {
      console.log(val);
    }))
  }

  deleteUser(user: User) {
    const modalRef = this.dialog.open(ConfirmDialogComponent);
      
    modalRef.afterClosed().pipe(map((val) => {
      console.log(val);
    }))
  }

  search(query: string) {
    console.log(query);
  }
}
