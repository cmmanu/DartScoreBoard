import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Player } from '../player';
import { InjectService } from '../inject.service';
import { compileInjectable } from '@angular/compiler';


@Component({
  selector: 'app-darters',
  templateUrl: './darters.component.html',
  styleUrls: ['./darters.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class DartersComponent implements OnInit {

  isEditEnable : boolean = true; // to show and hide the input text
  players: Array<Player> = [];
  playerName: string = "";
  show: boolean = false;
  showOnStart:boolean = true;
  index: number = 1;
  

  constructor(private injectService : InjectService) { 
    this.injectService.players.subscribe( value => {
      this.players = value;
      this.ngOnInit();
    })
  }

  ngOnInit(): void {
  }

  onAdd(){
    this.isEditEnable = !this.isEditEnable;
    this.show = !this.show;  
  }

  addPlayer(name:string){
    // Reset flags
    this.isEditEnable = !this.isEditEnable;
    this.show = !this.show;

    // Create new Player object
    let playerObj: Player = new Player();
    playerObj.name = name;
    playerObj.remaining = 501;
    playerObj.average = 0;
    playerObj.index = this.index;
    this.index++;
    this.players.push(playerObj);
    this.injectService.setPlayers(this.players);

    // Reset the player name for the next entry
    this.playerName = "";
  }

  onKeydown(event: any){
    if (event.key === "Enter") {
      this.addPlayer(event.target.value);
    }
  }
  public getPlayers(){
    return this.players;
  }

  public startGame(){
    this.injectService.setStarted(true);
    this.showOnStart = !this.showOnStart;
  }

  public resetGame(){
    let index = 1;
    for(let player of this.players)
    {
      player.score1 = "";
      player.score2 = "";
      player.score3 = "";
      player.round = 0;
      player.index = index;
      index++;
      player.round = 0;
      player.currentScoreNumber = 1;
      player.throwsCount = 1;
      player.thrownPoints = 0;
      player.winnerPlace = 0;
      player.remaining = 501;
      player.average = 0;
    }
    this.injectService.setPlayers(this.players);
    this.injectService.setReseted(true);
  }

  public isThereAWinner()
  {
    for(let player of this.players)
    {
      if(player.winnerPlace > 0)
      {
        return true;
      }
    }
    return false;
  }

  public getScoreTableClass(player: Player)
  {
     if(this.showOnStart)
     {
       return "scoreTable";
     }

    let minRound = 99999;
    let searchIndex = 1;
    for(let playerObj of this.players)
    {
      if(playerObj.winnerPlace > 0)
      {
        continue;
      }
      if(playerObj.round < minRound)
      {
        minRound = playerObj.round;
        searchIndex = playerObj.index;
      }
    }

    if(player.index == searchIndex)
    {
      return "scoreTableSelected"
    }
    return "scoreTable";
  }

  public hasPlayerAScore()
  {
    for(let playerObj of this.players)
    {
      if(!this.showOnStart)
      {
        return true;
      }
    }
    return false;
  }

  public deleteLastScore()
  {
    let minRound = 99999;
    let searchIndex = 1;
    let helperPlayer: Player = new Player;
    for(let playerObj of this.players)
    {
      if(playerObj.winnerPlace > 0)
      {
        continue;
      }
      if(playerObj.round < minRound && playerObj.score1 != "")
      {
        minRound = playerObj.round;
        helperPlayer = playerObj;
      }
    }
    if(helperPlayer.index == 0)
    {
      return;
    }
    else
    {
      helperPlayer.round = helperPlayer.round != 0 ? helperPlayer.round - 1 : 0;
      this.injectService.setHelperIndex(helperPlayer.index);
    }

    let highestPlayerNumber = 1;

    for(let playerObj of this.players)
    {
      if(playerObj.winnerPlace > 0)
      {
        continue;
      }
      if(playerObj.index > highestPlayerNumber)
      {
        highestPlayerNumber = playerObj.index;
      }
    }

   
    // reset the last score
    if(helperPlayer.score3 != "")
    {
      helperPlayer.remaining = helperPlayer.remaining + Number(helperPlayer.score3);
      helperPlayer.thrownPoints -= Number(helperPlayer.score3);
      helperPlayer.currentScoreNumber = 2;
      helperPlayer.score3 = "";
    }
    else if (helperPlayer.score2 != "")
    {
      helperPlayer.remaining = helperPlayer.remaining + Number(helperPlayer.score2);
      helperPlayer.thrownPoints -= Number(helperPlayer.score2);
      helperPlayer.currentScoreNumber = 1;
      helperPlayer.score2 = "";
    }
    else if (helperPlayer.score1 != "")
    {
      helperPlayer.remaining = helperPlayer.remaining + Number(helperPlayer.score1);
      helperPlayer.thrownPoints -= Number(helperPlayer.score1);
      helperPlayer.score1 = "";
      if(helperPlayer.round != 0)
      {
        helperPlayer.index = highestPlayerNumber;
      }
    }

    //calculate average
    helperPlayer.throwsCount = helperPlayer.throwsCount - 1;
    helperPlayer.average = Number((Math.round((helperPlayer.thrownPoints / helperPlayer.throwsCount) * 100) / 100).toFixed(2));
    helperPlayer.throwsCount++;

    // save modified player in List
    for(let playerObj of this.players)
    {
      if(playerObj.winnerPlace > 0)
      {
        continue;
      }
      if(playerObj.index == helperPlayer.index)
      {
        playerObj = helperPlayer;
      }
    }


  }
  
  

}
