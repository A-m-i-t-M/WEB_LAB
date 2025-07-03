import { Stack } from './stack.js';
import { Queue } from './queue.js';
const s = new Stack();
console.log(s.pop());
s.push(10); 
s.push(20); 
console.log('Stack peek:', s.peek(), s.pop());
console.log(s);

const q = new Queue();
q.enqueue('A'); 
q.enqueue('B'); 
console.log(q);
console.log('Queue dequeue:', q.dequeue());