import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
  name: "filterByProp",
  pure: false,
})

@Pipe({
  name: "filterIfAnyIsTrue",
  pure: false,
})
@Pipe({
  name: "filterIfAllAreTrue",
  pure: false,
})
export class FilterIfAllAreTruePipe implements PipeTransform {
  checkit(opt) {
    return opt === null || opt === undefined || !opt.length;
  }
  some() {}
  transform(items: any[], filter: any): any {
    let keys = Object.keys(filter);
    if (!items || keys.length) {
      return items;
    }
    return items.filter((item) => {
      return keys.every((key) => {
        if (this.checkit(filter[key])) return true;
        return item[key].indexOf(filter[key]) !== -1;
      });
    });
  }
}
@Pipe({
  name: "multifilter",
  pure: false,
})
export class MultiFilterPipe implements PipeTransform {
  checkIt(opt) {
    return opt === null || opt === undefined || !opt.length;
  }
  // filterType
  filterByProp(items, keys, filter) {
    return items.filter((item) => {
      return keys.some((key) => {
        if (
          filter[key] === null ||
          filter[key] === undefined ||
          !filter[key].length
        )
          return true;
        return item[key].indexOf(filter[key]) !== -1;
      });
    });
  }

  transform(
    items: any[],
    filter: {
      filterType?: "filterByProp" | "filterIfAnyIsTrue" | "filterIfAllAreTrue";
      filter:
        | {
            [key: string]: string;
          }
        | [{ [key: string]: string }];
    }
  ): any[] {
    if (!items || !items.length) return [];
    const filterMethod = filter.filterType || "filterByProp";
    const thisfilter = filter.filter;
   
    if (Array.isArray(thisfilter)) {
      return thisfilter.reduce((acc, item_) => {
        const keys = Object.keys(item_);
        // if(item_[keys])
        return this[filterMethod](acc, keys, item_);
      }, items);
    } else {
      const keys = Object.keys(thisfilter);
      return this[filterMethod](items, keys, thisfilter);
    }
  }
}
