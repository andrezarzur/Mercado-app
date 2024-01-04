import { Component, ViewChild } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { Router } from '@angular/router'
import { ToastController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { reduce } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { ItemCategoryService } from '../services//ItemCategoryService'

var _ = require('lodash');

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonModal) modal: IonModal;
  
  public searchTerm: string;

  public tabName = "acomp";

  public toBuyItem: any = {};
  public id = 0;
  public total =  0;
  public quantidadeTotal = 0;


  public history: any[] = [];
  public filteredHistory = [...this.history];
  

  public toDoList: any[] = [];
  public toDoItemName: "";
  public toDoItemCategory: "";

  public itemCategories = this.itemCategoryService.getCategories();

  constructor(
    private router: Router,
    private toastController: ToastController,
    private modalController: ModalController,
    private itemCategoryService: ItemCategoryService,
  ) {}

  submitItemForm() {
    const error = this.validate();
    if (error) {
      this.presentToast('bottom');
      return;
    }
    this.updateTotal();
    var toBuyItemClone = _.cloneDeep(this.toBuyItem);
    this.history.push(toBuyItemClone);
    this.filteredHistory = [...this.history];
    console.log(this.filteredHistory)
    console.log(this.history);
  }

  updateTotal() {
    this.toBuyItem['id'] = this.id;
    this.toBuyItem['total'] = Math.round((this.toBuyItem.preco * this.toBuyItem.quantidade) * 100 + Number.EPSILON ) / 100;
    this.id ++;
    this.total += this.toBuyItem.preco * this.toBuyItem.quantidade;
    this.total = Math.round( this.total * 100 + Number.EPSILON ) / 100;
    this.quantidadeTotal += this.toBuyItem.quantidade;
    this.quantidadeTotal = Math.round( this.quantidadeTotal * 100 + Number.EPSILON ) / 100;

  }

  removeCard(card: any) {
    const objWithIdIndex = this.history.findIndex((obj) => obj.id === card.id);
    if (objWithIdIndex > -1) {
      this.history.splice(objWithIdIndex, 1);
      this.filteredHistory.splice(objWithIdIndex, 1);
      this.total -= card.preco * card.quantidade;
      this.total = Math.round( this.total * 100 + Number.EPSILON ) / 100;
      this.quantidadeTotal -= card.quantidade;
    }
  }

  
  confirm(isTodo: boolean) {
    if (isTodo) {
      const error = this.validateToDo();
      if (error) {
        this.presentToast('bottom');
        return;
      }
      this.toDoList.push({'name': this.toDoItemName, 'checked': false, 'categoria': this.toDoItemCategory})
      this.toDoItemName = '';
      this.toDoItemCategory = '';
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
    this.filteredHistory = [];
    if (this.history.length == 0) {
      return;
    }   
    if (query.length !== 0) {
      for (const i in query) {
        const result = this.history.filter(d => d.categoria.indexOf(query[i]) > -1);
        if (result.length !== 0) {
          this.filteredHistory.push(result[0]);
        }
      }
    } else {
      this.filteredHistory = this.history;
    }
  }
  
  validate() {
    let error = false;
    if(!('quantidade' in this.toBuyItem) || this.toBuyItem.quantidade == "" || this.toBuyItem.quantidade == null ) {
      error = true;
      var div = document.getElementById('inpQuan');
      div!.style.borderColor = 'red';
    }
    if(!('preco' in this.toBuyItem) || this.toBuyItem.preco == "" || this.toBuyItem.preco == null ) {
      error = true;
      var div = document.getElementById('inpPrec');
      div!.style.borderColor = 'red';
    } 
    if(!('categoria' in this.toBuyItem) || this.toBuyItem.categoria == "" || this.toBuyItem.categoria == null ) {
      error = true;
      var div = document.getElementById('inpCate');
      div!.style.borderColor = 'red';
    }
    if(!('name' in this.toBuyItem) || this.toBuyItem.name == "" || this.toBuyItem.name == null ) {
      error = true;
      var div = document.getElementById('inpName');
      div!.style.borderColor = 'red';
    }
    return error;
  }
  
  validateToDo() {
    let error = false;
    if(this.toDoItemCategory == "" || this.toDoItemCategory == null ) {
      error = true;
    }
    if(this.toDoItemName == "" || this.toDoItemName == null ) {
      error = true;
    }
    return error;
  }
  
  cancel() {
    this.modal.dismiss(null, 'cancel');
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
