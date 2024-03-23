import { Component, OnDestroy, OnInit } from '@angular/core';
import { PikachAppService } from '../../pikach-app.service';
import { Subscription, concat } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-poke-cards',
  standalone: true,
  imports: [RouterModule, CommonModule, NavBarComponent],
  templateUrl: './poke-cards.component.html',
  styleUrl: './poke-cards.component.scss'
})
export class PokeCardsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  loading: boolean = false;

  constructor(private pikachAppService: PikachAppService) {

  }

  get pokemons(): any[] {
    return this.pikachAppService.pokemons;
  }

  set subscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnInit(): void {
    if (!this.pokemons.length) { // to reduce no. of hit to trigger to data is already there
      this.loadMore();
    }

  }

// to load pokemon list
  loadMore(): void {
    this.loading = true;
    this.subscription = this.pikachAppService.getNext().subscribe(
      (response: any) => {
        // Update next URL for subsequent loads
        this.pikachAppService.next = response.next;

        // Fetch details for each Pokemon in the current response
        const details = response.results.map((pokemon: any) => this.pikachAppService.get(pokemon.name));

        // Concatenate observables to fetch details sequentially
        this.subscription = concat(...details).subscribe(
          (pokemonDetails: any) => {
            // Push fetched Pokemon details to the array
            this.pikachAppService.pokemons.push(pokemonDetails);
          },
          (error: any) => {
            console.error('Error loading Pokemon details:', error);
          },
          () => {
            // Loading is complete
            this.loading = false;
          }
        );
      },
      (error: any) => {
        console.error('Error loading Pokemon list:', error);
        this.loading = false;
      }
    );
  }


  getType(pokemon: any): string {
    return this.pikachAppService.getType(pokemon);
  }

  // Clean up subscription
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription ? subscription.unsubscribe() : 0);
  }

}
