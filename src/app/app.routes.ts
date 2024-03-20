import { Routes } from '@angular/router';
import { PokeCardsComponent } from './components/poke-cards/poke-cards.component';
import { PokeCardsDetailsComponent } from './components/poke-cards-details/poke-cards-details.component';

export const routes: Routes = [
    { path: '', component: PokeCardsComponent },
    { path: 'view/:name', component: PokeCardsDetailsComponent },
    { path: '**', component: PokeCardsComponent }
  ];
