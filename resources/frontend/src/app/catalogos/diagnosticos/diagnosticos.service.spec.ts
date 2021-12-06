import { TestBed } from '@angular/core/testing';

import { DiagnosticosService } from './diagnosticos.service';

describe('DiagnosticosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiagnosticosService = TestBed.get(DiagnosticosService);
    expect(service).toBeTruthy();
  });
});
