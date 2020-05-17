import { TestBed } from '@angular/core/testing';

import { BottomPopService } from './bottom-pop.service';

describe('BottomPopService', () => {
  let service: BottomPopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BottomPopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
