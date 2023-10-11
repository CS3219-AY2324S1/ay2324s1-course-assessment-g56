import { ILinkedList } from './LinkedList.interface';
import Node from './Node';

export default class LinkedList<T> implements ILinkedList<T> {
  private head: Node<T> | null = null;

  private tail: Node<T> | null = null;

  private size: number = 0;

  public insertFirst(data: T): Node<T> {
    const node = new Node(data);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      this.head.prev = node;
      node.next = this.head;
      this.head = node;
    }
    this.size += 1;
    return node;
  }

  public insertLast(data: T): Node<T> {
    const node = new Node(data);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      const getLast = (node: Node<T>): Node<T> =>
        node.next ? getLast(node.next) : node;

      const lastNode = getLast(this.head);
      node.prev = lastNode;
      lastNode.next = node;
      this.tail = node;
    }
    this.size += 1;
    return node;
  }

  public getFirst(): T | null {
    return this.head ? this.head.data : null;
  }

  public getLast(): T | null {
    return this.tail ? this.tail.data : null;
  }

  public deleteNode(node: Node<T>): void {
    if (!node.prev) {
      this.head = node.next;
    } else {
      const prevNode = node.prev;
      if (!node.next) {
        this.tail = prevNode;
      }
      prevNode.next = node.next;
    }
    this.size -= 1;
  }

  public search(comparator: (data: T) => boolean): Node<T> | null {
    const checkNext = (node: Node<T>): Node<T> | null => {
      if (comparator(node.data)) {
        return node;
      }
      return node.next ? checkNext(node.next) : null;
    };

    return this.head ? checkNext(this.head) : null;
  }

  public toArray(): T[] {
    const array: T[] = [];
    if (!this.head) {
      return array;
    }

    const addToArray = (node: Node<T>): T[] => {
      array.push(node.data);
      return node.next ? addToArray(node.next) : array;
    };
    return addToArray(this.head);
  }

  public length(): number {
    return this.size;
  }

  public isEmpty(): boolean {
    return this.size === 0;
  }
}
