import { Queue } from "./Data Structures/Queue";

/**
 * Klasa dostarczjąca różne algorytmy wyszukujące najkrótszą dostępną ścieżkę między dwoma punktami
 */
export class PathFinding {
  static INF: number = 1e9 + 33;

  /**
   *
   * @param A - koordynaty startu ścieżki
   * @param B - koordynaty końca ścieżki
   * @param board - tablica, na której ma się odbyć znalezienie ścieżki
   * @returns boolean czy ścieżka istnieje
   */
  static BFS(A: ICords, B: ICords, board: number[][]): boolean {
    for (let row: number = 0; row < board.length; row++) {
      for (let col: number = 0; col < board[row].length; col++) {
        const divTile: HTMLDivElement = document.getElementById(
          `tile-${row}-${col}`
        ) as HTMLDivElement;
        divTile.style.backgroundColor = "white";
      }
    }

    if (A.row == B.row && A.col == B.col) return false;

    let dist: number[][] = [];
    for (let row: number = 0; row < board.length; row++) {
      dist.push([]);
      for (let col: number = 0; col < board[row].length; col++) {
        dist[row].push(this.INF);
      }
    }

    const delta: ICords[] = [
      { row: 0, col: 1 },
      { row: 0, col: -1 },
      { row: 1, col: 0 },
      { row: -1, col: 0 },
    ];

    let queue: Queue<[number, ICords]> = new Queue<[number, ICords]>();
    queue.push([0, A]);
    dist[A.row][A.col] = 0;
    while (!queue.isEmpty()) {
      let front: [number, ICords] = queue.pop();

      if (dist[front[1].row][front[1].col] < front[0]) continue;

      delta.forEach((val, indx) => {
        let new_row: number = front[1].row + val.row;
        let new_col: number = front[1].col + val.col;

        if (
          new_row >= 0 &&
          new_col >= 0 &&
          new_row < board.length &&
          new_col < board[0].length &&
          dist[new_row][new_col] > front[0] + 1 &&
          board[new_row][new_col] == null
        ) {
          dist[new_row][new_col] = front[0] + 1;
          queue.push([front[0] + 1, { row: new_row, col: new_col }]);
        }
      });
    }

    if (dist[B.row][B.col] == this.INF) return false;

    let pos: ICords = B;
    while (pos.row != A.row || pos.col != A.col) {
      delta.forEach((val, indx) => {
        let new_row: number = pos.row + val.row;
        let new_col: number = pos.col + val.col;

        if (
          new_row >= 0 &&
          new_col >= 0 &&
          new_row < board.length &&
          new_col < board[0].length &&
          dist[new_row][new_col] < dist[pos.row][pos.col]
        ) {
          const divTile: HTMLDivElement = document.getElementById(
            `tile-${pos.row}-${pos.col}`
          ) as HTMLDivElement;
          divTile.style.backgroundColor = "red";

          pos = { row: new_row, col: new_col };
        }
      });
    }

    const divTile: HTMLDivElement = document.getElementById(
      `tile-${pos.row}-${pos.col}`
    ) as HTMLDivElement;
    divTile.style.backgroundColor = "red";

    return true;
  }
}
