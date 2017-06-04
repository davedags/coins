import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertorComponent } from './convertor.component';

describe('ConvertorComponent', () => {
  let component: ConvertorComponent;
  let fixture: ComponentFixture<ConvertorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
