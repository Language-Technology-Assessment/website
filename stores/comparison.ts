import { defineStore } from 'pinia'

export const useMyComparisonStore = defineStore({
  id: 'myComparisonStore',
  state: () => ({ 
    selected: []
  }),
  actions: {
    toggle(item: string) {
      if (this.selected.includes(item)) {
        this.selected.splice(this.selected.indexOf(item), 1)
      } else {
        this.selected.push(item)
      }
    }
  }
})
