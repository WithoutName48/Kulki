/**
 * Klasa implementująca kulke
 */
export class Ball implements IFigure {
  public pos: ICords = null;
  public board_size: IBoardSize = null;
  public color: string = null;
  public idHTML: string = null;
  public marked: boolean = false;

  /**
   * Konstruktor
   * @param color_pool - tablica z nazwami kolorów
   * @param board - tablica gry
   */
  constructor(color_pool: string[], board: number[][]) {
    this.board_size = {
      rows: board.length,
      cols: board[0].length,
    };

    this.generateColor(color_pool);
    this.generatePosition(board);
  }

  /**
   * Generuje kolor dla kulki
   * @param color_pool - tablica z nazwami kolorów
   */
  public generateColor(color_pool: string[]): void {
    const randomNumber = (min: number, max: number): number => {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };

    this.color = color_pool[randomNumber(0, color_pool.length - 1)];
  }

  /**
   * Generuje pozycje na tablicy gry dla kulki
   * @param board - tablica gry
   */
  public generatePosition(board: number[][]): void {
    const randomNumber = (min: number, max: number): number => {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const availablePositions: Set<ICords> = new Set<ICords>();

    for (let row: number = 0; row < board.length; row++) {
      for (let col: number = 0; col < board[0].length; col++) {
        if (board[row][col] == null) {
          availablePositions.add({ row: row, col: col });
        }
      }
    }

    this.pos = [...availablePositions].at(
      randomNumber(0, availablePositions.size - 1)
    );
  }

  /**
   * Dodaje do gabloty podglądu kulke jako nowy div w HTML
   */
  public drawHTMLPreview(): void {
    const divPreview: HTMLDivElement = document.getElementById(
      "preview-div"
    ) as HTMLDivElement;

    const divBall: HTMLDivElement = document.createElement(
      "div"
    ) as HTMLDivElement;

    divBall.style.backgroundColor = this.color;
    divBall.style.width = "75%";
    divBall.style.height = "75%";
    divBall.style.border = "2px solid black";
    divBall.style.borderRadius = "50%";

    divPreview.appendChild(divBall);
  }

  /**
   * Dodaje do planszy kulke jako nowy div w HTML
   */
  public drawHTMLBoard(): void {
    this.idHTML = `ball-${this.pos.row}-${this.pos.col}`;

    const divTile: HTMLDivElement = document.getElementById(
      `tile-${this.pos.row}-${this.pos.col}`
    ) as HTMLDivElement;

    divTile.innerHTML = "";

    const divBall: HTMLDivElement = document.createElement(
      "div"
    ) as HTMLDivElement;

    divBall.setAttribute("id", this.idHTML);

    divBall.style.backgroundColor = this.color;
    divBall.style.width = this.marked ? "95%" : "75%";
    divBall.style.height = this.marked ? "95%" : "75%";
    divBall.style.border = "2px solid black";
    divBall.style.borderRadius = "50%";

    divTile.appendChild(divBall);
  }

  /**
   * Usuwa z planszy kulke usuwają div w HTML
   */
  public clearHTMLBoard(): void {
    const divTile: HTMLDivElement = document.getElementById(
      `tile-${this.pos.row}-${this.pos.col}`
    ) as HTMLDivElement;

    divTile.innerHTML = "";
  }
}
