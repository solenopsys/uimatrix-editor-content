
export interface GraphItem {
  id: string;
  name: string;
  count: number;
  before?: string[];
  long: number;
}

export interface DrawItem {
  x: number;
  y: number;
  long: number;
}

export class PathTreeCalculatorService {

  yPos = 0;
  public  lineHeight = 10;

  constructor() {
  }

  findPath(arr:any, itemMap:any, id:any, beforeX:any): (() => any)[] {
    const resFuncs: any [] = [];


    console.log('GET CURRENT', id);
    const current = itemMap[id];
    if (!arr[id]) {
      arr[id] = {x: beforeX, y: this.yPos, long: current.long};
      this.yPos = this.yPos - this.lineHeight;
    } else {
      if (arr[id].x > beforeX) {
        arr[id].x = beforeX;
      }
    }
    const beforeXn = beforeX - current.long;
    if (current.before && current.before.length > 0) {
      current.before.forEach((before:any) => {
        const f = () => {
          return this.findPath(arr, itemMap, before, beforeXn);
        };
        resFuncs.push(f);
      });
    }


    return resFuncs;
  }

  postPreocess(funcs: (() => any)[]) {
    const nextGroup: (() => any)[] = [];
    funcs.forEach(func => {
      if (func) {
        nextGroup.push(...func());
      }
    });

    if (nextGroup.length > 0) {
      this.postPreocess(nextGroup);
    }
  }


  calcPoints(mainIds: string[], items: GraphItem[]): { items: { [key: string]: DrawItem }, rect: any } {
    const arr: { [key: string]: DrawItem } = {};

    const itemMap:any = {};
    items.forEach(item => {
        itemMap[item.id] = item;
      }
    );

    const funcs:any[] = [];
    mainIds.forEach(currentId => {
      funcs.push(...this.findPath(arr, itemMap, currentId, 0));
    });

    this.postPreocess(funcs);


    let minX = 0;
    let minY = 0;
    Object.values(arr).forEach(val => {
      const newMinX = val.x - val.long;
      if (newMinX < minX) {
        minX = newMinX;
      }
      const newMinY = val.y - this.lineHeight;
      if (newMinY < minY) {
        minY = newMinY;
      }
    });


    return {items: arr, rect: {x: minX, y: minY}};
  }
}
