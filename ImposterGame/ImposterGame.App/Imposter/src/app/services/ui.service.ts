import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor(private toastController: ToastController, private alertController: AlertController) { }

  async alert(title, message = "", confirmedCallback: () => void = null) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [{
        text: 'OK',
        handler: () => {
          if(confirmedCallback){
            confirmedCallback();
          }
        }
      }],
    });

    await alert.present();
  }

  async confirm(title, message = "", confirmedCallback: () => void = null) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'OK',
          handler: () => {
            if(confirmedCallback){
              confirmedCallback();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async successToast(title, message = "") {
    const toast = await this.toastController.create({
      header: title,
      message: message,
      duration: 2000,
      color: 'success'
    });

    toast.present();
  }

  async warningToast(title, message = "") {
    const toast = await this.toastController.create({
      header: title,
      message: message,
      duration: 5000,
      color: 'warning',
      showCloseButton: true
    });

    toast.present();
  }

  async errorToast(title, message = "") {
    const toast = await this.toastController.create({
      header: title,
      message: message,
      duration: 10000,
      color: 'danger',
      showCloseButton: true
    });

    toast.present();
  }
}