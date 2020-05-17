import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeforeAddComponent } from './before-add.component';

describe('BeforeAddComponent', () => {
  let component: BeforeAddComponent;
  let fixture: ComponentFixture<BeforeAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeforeAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeforeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
