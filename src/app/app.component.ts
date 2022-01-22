import { Component } from '@angular/core';
import { CellStatus, ICell } from './models/cell.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'NumericGrid';
  public cells: ICell[][] = [];
  private window: number = 5;

  constructor() {
    // instantiate cells array
    for (var i: number = 0; i < 50; i++) {
      this.cells[i] = [];
      for (var j: number = 0; j < 50; j++) {
        this.cells[i][j] = { status: CellStatus.none };
      }
    }
  }


  render(i: number, j: number) {

    for (var ii: number = 0; ii < 50; ii++) {
      var cell = this.cells[ii][j];
      cell.value = (cell.value || 0) + 1;
      cell.status = CellStatus.changed;
    }

    for (var jj: number = 0; jj < 50; jj++) {
      var cell = this.cells[i][jj];
      if (jj != j) cell.value = (cell.value || 0) + 1; // prevents dubble increase on [i][j]
      cell.status = CellStatus.changed;
    }

    // process the cells with defined value since expected patterns are near the defined ones
    for (var ii = 0; ii < 50; ii++) {
      for (var jj = 0; jj < 50; jj++) {
        if (this.cells[ii][jj].value)
          this.checkFibonacci(ii, jj);
      }
    }
  }


  // vertical and horizontal bidirectional fibonacci processor
  checkFibonacci(i: number, j: number) {

    // flags and occurence counters for bidirectional processing
    var rtl: boolean = true, ltr: boolean = true, ttb: boolean = true, btt: boolean = true;
    var rtlCycls = 0, ltrCycles = 0, ttbCycles = 0, bttCycles = 0;

    for (var indx = 0; indx < this.window - 2 && i + this.window <= 50; indx++) {
      var cell = this.cells[i + indx][j];
      var cell_i1 = this.cells[i + indx + 1][j];
      var cell_i2 = this.cells[i + indx + 2][j];
      if (cell.value && cell_i1.value && cell_i2.value) {
        if (ttb) {
          if (cell.value + cell_i1.value == cell_i2.value)
            ttbCycles++;
          else ttb = false;
        }
        if (btt) {
          if (cell.value == cell_i1.value + cell_i2.value)
            bttCycles++;
          else btt = false;
        }
      }
      else {
        ttb = btt = false;
        break;
      }
    }

    for (var indx = 0; indx < this.window - 2 && j + this.window <= 50; indx++) {
      var cell = this.cells[i][j + indx];
      var cell_j1 = this.cells[i][j + indx + 1];
      var cell_j2 = this.cells[i][j + indx + 2];
      if (cell.value && cell_j1.value && cell_j2.value) {
        if (ltr) {
          if (cell.value + cell_j1.value == cell_j2.value)
            ltrCycles++;
          else ltr = false;
        }
        if (rtl) {
          if (cell.value == cell_j1.value + cell_j2.value)
            rtlCycls++;
          else rtl = false;
        }
      }
      else {
        rtl = ltr = false;
        break;
      }
    }

    // set fibonacci status if any
    if ((ltr && ltrCycles + 2 == this.window) || (rtl && rtlCycls + 2 == this.window))
      for (var indx = 0; indx < this.window && j + indx < 50; indx++) {
        this.cells[i][j + indx].status = CellStatus.fibonacci;
      }

    if ((ttb && ttbCycles + 2 == this.window) || (btt && bttCycles + 2 == this.window))
      for (var indx = 0; indx < this.window && i + indx < 50; indx++) {
        this.cells[i + indx][j].status = CellStatus.fibonacci;
      }
  }




}
