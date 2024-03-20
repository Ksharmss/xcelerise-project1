import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from './environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PikachAppService {

  constructor(private http:HttpClient) { }


  private url: string = Environment.apiUrl + 'pokemon/';
  private _pokemons: any[] = [];
  private _next: string = '';


  get pokemons(): any[] {
    return this._pokemons;
  }
  
  get next(): string {
    return this._next;
  }

  set next(next: string) {
    this._next = next;
  }

  getType(pokemon: any): string {
    return pokemon && pokemon.types.length > 0 ? pokemon.types[0].type.name : '';
  }

  get(name: string) {
    const url = `${this.url}${name}`;
    return this.http.get<any>(url);
  }

  getNext(){
    const url = this.next === '' ? `${this.url}?limit=100` : this.next;
    return this.http.get<any>(url);
  }

  getEvolution(id: number){
    const url = `${Environment.apiUrl}evolution-chain/${id}`;
    return this.http.get<any>(url);
  }

  getSpecies(name: string) {
    const url = `${Environment.apiUrl}pokemon-species/${name}`;
    return this.http.get<any>(url);
  }
}
