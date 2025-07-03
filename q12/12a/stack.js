export class Stack {
  data = [];
  push(item) { this.data.push(item); }
  pop()      { if (this.isEmpty()) {return undefined}; console.log(this.data); return this.data.pop(); }
  isEmpty()  { return this.data.length === 0; }
  peek()     { if (this.isEmpty()) {return undefined}; return this.data.at(-1); }
  get size() { return this.data.length; }
}