import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { User } from '../models/user.model';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { UserModalComponent } from './user-modal/user-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { UsersService } from '../services/users.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../shared/services/auth/auth.service';

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
export class UsersComponent implements OnInit {
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

  users: User[] = [];

  private _allUsers: User[] = [];

  loading: boolean = false;

  dialog = inject(MatDialog);
  usersService = inject(UsersService);
  toastr = inject(ToastrService);
  cdr = inject(ChangeDetectorRef);
  platformId = inject(PLATFORM_ID);
  auth = inject(AuthService);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) this._reloadUsers();
  }

  private _reloadUsers() {
    this.loading = true;
    const toastr = this.toastr;
    this.usersService.fetchUsers().subscribe({
      next: (users) => {
        if (users === undefined) {
          toastr.error("Couldn't get users. Please try again.", undefined, {
            closeButton: true,
            timeOut: 5000,
          });
        } else {
          this._updateUsers(users);
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        toastr.warning("Couldn't get users. Please try again.");
      },
    });
  }

  private _updateUsers(users: User[], pageNumber: number = 1) {
    this._allUsers = users;
    this.users = this._allUsers.slice(pageNumber * 10 - 10, pageNumber * 10);
  }

  openAddUser() {
    const modalRef = this.dialog.open(UserModalComponent);

    const sub = modalRef.afterClosed().subscribe((user) => {
      if (user) {
        this._addUser(user);
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

    const sub = modalRef.afterClosed().subscribe((editedUser : User) => {
      if (editedUser && this._isEditAllowed(editedUser)) {
        this._editUser(editedUser);
        sub.unsubscribe();
      }
    });
  }

  private _isEditAllowed(editedUser : User) {
    if(editedUser.userType === 'owner' && ! editedUser.isActive) {
      this.toastr.warning("You cannot deactivate the owner")
      return false
    } else if (this.auth.user?.userType === 'admin' && editedUser.userType === 'admin' && editedUser._id !== this.auth.user?._id){
      this.toastr.warning("You cannot modify the info of another admin")
      return false
    }

    return true;
    
  }

  private _editUser(user: User) {
    this.loading = true;
    this.usersService.editUser(user).subscribe({
      next: (val) => {
        this.loading = false;
        if (val) {
          this.toastr.success('User updated');
          this._reloadUsers();
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
        if (val) {
          this._updateUsers(val);
        } else if (!val) {
          this.toastr.warning("Couldn't get users. Please try again.");
        }
      },
      error: (_) => {
        this.loading = false;
        this.toastr.error("Couldn't get users. Please try again.");
      },
    });
  }

  onPageNumberChanged(pageNumber: number) {
    this.users = this._allUsers.slice(pageNumber * 10 - 10, pageNumber * 10);
  }
}
