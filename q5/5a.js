function pluralize(noun, number) {
  const irregulars = {
    sheep: "sheep",
    goose: "geese",
    person: "people",
    mouse: "mice"
  };
  let plural = noun;
  if (number !== 1) {
    if (irregulars[noun]) {
      plural = irregulars[noun];
    } else if (noun.endsWith("y") && /[^aeiou]y$/.test(noun)) {
      plural = noun.slice(0, -1) + "ies";
    } else {
      plural = noun + "s";
    }
  }
  return `${number} ${plural}`;
}

console.log(pluralize("cat", 5)); // "5 cats"
console.log(pluralize("dog", 1)); // "1 dog"
console.log(pluralize("sheep", 3)); // "3 sheep"
console.log(pluralize("goose", 2)); // "2 geese"