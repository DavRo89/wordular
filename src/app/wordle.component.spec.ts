import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordleComponent } from './wordle.component';

describe('WordleComponent', () => {
  let component: WordleComponent;
  let fixture: ComponentFixture<WordleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
