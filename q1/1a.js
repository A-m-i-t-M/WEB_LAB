function translate(text){
    const vows = 'aeiouAEIOU';
    let res = '';
    for(let char of text){
        if((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')){
            if(!vows.includes(char)){
                res += char.toLowerCase() + 'o' + char.toLowerCase();
            }else{
                res += char.toLowerCase();
            }
        }else{
            res += char;
        }
    }
    return res;
}
console.log(translate("This is fun!")); 
console.log(translate("Hello World!")); 
