import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrosDetailComponent } from './libros-detail.component';

describe('LibrosDetailComponent', () => {
  let component: LibrosDetailComponent;
  let fixture: ComponentFixture<LibrosDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibrosDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibrosDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
