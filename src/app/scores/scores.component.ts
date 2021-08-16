import { computeMsgId } from '@angular/compiler';
import { trimTrailingNulls } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { InjectService } from '../inject.service';
import { Player } from '../player';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ScoresComponent implements OnInit {

  helperIndex: number = 1;
  started: boolean = false;
  reseted: boolean = false;
  double: boolean = false;
  triple: boolean = false;
  winnerNumber: number = 1;
  audio = new Audio();
  audio2 = new Audio();
  resetNextPlayer: Boolean = false;

  constructor(private injectService: InjectService) { 
    this.injectService.started.subscribe( value => {
      this.started = value;
    })
    this.injectService.reseted.subscribe( value => {
      this.reseted = value;
      this.helperIndex = 1;
      this.winnerNumber = 1;
    })
    this.injectService.helperIndex.subscribe(value =>{
      this.helperIndex = value;
    })
  }

  ngOnInit(): void {
    this.audio.src = "./assets/sounds/button_press.mp3";
    this.audio.load();
    this.audio2.src = "./assets/sounds/180.mp3";
    this.audio2.load();
  
  }

  addScore(score: number){
    this.audio.play();
    let helperRound = 99999;
    
    let testPlayers : Player[] = [];

    this.injectService.players.subscribe(value => { testPlayers = value;});

    // multiply score if a double or triple button was pressed
    score = this.double ? score * 2 : score;
    score = this.triple ? score * 3 : score;
    // reset flags
    this.double = false;
    this.triple = false;


    //find the next player
    for(var player of testPlayers)
    {
      if(player.winnerPlace != 0)
      {
        continue;
      }
      if(player.round < helperRound)
      {
        helperRound = player.round;
      }
    }
     
    for(var player of testPlayers)
    {
      //skip player if he has already won
      if(player.winnerPlace != 0)
      {
        if(player.index == this.helperIndex)
        {
          this.helperIndex++;
        }
        continue;
      }

      if(player.index == this.helperIndex && player.round == helperRound)
      {
        switch(player.currentScoreNumber){
          case 1:
            player.score1 = score.toString();
            player.currentScoreNumber = 2;
            player.thrownPoints += Number(player.score1);
            break;
          case 2:
            player.score2 = score.toString();
            player.currentScoreNumber = 3;
            player.thrownPoints += Number(player.score2);
            break;
          case 3:
            player.score3 = score.toString();
            player.currentScoreNumber = 1;
            player.round++;

            // indicates that the next players score can be resetted
            this.resetNextPlayer = true;
            
            if((Number(player.score1) + Number(player.score2) + Number(player.score3)) == 180){
              this.audio2.play();
            }
            
            //calculate average
            player.thrownPoints += Number(player.score3);
            
            player.throwsCount++;
            player.average = Number((Math.round((player.thrownPoints / (player.throwsCount-1)) * 100) / 100).toFixed(2));
            break;
        }
        //calculaste the remaining points of the player
        player.remaining = player.remaining - score;
        
        //check if the player has won
        if(player.remaining == 0)
        {
          player.winnerPlace = this.winnerNumber;
          this.winnerNumber++;
          // indicates that the next players score can be resetted
          this.resetNextPlayer = true;
          if(player.round == helperRound)
          {
            player.round++;
          }
        }

        //reset score if player has thrown more than needed
        if(player.remaining < 0)
        {
          player.remaining = player.remaining + Number(player.score1) + Number(player.score2) + Number(player.score3);
          player.currentScoreNumber = 1;
          // indicates that the next players score can be resetted
          this.resetNextPlayer = true;
          if(player.round == helperRound)
          {
            player.round++;
          }
        }

        if(player.round > helperRound)
        {
          this.helperIndex++;
          break;
        }
      }
    }

    
    //reset everything when the round is over
    if(this.helperIndex > testPlayers.length)
    {
      this.helperIndex = 1;
    }

    this.helperIndex = this.findNextHelperIndex(testPlayers, this.helperIndex);

    // reset the next players score
    for(var player of testPlayers){
      if(player.index == this.helperIndex && player.winnerPlace == 0 && this.resetNextPlayer){
        player.score1 = "";
        player.score2 = "";
        player.score3 = "";
        this.resetNextPlayer = false;
      }
    }

    this.injectService.setPlayers(testPlayers);
  }

  private findNextHelperIndex(players: Player[], index: number) : number{
    for(var player of players){
      if(player.index == index && player.winnerPlace > 0){
        if((index + 1) > players.length){
          index = 0;
        }
        return this.findNextHelperIndex(players, index + 1);
      }
    }
    return index;
  }

  public doubleButtonClass(){
    return this.double ? 'pressedButton' : 'scoreButton';
  }

  public tripleButtonClass(){
    return this.triple ? 'pressedButton' : 'scoreButton';
  }

  public setDouble(){
    this.double = !this.double;
    this.triple = false;
  }

  public setTriple(){
    this.triple = !this.triple;
    this.double = false;
  }


}
