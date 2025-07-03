export class Queue {
  data = [];
  enqueue(item) { this.data.push(item); }
  dequeue()     { if (this.isEmpty()) {return undefined}; return this.data.shift(); }
  isEmpty()     { return this.data.length === 0; }
  peek()        { if (this.isEmpty()) {return undefined}; return this.data[0]; }
  get size()    { return this.data.length; }
}