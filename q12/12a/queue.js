export class Queue {
  data = [];
  enqueue(item) { this.data.push(item); }
  dequeue()     { return this.data.shift(); }
  peek()        { return this.data[0]; }
  get size()    { return this.data.length; }
}