import { TestBed } from '@angular/core/testing';

import { UsernamesStorageService } from './usernames-storage.service';

describe('UsernamesStorageService', () => {
  let service: UsernamesStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsernamesStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
