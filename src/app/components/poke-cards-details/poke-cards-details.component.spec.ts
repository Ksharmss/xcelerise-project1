import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokeCardsDetailsComponent } from './poke-cards-details.component';

describe('PokeCardsDetailsComponent', () => {
  let component: PokeCardsDetailsComponent;
  let fixture: ComponentFixture<PokeCardsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokeCardsDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PokeCardsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
