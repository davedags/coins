import { TestBed, inject } from '@angular/core/testing';

import { CoinDetailService } from './coin-detail.service';

describe('CoinDetailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoinDetailService]
    });
  });

  it('should be created', inject([CoinDetailService], (service: CoinDetailService) => {
    expect(service).toBeTruthy();
  }));
});
