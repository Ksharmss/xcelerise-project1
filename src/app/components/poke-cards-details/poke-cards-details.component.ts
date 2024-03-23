import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { PikachAppService } from '../../pikach-app.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { NavBarComponent } from '../nav-bar/nav-bar.component';


@Component({
  selector: 'app-poke-cards-details',
  standalone: true,
  imports: [RouterModule,CommonModule,TabViewModule,NavBarComponent],
  templateUrl: './poke-cards-details.component.html',
  styleUrl: './poke-cards-details.component.scss'
})
export class PokeCardsDetailsComponent {
  pokemon: any = null;

  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private pikachAppService: PikachAppService) { }

  set subscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

     // Initialize component
  ngOnInit(): void {
    this.subscription = this.route.params.subscribe(params => {

      if (this.pikachAppService.pokemons.length) {
        this.pokemon = this.pikachAppService.pokemons.find(i => i.name === params['name']);
        if (this.pokemon) {
          this.getEvolution();
          return;
        }
      }

      this.subscription = this.pikachAppService.get(params['name']).subscribe(response => {
        this.pokemon = response;
        this.getEvolution();
      }, error => console.log('Error Occurred:', error));
    });
  }

// Clean up subscription
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription ? subscription.unsubscribe() : 0);
  }


  /**
 * Fetches evolution details for the current Pokemon if not already retrieved.
 * If the evolution details are not present, it retrieves the species information first,
 * then fetches the evolution chain based on the species data.
 * @returns Void.
 */
getEvolution(): void {
  // Check if the evolution details are not already present for the current Pokemon
  if (!this.pokemon.evolutions || !this.pokemon.evolutions.length) {
    // Initialize the evolution details array
    this.pokemon.evolutions = [];
    // Subscribe to the getSpecies method to retrieve species information
    this.subscription = this.pikachAppService.getSpecies(this.pokemon.name).subscribe(
      // Successful response handler for getSpecies method
      (response: any) => {
        // Extract the evolution chain ID from the species data URL
        const id = this.getId(response.evolution_chain.url);
        // Subscribe to the getEvolution method to retrieve evolution chain details
        this.subscription = this.pikachAppService.getEvolution(id).subscribe(
          // Successful response handler for getEvolution method
          (response: any) => {
            // Process and populate the evolution details array
            this.getEvolves(response.chain);
          },
          // Error handler for getEvolution method
          (error: any) => {
            console.error('Error fetching evolution:', error);

          }
        );
      },
      // Error handler for getSpecies method
      (error: any) => {
        console.error('Error fetching species:', error);
      }
    );
  }
}




 // Process evolution chain and update this.pokemon.evolutions
  getEvolves(chain: any) {
    this.pokemon.evolutions.push({
      id: this.getId(chain.species.url),
      name: chain.species.name
    });

    if (chain.evolves_to.length) {
      this.getEvolves(chain.evolves_to[0]);
    }
  }

  getType(pokemon: any): string {
    return this.pikachAppService.getType(pokemon);
  }

 // Implement logic to extract ID from URL
  getId(url: string): number {
    const splitUrl = url.split('/')
    return +splitUrl[splitUrl.length - 2];
  }
}
