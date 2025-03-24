function maxi(a, b){
    if(a > b)
        console.log(a);
    else
        console.log(b);
}
console.log("First program");
maxi(10,300);

function max3(a, b, c){
    if(a > b && a > c){
        console.log(a);
    }else if(b > c){
        console.log(b);
    }else{
        console.log(c);        
    }
}
console.log("Second program");
max3(1,2,5);

function third(a){
    const vows = ['a','e','i','o','u'];
    if(vows.includes(a)){
        console.log("Vowel hai");
    }else
    console.log("Vowel nahi hai");
}
console.log("Third program");
third('a');

function fourth(word){
    let trans =  "";
    const vows = ['a','e','i','o','u'];
    for(let i = 0; i < word.length; i++){
        var c = word[i];
        if(!vows.includes(c) && c.match(/[a-z]/i)){
            trans += (c +'o'+c);
        }else{
            trans += (c +'o'+c);
        }
    }
    console.log(trans);
}
console.log("Fourth program");
fourth('abcd');

function fifth(arr){
    let s = 0, m = 1;
    for(let i in arr){
        s += parseInt(i);
    }
    m = arr.reduce((total, num) => total * num, 1);
    console.log("Sum = ", s,"\nProduct = ",m);
}
console.log("Fifth program");
fifth([1,2,3,4,5]);