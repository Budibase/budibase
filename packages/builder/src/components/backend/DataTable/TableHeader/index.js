//  // the column the header is for
//     column: Column;

//     // the name to display for the column. if the column is using a headerValueGetter,
//     // the displayName will take this into account.
//     displayName: string;

//     // whether sorting is enabled for the column. only put sort logic into
//     // your header if this is true.
//     enableSorting: boolean;

//     // whether menu is enabled for the column. only display a menu button
//     // in your header if this is true.
//     enableMenu: boolean;

//     // callback to progress the sort for this column.
//     // the grid will decide the next sort direction eg ascending, descending or 'no sort'.
//     // pass multiSort=true if you want to do a multi sort (eg user has shift held down when
//     // they click)
//     progressSort(multiSort: boolean): void;

//     // callback to set the sort for this column.
//     // pass the sort direction to use ignoring the current sort eg one of 'asc', 'desc' or null
//     // (for no sort). pass multiSort=true if you want to do a multi sort (eg user has shift held
//     // down when they click)
//     setSort(sort: string, multiSort?: boolean): void;

//     // callback to request the grid to show the column menu.
//     // pass in the html element of the column menu to have the
//     // grid position the menu over the button.
//     showColumnMenu(menuButton: HTMLElement): void;

//     // The grid API
//     api: any;
import TableHeader from "./TableHeader.svelte"

export default class TableHeaderWrapper {
  constructor() {
    // foo
  }

  init(params) {
    console.log("init", params)
    this.agParams = params
    const container = document.createElement("div")
    new TableHeader({
      target: container,
      props: params,
    })
    this.eGui = container
  }

  // can get called more than once, you should return the HTML element
  getGui() {
    return this.eGui
  }

  // gets called when a new Column Definition has been set for this header
  refresh(params) {
    console.log("Refreshing", params)
  }

  // optional method, gets called once, when component is destroyed
  destroy() {
    console.log("Destroy")
  }
}
