import { Component, inject } from '@angular/core';
import { User } from '../models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { UserModalComponent } from './user-modal/user-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { map } from 'rxjs';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { UsersService } from '../services/users.service';
import { ToastrService } from 'ngx-toastr';
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

  loading: boolean = false;

  dialog = inject(MatDialog);
  usersService = inject(UsersService);
  toastr = inject(ToastrService);

  private _reloadUsers() {}

  openAddUser() {
    const modalRef = this.dialog.open(UserModalComponent);

    const sub = modalRef.afterClosed().subscribe((user) => {
      if (user) {
        this._addUser(user);
        sub.unsubscribe();
      }
    });
  }

  private _addUser(user: User) {
    this.loading = true;
    this.loading = false;
  }

  openEditUser(user: User) {
    const modalRef = this.dialog.open(UserModalComponent);
    modalRef.componentInstance.user = user;

    const sub = modalRef.afterClosed().subscribe((editedUser) => {
      if (editedUser) {
        this._editUser(editedUser);
        sub.unsubscribe();
      }
    });
  }

  private _editUser(user: User) {
    this.loading = true;
    this.usersService.editUser(user._id, user).subscribe({
      next: (val) => {
        this.loading = false;
        if (val) {
          this.toastr.success('User updated');
        } else {
          this.toastr.warning("Couldn't update user. Please try again.");
        }
      },
      error: (_) => {
        this.loading = false;
        this.toastr.error("Couldn't update user. Please try again.");
      },
    });
  }

  openDeleteUser(user: User) {
    const modalRef = this.dialog.open(ConfirmDialogComponent);

    const sub = modalRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this._deleteUser(user);
        sub.unsubscribe();
      }
    });
  }

  private _deleteUser(user: User) {
    this.loading = true;
    this.usersService.deleteUser(user._id).subscribe({
      next: (val) => {
        this.loading = false;
        if (val) {
          this.toastr.success('User deleted');
        } else {
          this.toastr.warning("Couldn't delete user. Please try again.");
        }
      },
      error: (_) => {
        this.loading = false;
        this.toastr.error("Couldn't delete user. Please try again.");
      },
    });
  }

  search(query: string) {
    this.usersService.fetchUsers(query).subscribe({
      next: (val) => {
        this.loading = false;
        if (!val) {
          this.toastr.warning("Couldn't get users. Please try again.");
        }
      },
      error: (_) => {
        this.loading = false;
        this.toastr.error("Couldn't get users. Please try again.");
      },
    });
  }
}
