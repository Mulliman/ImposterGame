import { Component, OnInit } from '@angular/core';
import { OptionGridGroup, OptionGridModel, OptionGridService } from 'src/app/services/option-grid.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-choose-grid',
  templateUrl: './choose-grid.component.html',
  styleUrls: ['./choose-grid.component.scss'],
})
export class ChooseGridComponent implements OnInit {

  gridGroups: OptionGridGroup[];
  showSlides: boolean;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 1,
    pager: true,
  };


  constructor(private gridService: OptionGridService,
    private modalController: ModalController) {
  }

  async ngOnInit() {
    this.gridGroups = await this.gridService.getAllOptionGrids();

    setTimeout(() => {
      this.showSlides = true;
    }, 0);
  }

  async selectGrid(grid: OptionGridModel) {
    this.gridService.setSelectedOptionGrid(grid);
    await this.modalController.dismiss();
  }

  async dismiss() {
    await this.modalController.dismiss();
  }
}