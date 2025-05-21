/**
 * Ogólna implementacja kolejki w TypeScript
 */
export class Queue<T> {
  private items: Record<number, T>;
  private front_it: number;
  private rear_it: number;

  constructor() {
    this.items = {};
    this.front_it = 0;
    this.rear_it = 0;
  }

  /**
   * Dodaje element na koniec kolejki.
   * @param item - Element, który ma być dodany do kolejki.
   */
  push(item: T): void {
    this.items[this.rear_it] = item;
    this.rear_it++;
  }

  /**
   * Usuwa i zwraca element z przodu kolejki.
   * @returns Element z przodu kolejki lub undefined, jeśli kolejka jest pusta.
   */
  pop(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    const item = this.items[this.front_it];
    delete this.items[this.front_it];
    this.front_it++;
    return item;
  }

  /**
   * Zwraca element z przodu kolejki bez usuwania go.
   * @returns Element z przodu kolejki lub undefined, jeśli kolejka jest pusta.
   */
  front(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.front_it];
  }

  /**
   * Sprawdza, czy kolejka jest pusta.
   * @returns True, jeśli kolejka jest pusta, w przeciwnym razie false.
   */
  isEmpty(): boolean {
    return this.rear_it === this.front_it;
  }

  /**
   * Zwraca liczbę elementów w kolejce.
   * @returns Rozmiar kolejki.
   */
  size(): number {
    return this.rear_it - this.front_it;
  }

  /**
   * Usuwa wszystkie elementy z kolejki.
   */
  clear(): void {
    this.items = {};
    this.front_it = 0;
    this.rear_it = 0;
  }
}
