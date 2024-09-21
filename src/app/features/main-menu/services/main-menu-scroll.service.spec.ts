import { TestBed } from '@angular/core/testing';

import { MainMenuScrollService } from './main-menu-scroll.service';

describe('MainMenuScrollService', () => {
  let service: MainMenuScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainMenuScrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
