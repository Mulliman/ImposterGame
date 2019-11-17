import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.scss'],
})
export class HelpModalComponent implements OnInit {

  @Input() isImposter: boolean;
  @Input() section: string;

  public sections: any = {
    imposter: 'imposter',
    others: 'others',
    selectedSection: ''
  };

  showImposterVariant: boolean;

  constructor(private modalController: ModalController) { }

  async ngOnInit() {
    if (this.isImposter) {
      this.sections.selectedSection = this.sections.imposter;
      this.showImposterVariant = true;
    } else {
      this.sections.selectedSection = this.sections.others;
    }
  }

  isSectionShown(sectionName: string): boolean {
    return !this.section || this.section == sectionName;
  }

  async dismiss() {
    await this.modalController.dismiss();
  }

  imposterSegmentChanged(ev: any) {
    var val = ev.detail.value;
    this.showImposterVariant = val == 'imposter';
  }

}
