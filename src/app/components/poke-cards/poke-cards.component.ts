import { Component, OnDestroy, OnInit } from '@angular/core';
import { PikachAppService } from '../../pikach-app.service';
import { Subscription, concat } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-poke-cards',
  standalone: true,
  imports: [RouterModule,CommonModule,NavBarComponent],
  templateUrl: './poke-cards.component.html',
  styleUrl: './poke-cards.component.scss'
})
export class PokeCardsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[]=[];
  loading: boolean=false;

  constructor(private pikachAppService : PikachAppService)
  {

  }

  get pokemons(): any[] {
    return this.pikachAppService.pokemons;
  }

  set subscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnInit(): void {
    if (!this.pokemons.length) {
      this.loadMore();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription ? subscription.unsubscribe() : 0);
  }

  loadMore(): void {
    this.loading = true;
    this.subscription = this.pikachAppService.getNext().subscribe(response => {
      this.pikachAppService.next = response.next;
      const details = response.results.map((i: any) => this.pikachAppService.get(i.name));
      this.subscription = concat(...details).subscribe((response: any) => {
        this.pikachAppService.pokemons.push(response);
      });
    }, error => console.log('Error Occurred:', error), () => this.loading = false);
  }

  getType(pokemon: any): string {
    return this.pikachAppService.getType(pokemon);
  }
}
