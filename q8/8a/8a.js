function vowelCount(input) {
  const vowels = "aeiou";
  const count = { a: 0, e: 0, i: 0, o: 0, u: 0 };

  for (let char of input.toLowerCase()) {
    if (vowels.includes(char)) {
      count[char]++;
    }
  }

  console.log(`a, e, i, o, and u appear, respectively, ${count.a}, ${count.e}, ${count.i}, ${count.o}, ${count.u} times`);
}

vowelCount("Le Tour de France");
vowelCount("The quick brown fox jumps over the lazy dog");