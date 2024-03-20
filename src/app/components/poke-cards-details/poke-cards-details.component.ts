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

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription ? subscription.unsubscribe() : 0);
  }

  getEvolution() {
    if (!this.pokemon.evolutions || !this.pokemon.evolutions.length) {
      this.pokemon.evolutions = [];
      this.subscription = this.pikachAppService.getSpecies(this.pokemon.name).subscribe(response => {
        const id = this.getId(response.evolution_chain.url);
        this.subscription = this.pikachAppService.getEvolution(id).subscribe(response => this.getEvolves(response.chain));
      });
    }
  }

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

  getId(url: string): number {
    const splitUrl = url.split('/')
    return +splitUrl[splitUrl.length - 2];
  }
}
