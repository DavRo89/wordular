import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';





@Injectable({
  providedIn: 'root'
})


export class ButtonControlService {
 
 
  private button_pressed = new BehaviorSubject<string>('');
  private keyboard_buttons=new BehaviorSubject<any>('');
  private word = new BehaviorSubject<string>('');
  constructor() {}
 

  btn_prsd = this.button_pressed.asObservable()
  word_chosen = this.word.asObservable()

  
 
  
  setButton(button: string){
     this.button_pressed.next(button);
  }
  
 setKeyboardButtons(button: string, state:number){
  this.keyboard_buttons.next([button, state]);
  
 }

 getKeyBoardButton(){
  return this.keyboard_buttons;
 }

}


