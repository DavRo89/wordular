import { TestBed } from '@angular/core/testing';

import { DataStatService } from './data-stat.service';

describe('DataStatService', () => {
  let service: DataStatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataStatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
