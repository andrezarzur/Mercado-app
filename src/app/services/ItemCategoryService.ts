// category.service.ts
import { Injectable } from '@angular/core';
import { ItemCategory } from '../models/ItemCategory';

@Injectable({
  providedIn: 'root',
})
export class ItemCategoryService {
  private categories: ItemCategory[] = [{
        id: 0,
        name: 'Higiene',
        image: '1',
    },
    {
        id: 1,
        name: 'Alimentos',
        image: '1',
    },
    {
        id: 2,
        name: 'Bebidas',
        image: '1',
    },
    {
        id: 3,
        name: 'Limpeza',
        image: '1',
    },
    {
        id: 4,
        name: 'Hortifrúti',
        image: '1',
    },
  ];

  constructor() {
    // Initialize categories if needed
  }

  getCategories(): ItemCategory[] {
    return [...this.categories];
  }
}