function notBad(x){
    const a = x.indexOf("not");
    const b = x.indexOf("bad");
    if(!(a === -1 || b === -1) && a < b){
        console.log(x.slice(0, a) + "good" + x.slice(b+3));
    }
    console.log(`Not : ${a} \nBad : ${b}`);
}
notBad("This food is not that bad bro");
notBad("This dinner is not that bad bro");