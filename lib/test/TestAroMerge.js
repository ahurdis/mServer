let aro = [{ a: 0 }, { a: 1 }];
let aro2 = [{ b: 'a' }, { b: 'b' }];

let ret = [];

for (let i = 0; i < aro.length; i++) {
    ret.push(Object.assign(aro[i], aro2[i]));
}

console.log(ret);
