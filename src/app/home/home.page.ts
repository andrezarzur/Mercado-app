import { Component, ViewChild } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { Router } from '@angular/router'
import { ToastController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { reduce } from 'rxjs';

var _ = require('lodash');

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonModal) modal: IonModal;

  public todo: any = {};
  public id = 0;
  public value = "acomp";
  public history: any[] = [];
  public results = [...this.history];
  public total = 0;
  public quantidadeTotal = 0;
  
  
  
  public toDoElement: any = {};
  public toDoList: any[] = [];
  public toDoItemName: "";
  public toDoItemCategory: "";

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {}

  logForm() {
    const error = this.validate();
    if (error) {
      this.presentToast('bottom');
      return;
    }
    this.updateTotal();
    var dataClone = _.cloneDeep(this.todo);
    this.history.push(dataClone);
    this.results = [...this.history];
  }

  validate() {
    let error = false;
    if(!('quantidade' in this.todo) || this.todo.quantidade == "" || this.todo.quantidade == null ) {
      error = true;
      var div = document.getElementById('inpQuan');
      div!.style.borderColor = 'red';
    }
    if(!('preco' in this.todo) || this.todo.preco == "" || this.todo.preco == null ) {
      error = true;
      var div = document.getElementById('inpPrec');
      div!.style.borderColor = 'red';
    } 
    if(!('categoria' in this.todo) || this.todo.categoria == "" || this.todo.categoria == null ) {
      error = true;
      var div = document.getElementById('inpCate');
      div!.style.borderColor = 'red';
    }
    if(!('name' in this.todo) || this.todo.name == "" || this.todo.name == null ) {
      error = true;
      var div = document.getElementById('inpName');
      div!.style.borderColor = 'red';
    }
    return error;
  }

  updateTotal() {
    this.todo['id'] = this.id;
    console.log()
    this.todo['total'] = Math.round((this.todo.preco * this.todo.quantidade) * 100 + Number.EPSILON ) / 100;
    this.id ++;
    this.total += this.todo.preco * this.todo.quantidade;
    this.total = Math.round( this.total * 100 + Number.EPSILON ) / 100;
    this.quantidadeTotal += this.todo.quantidade;
    this.quantidadeTotal = Math.round( this.quantidadeTotal * 100 + Number.EPSILON ) / 100;
  }

  removeCard(card: any) {
    const objWithIdIndex = this.history.findIndex((obj) => obj.id === card.id);
    if (objWithIdIndex > -1) {
      this.history.splice(objWithIdIndex, 1);
      this.results.splice(objWithIdIndex, 1);
      this.total -= card.preco * card.quantidade;
      this.total = Math.round( this.total * 100 + Number.EPSILON ) / 100;
      this.quantidadeTotal -= card.quantidade;
    }
  }

  test(){
    this.modal.present();
  }


  updateValue(value: string) {
    this.value = value;
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm(isTodo: boolean) {
    if (isTodo) {
      this.toDoList.push({'name': this.toDoItemName, 'checked': false, 'categoria': this.toDoItemCategory})
    } else {
      const error = this.validate();
      if (error) {
        this.presentToast('bottom');
        return;
      }
    }
    this.modal.dismiss( this.toDoItemName, 'confirm');
  }


  filterCategory(event: any) {
    const query = event.target.value;
    this.results = [];
    console.log(query.length)
    if (this.history.length !== 0) {
      if (query.length !== 0) {
        for (const i in query) {
          const result = this.history.filter(d => d.categoria.indexOf(query[i]) > -1);
          if (result.length !== 0) {
            this.results.push(result[0]);
          }
        }
      } else {
        this.results = this.history;
      }
    }
  }

  toDoModal() {

  }
  

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Preencha todos os campos!',
      duration: 1500,
      position: position,
      buttons: [
        {
          text: 'Fechar',
          role: 'cancel'
        }
      ],
      color: 'danger'
    });

    await toast.present();
  }
}
