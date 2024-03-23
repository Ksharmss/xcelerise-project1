import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from './environment/environment';




@Injectable({
  providedIn: 'root'
})
export class PikachAppService {

  constructor(private http:HttpClient) { }
  private url: string = environment.apiUrl + 'pokemon/';
  private _pokemons: any[] = [];
  private _next: string = '';
  private evolutionCache: { [id: number]: Observable<any> } = {};
  private speciesCache: { [name: string]: Observable<any> } = {};

 /**
   * Retrieves the list of Pokemon.
   * @returns The list of Pokemon.
   */
  get pokemons(): any[] {
    return this._pokemons;
  }
  
   /**
   * Retrieves the next URL for fetching more Pokemon.
   * @returns The next URL for fetching more Pokemon.
   */
  get next(): string {
    return this._next;
  }


   /**
   * Sets the next URL for fetching more Pokemon.
   * @param next The next URL for fetching more Pokemon.
   */
  set next(next: string) {
    this._next = next;
  }


   /**
   * Retrieves the type of a Pokemon.
   * @param pokemon The Pokemon object.
   * @returns The type of the Pokemon.
   */
  getType(pokemon: any): string {
    return pokemon && pokemon.types.length > 0 ? pokemon.types[0].type.name : '';
  }


   /**
   * Retrieves details of a specific Pokemon.
   * @param name The name of the Pokemon.
   * @returns Observable of the Pokemon details.
   */
  get(name: string) {
    const url = `${this.url}${name}`;
    return this.http.get<any>(url);
  }


  /**
   * Retrieves the next set of Pokemon.
   * @returns Observable of the next set of Pokemon.
   */
  getNext(){ 
    const url = this.next === '' ? `${this.url}?limit=100` : this.next; 
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }


  /**
   * Retrieves the evolution chain of a Pokemon.
   * @param id The ID of the Pokemon evolution chain.
   * @returns Observable of the Pokemon evolution chain.
   */
  getEvolution(id: number): Observable<any> {
    if (this.evolutionCache[id]) {
      return this.evolutionCache[id];
    } else {
      const url = `${environment.apiUrl}evolution-chain/${id}`;
      const evolution = this.http.get(url).pipe(
        catchError(this.handleError),
        map(data => {
          this.evolutionCache[id] = of(data);
          return data;
        })
      );
      this.evolutionCache[id] = evolution;
      return evolution;
    }
  }

   /**
   * Retrieves the species of a Pokemon.
   * @param name The name of the Pokemon species.
   * @returns Observable of the Pokemon species.
   */
   getSpecies(name: string): Observable<any> {
    if (this.speciesCache[name]) {
      return this.speciesCache[name];
    } else {
      const url = `${environment.apiUrl}pokemon-species/${name}`;
      const species = this.http.get(url).pipe(
        catchError(this.handleError),
        map(data => {
          this.speciesCache[name] = of(data);
          return data;
        })
      );
      this.speciesCache[name] = species;
      return species;
    }
  }

  /**
   * Handles HTTP errors.
   * @param error The HTTP error response.
   * @returns Observable with the error message.
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {   
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 404) {
        errorMessage = 'Pokemon not found';
      } else if (error.status === 500) {
        errorMessage = 'Internal server error';
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    alert(errorMessage)
    return throwError(() => new Error(errorMessage)); 
  }

}
