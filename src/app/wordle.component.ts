import { Component, ElementRef, HostListener, OnInit, ViewChildren, ViewChild, QueryList } from '@angular/core';

import { ButtonControlService } from './button-control.service';
import { DICT } from './dictionary';
import { DataStatService } from './data-stat.service';
import { ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle, 
  ApexPlotOptions,
  ApexYAxis,
  ApexDataLabels,
  ApexGrid} from 'ng-apexcharts';


const Tries_number: number = 6;
const word_length = 5;

interface Try {
  letters: Letter[];
}

interface Letter {
  text: string;
  state: LetterState;
}

enum LetterState {
  WRONG,
  PARTIAL_MATCH,
  FULL_MATCH,
  PENDING
}


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
};




@Component({
  selector: 'word-wordle',
  templateUrl: './wordle.component.html',
  styleUrls: ['./wordle.component.scss']
})
export class WordleComponent implements OnInit {

  @ViewChildren('tryContainer') tryContainers!: QueryList<ElementRef>;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  readonly LetterState = LetterState;
  readonly tries: Try[] = [];
  private key: string;
  private CurrChar_index: number = 0;
  private tries_done: number = 0;
  public fadeOutMessage = false;
  private word_trg: String = '';
  private getBtnPrsd: string;
  public numberOfGames: number;
  public numberOfLoss: number;
  private states: LetterState[] = [];
  private won = false;
  private stats = 0;
  showShareDialogContainer = false;
  showShareDialog = false;
  Msg = '';
  
  
  constructor(private buttonControlService: ButtonControlService, private dataStatService: DataStatService) {
    this.chartOptions = {series: [
      {
        name: "My-series",
        data: [0,0,0,0,0,0],
        color: '#787c7e'
      }],
      chart: {
        height: 350,
        type: "bar",
        toolbar: {
          show: false
        },
      },
      xaxis: {
        categories: ["1", "2",  "3",  "4",  "5",  "6"],
        labels: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        show:false
      },
     
      plotOptions: {
        bar: {
          horizontal: true
        }},
        
    }

    for (let i = 0; i < Tries_number; i++) {
      const letters: Letter[] = [];
      for (let j = 0; j < word_length; j++) {
        letters.push({ text: '', state: LetterState.PENDING })
      }
      this.tries.push({ letters });
    }
    const numWords = DICT.length;

    while (true) {
      const index = Math.floor(Math.random() * numWords);
      const word = DICT[index]
      if (word.length == word_length) {
        this.word_trg = word.toLowerCase();
        console.log(this.word_trg)
        break;
      }
    }

  }




  ngOnInit() {
    
    
    //localStorage.clear();
    const myData = this.dataStatService.get('stats');
    console.log(myData)
    this.buttonControlService.btn_prsd.subscribe(data => {
      this.getBtnPrsd = data;
      this.handleclick(this.getBtnPrsd);
    })
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
    if (this.won) {
      return;
    }
    if (this.checkifLetter(event.key) == true) {
      if (this.CurrChar_index < (this.tries_done + 1) * word_length) {
        this.setChaR(this.key);
        this.CurrChar_index++;

      }


    }
  }



  handleclick(event: string) {
    if (this.won) {
      return;
    }
    if (this.checkifLetter(event) == true) {
      if (this.CurrChar_index < (this.tries_done + 1) * word_length) {
        this.setChaR(event);
        this.CurrChar_index++;
      }


    }

  }
  checkifLetter(event: string) {

    if (event.toLowerCase() >= 'a' && event.toLowerCase() <= 'z' && event.length == 1) {
      return true
    }
    if (event == 'Enter' || event == '{enter}' || event == '{ENTER}' || event == 'ENTER') {

      this.enterHandle();

    }


    if (event == 'Backspace' || event == "{bksp}") {
      if (this.CurrChar_index <= (this.tries_done * word_length) + word_length && this.CurrChar_index > (this.tries_done * word_length) && this.CurrChar_index >= 0 && this.CurrChar_index <= word_length * Tries_number) {

        this.deleteHandle();
      }

    }
  }



