export class CoordinateTransformer{
    height: number;

    constructor(height:number){
        this.height = height;
    }
    toGlobal(x:number, y:number) : [number, number]{
        return this.transforms(x, y);
    }
    transform(coordinate: number) : number  {
        return coordinate * (this.height / 10);
    }
    transforms<T extends number[]>(...coordinates: T) : T {
        return coordinates.map(c => this.transform(c)) as T;
    }
}