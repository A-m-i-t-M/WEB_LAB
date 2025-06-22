function months(){
    const m = [ "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December" ];
    return function mn(num){
        const n = Math.trunc(num);
        return Number.isFinite(n) && n > 0 && n < 13 ? m[n-1] : "Bad Number";
    }
}
const x = months();
console.log(x(500));
console.log(x(1));