  deleteHandle() {
    this.CurrChar_index--;
    this.setChaR('')
  }

  async enterHandle() {

    if (this.checkSubmission() == true) {
      //this.animate()
      this.tries_done++;
      const tryIndex = Math.floor(this.CurrChar_index / word_length);
      //const letterindex = this.CurrChar_index - tryIndex * word_length;

    }


  }

  private setChaR(key: string) {
    const tryIndex = Math.floor(this.CurrChar_index / word_length);
    const letterindex = this.CurrChar_index - tryIndex * word_length;
    this.tries[tryIndex].letters[letterindex].text = key;
  }

  checkSubmission(): boolean {

    const curTry = this.tries[this.tries_done]
    const currWord = curTry.letters.map(letter => letter.text).join('')



    

    if (curTry.letters.some(letter => letter.text == '')) {
      this.showMessage('Ma sai contare, imbecille?')
      this.shake();
      return false;
    }


    if (!DICT.includes(currWord.toLowerCase())) {

      this.showMessage('Non è una parola, ignorante!')
      this.shake();
      return false;
    }

    if (this.CurrChar_index % 5 == 0 && this.CurrChar_index <= (this.tries_done * word_length) + word_length && this.CurrChar_index > (this.tries_done * word_length) && DICT.includes(currWord.toLowerCase())) {
      this.setState(curTry)


    }

    return true


  }


  perfect_match() {
    
    var this_try = this.tries[this.tries_done];
   
    const currWord = this_try.letters.map(letter => letter.text).join('')
    //var count = (currWord.match(rgxp) || []).length
    var count = 0;

    const targetWordCharCount: { [letter: string]: number } = {}
    for (const letter of this.word_trg) {
      const count = targetWordCharCount[letter];

      if (count == null) {
        targetWordCharCount[letter] = 0;
      }
      targetWordCharCount[letter]++;
    }
    
   
   
    for (let i = 0; i < word_length; i++) {
      //check if char is in the target word
      const expected = this.word_trg[i];
      const curLetter = this_try.letters[i]
      const got= curLetter.text.toLowerCase();
      let state = LetterState.WRONG;

        
          //check if perfect match
        if (expected===got && targetWordCharCount[got]>0) {
          //set state to perfect match
          targetWordCharCount[expected]--
          state = LetterState.FULL_MATCH;
          
          this.states[i]=state
        }
       else{
        this.states[i]=LetterState.WRONG
       }
        
        
       
       // console.log(this.copyTry)
      
      
    }
    for (let i = 0; i < word_length; i++){
      const expected = this.word_trg[i];
      const curLetter = this_try.letters[i]
      const got= curLetter.text.toLowerCase();
      let state = LetterState.WRONG;
      if (this.word_trg.includes(got) && targetWordCharCount[got]>0 && this.states[i]!==2) {    
        targetWordCharCount[got]--
        state = LetterState.PARTIAL_MATCH;
        this.states[i]=state
    }
   
    }

  }



  /*Need this method to set the state for every char, but the state has to be set within the animation loop or it will not be sync*/
  async setState(tryToSetState: Try) {

    const tryContainer = this.tryContainers.toArray()[this.tries_done].nativeElement as HTMLElement;
    const letterEles = tryContainer.querySelectorAll('.letter-container');

    const curTry = this.tries[this.tries_done]
    const currWord = curTry.letters.map(letter => letter.text).join('')
    var countOcc = 0;
    this.perfect_match()

    for (let i = 0; i < letterEles.length; i++) {
      const curLettEle = letterEles[i]
      curLettEle.classList.add('fold')
      //console.log(curLettEle)
      await this.wait(250);

      
     
        tryToSetState.letters[i].state = this.states[i];
        this.buttonControlService.setKeyboardButtons(tryToSetState.letters[i].text, this.states[i])
    
      curLettEle.classList.remove('fold');
      await this.wait(250);
    }

    if (this.tries_done === Tries_number) {
      // Don't hide it.
      this.showMessage(this.word_trg.toUpperCase());
      this.showShare();
      this.setStorageStat('n',this.tries_done)
    }
    

    if (tryToSetState.letters.every(char => char.state === LetterState.FULL_MATCH)) {
      this.showMessage('NICE!');
      this.won = true;
      this.setStorageStat('y',this.tries_done)
      // Bounce animation.
      for (let i = 0; i < letterEles.length; i++) {
        const curLetterEle = letterEles[i];
        curLetterEle.classList.add('bounce');
        await this.wait(160);
      }

      
      this.showShare();
      return;
    }
  }


