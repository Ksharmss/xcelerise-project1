import { TestBed } from '@angular/core/testing';

import { PikachAppService } from './pikach-app.service';

describe('PikachAppService', () => {
  let service: PikachAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PikachAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
