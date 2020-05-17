import { TestBed } from '@angular/core/testing';

import { ConjureService } from './conjure.service';

describe('ConjureService', () => {
  let service: ConjureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConjureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
