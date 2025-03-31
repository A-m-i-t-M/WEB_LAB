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


function sixth(arr) {
    return arr.reduce((total, num) => total * num, 1);
}
console.log("SUM",sum([1,2,3,4,5,6]));
console.log("PROD",sixth([1,2,3,4,5,6]));

function seventh(str) {
    return str.split('').reverse().join('');
}
console.log("Reverse string of akagemakill is ",seventh('akagemakill'));

var eighth = {
    "merry": "god",
    "christmas": "jul",
    "and": "och",
    "happy": "gott",
    "new": "nytt",
    "year": "år"
};

function translateChristmasCard(cardText) {
    var words = cardText.split(' ');
    var translatedWords = words.map(function(word) {
        return eighth[word.toLowerCase()] || word;
    });
    return translatedWords.join(' ');
}
console.log(translateChristmasCard("Merry Christmas and Happy New Year"));


function ninth(words) {
    let longest = words.reduce((longest, current) => {
        return current.length > longest.length ? current : longest;
    }, "");
    return longest.length;
}
console.log(ninth(["marde","mereko","koi","fayda","nhi","jeene","ka"]));


function tenth(words, length) {
    return words.filter(word => word.length > length);
}
console.log(tenth(["marde","mereko","koi","fayda","nhi","jeene","ka"],4));


function eleventh(str) {
    var freq = {};
    for (var i = 0; i < str.length; i++) {
        var char = str[i];
        if (freq[char]) {
            freq[char]++;
        } else {
            freq[char] = 1;
        }
    }
    return freq;
}
console.log(eleventh("commit karde bhai"));

console.log("This is the thirteenth program");
var names = [];
var name;
while (name = prompt("Enter a name (or cancel to stop):")) {
    names.push(name);
}

names.sort();
alert("Sorted names: \n" + names.join("\n"));
