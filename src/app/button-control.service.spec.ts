import { TestBed } from '@angular/core/testing';

import { ButtonControlService } from './button-control.service';

describe('ButtonControlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ButtonControlService = TestBed.get(ButtonControlService);
    expect(service).toBeTruthy();
  });
});
