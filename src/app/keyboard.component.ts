
import { Component, ViewEncapsulation } from "@angular/core";
import Keyboard from "simple-keyboard";

import { ButtonControlService } from "./button-control.service";


interface Word {
  char: string;
  state: number
}


@Component({
  selector: 'word-keyboard',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})





export class KeyboardComponent {




  value = "";
  keyboard: Keyboard;
  keybrdButtons: string;
  CharStates: Word[] = [];

  tries: number = 0;
  constructor(private buttonControlService: ButtonControlService) { }

  ngOnInit() {
    this.buttonControlService.getKeyBoardButton().subscribe(data => {
      this.keybrdButtons = data;
      //console.log(this.CharStates.length)
      //console.log(this.CharStates)
      
      
      //console.log(this.keybrdButtons[0])
      
     
     // console.log(this.CharStates.length)



     var index = this.CharStates.findIndex(x => x.char==data[0]); 
      if(index === -1){
        this.CharStates.push({ char: data[0], state: data[1] })
      }else{
        if(this.CharStates[index].state===0 && data[1]===1){
          this.CharStates[index].state=1
        }
        if(this.CharStates[index].state===0 && data[1]===2){
          this.CharStates[index].state=2
        }
        if(this.CharStates[index].state===1 && data[1]===2){
          this.CharStates[index].state=2
        }
      }
      
      
      this.CharStates.forEach(x => {if(x.state===0){this.keyboard.addButtonTheme(x.char.toUpperCase(), "Wrong")};
                                    if(x.state===1){this.keyboard.removeButtonTheme(x.char.toUpperCase(), "Wrong"), this.keyboard.addButtonTheme(x.char.toUpperCase(), "Partial")};
                                    if(x.state===2){this.keyboard.removeButtonTheme(x.char.toUpperCase(), "Wrong"),this.keyboard.removeButtonTheme(x.char.toUpperCase(), "Partial"),this.keyboard.addButtonTheme(x.char.toUpperCase(), "Full")}
                                  
                                  })
    })

  }


  ngAfterViewInit() {
    this.keyboard = new Keyboard({
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button),

      theme: "hg-theme-default hg-layout-default myTheme",
      layout: {
        default: [

          "Q W E R T Y U I O P",
          "A S D F G H J K L",
          "{enter} Z X C V B N M {bksp}",

        ],

      },
      display: {
        '{enter}': 'ENTER',
        "{bksp}": "⌫"

      },
      inputName: "input1",
      maxLength: {
        input1: 5,
      },
      buttonTheme: [
        {
          class: "Wrong",
          buttons: " "
        },
        {
          class: "Partial",
          buttons: " "
        },
        {
          class: "Full",
          buttons: " "
        }
       
      ]


    });
  }

  onChange = (input: string) => {
    this.value = input;

  };

  onKeyPress = (button: string) => {

    if (!button.match("{enter}")) {

      this.setButtonPressed(button.toLowerCase());
    }


    if (button.match("{enter}")) {

      this.setButtonPressed(button.toLowerCase());
      console.log('qui')
     
    }


  };

  onInputChange = (event: any) => {
    this.keyboard.setInput(event.target.value);
  };

  setButtonPressed(button: string) {
    this.buttonControlService.setButton(button);
  }

  getKeyBoardButtons() {
    this.buttonControlService.getKeyBoardButton()
  }

}
