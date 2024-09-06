import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainMenuScrollService {
  private _scrollPosition = new BehaviorSubject<MainMenuScrollPosittion>({
    x: 0,
    y: 0,
  });

  get scrollPosition(): MainMenuScrollPosittion {
    return this._scrollPosition.value;
  }

  setScrollPosition(position: MainMenuScrollPosittion) {
    this._scrollPosition.next(position);
  }

  get scrollPosition$(): Observable<MainMenuScrollPosittion> {
    return this._scrollPosition.asObservable();
  }
}

type MainMenuScrollPosittion = { x: number; y: number };