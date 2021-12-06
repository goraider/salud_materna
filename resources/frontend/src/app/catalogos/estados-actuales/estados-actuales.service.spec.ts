import { TestBed } from '@angular/core/testing';

import { EstadosActualesService } from './estados-actuales.service';

describe('EstadosActualesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EstadosActualesService = TestBed.get(EstadosActualesService);
    expect(service).toBeTruthy();
  });
});
