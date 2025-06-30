export class Stack {
  data = [];
  push(item) { this.data.push(item); }
  pop()      { return this.data.pop(); }
  peek()     { return this.data.at(-1); }
  get size() { return this.data.length; }
}