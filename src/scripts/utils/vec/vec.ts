class Vec extends Array{
    constructor(...vec: number[]) {
        super();
        super.push(...vec);
    }
}

export class Vec2 extends Vec{
    constructor(x:number, y:number){
        super(x, y);
    }
}

export class Vec3 extends Vec{
    constructor(x:number, y:number, z:number){
        super(x, y, z);
    }
}

export class Vec4 extends Vec{
    constructor(x:number, y:number, z:number, a: number){
        super(x, y, z, a);
    }
}