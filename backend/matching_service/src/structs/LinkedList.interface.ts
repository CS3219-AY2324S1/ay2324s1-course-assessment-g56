import Node from './Node';

export interface ILinkedList<T> {
  insertFirst(data: T): Node<T>;
  insertLast(data: T): Node<T>;
  getFirst(): T | null;
  getLast(): T | null;
  deleteNode(node: Node<T>): void;
  toArray(): T[];
  length(): number;
  isEmpty(): boolean;
  search(comparator: (data: T) => boolean): Node<T> | null;
}