  private shake() {
    const tryContainer = this.tryContainers.toArray()[this.tries_done].nativeElement as HTMLElement;
    tryContainer.classList.add('shake');
    setTimeout(() => {
      tryContainer.classList.remove('shake');
    }, 500)
  }
/*
  handleClickShare() {
    // 🟩🟨⬜
    // Copy results into clipboard.
    let clipboardContent = '';
    for (let i = 0; i < this.tries_done; i++) {
      for (let j = 0; j < word_length; j++) {
        const letter = this.tries[i].letters[j];
        switch (letter.state) {
          case LetterState.FULL_MATCH:
            clipboardContent += '🟩';
            break;
          case LetterState.PARTIAL_MATCH:
            clipboardContent += '🟨';
            break;
          case LetterState.WRONG:
            clipboardContent += '⬜';
            break;
          default:
            break;
        }
      }
      clipboardContent += '\n';
    }
    console.log(clipboardContent);
    window.navigator['clipboard'].writeText(clipboardContent);
    this.showShareDialogContainer = false;
    this.showShareDialog = false;
    this.showMessage('Copied results to clipboard');
    window.location.reload();
  }
*/
  
handleClickShare(){
  window.location.reload();
}

  private async wait(ms: number) {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    })
  }


  private showMessage(msg: string) {
    this.Msg = msg;
    setTimeout(() => {
      this.fadeOutMessage = true;
      setTimeout(() => {
        this.Msg = ''
        this.fadeOutMessage = false
      }, 500)
    }, 2000)
  }

  private showShare() {
    setTimeout(() => {
      this.showShareDialogContainer = true;
      // Wait a tick till dialog container is displayed.
      setTimeout(() => {
        // Slide in the share dialog.
        this.showShareDialog = true;
      });
    }, 1500);
  }

  private setStorageStat(win: string, tries: number){
    //localStorage.clear();
    var stat = this.dataStatService.get('Games')+1
    this.dataStatService.set('Games',stat)
    if(win==='y'){
      var data = this.dataStatService.get(tries.toString()+'Tries')+1
      this.dataStatService.set(tries.toString()+'Tries',data)
    };
    
    this.chartOptions.series = [{
      data: [Math.round(this.dataStatService.get('1Tries')*100/this.dataStatService.get('Games')), 
            Math.round(this.dataStatService.get('2Tries')*100/this.dataStatService.get('Games')), 
            Math.round(this.dataStatService.get('3Tries')*100/this.dataStatService.get('Games')), 
            Math.round(this.dataStatService.get('4Tries')*100/this.dataStatService.get('Games')),
            Math.round(this.dataStatService.get('5Tries')*100/this.dataStatService.get('Games')),
            Math.round(this.dataStatService.get('6Tries')*100/this.dataStatService.get('Games'))]
    }]
    
    this.numberOfGames=this.dataStatService.get('Games');
    this.numberOfLoss=this.numberOfGames-this.dataStatService.get('1Tries')-this.dataStatService.get('2Tries')-this.dataStatService.get('3Tries')-this.dataStatService.get('4Tries')-this.dataStatService.get('5Tries')-this.dataStatService.get('6Tries')
    
    console.log(this.numberOfGames+' '+this.numberOfLoss)

  }


}

