import {Injectable} from '@angular/core';
import { Player } from './player';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class InjectService {
    public players: BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>([]);
    public started: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public reseted: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public helperIndex: BehaviorSubject<number> = new BehaviorSubject<number>(1);

    constructor(){

    }
    public setPlayers(newPlayers: Player[]){
        this.players.next(newPlayers);
    }

    public setStarted(started: boolean){
      this.started.next(started);
    }

    public setReseted(started: boolean){
      this.reseted.next(started);
    }

    public reduceHelperIndexByOne(){
      let val = this.helperIndex.value;
      this.helperIndex.next(val--);
    }

    public setHelperIndex(val: number){
      this.helperIndex.next(val);
    }
  }