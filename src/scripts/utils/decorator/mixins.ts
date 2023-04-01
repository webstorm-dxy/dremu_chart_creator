export function Mixins(...list: unknown[]) {
    return function(target) {
        Object.assign(target.prototype, ...list);
    };
}

// export const ClassMinxins = (superClass, ) => class extends superClass {};