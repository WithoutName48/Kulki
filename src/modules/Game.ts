import { Ball } from "./Ball";
import { PathFinding } from "./PathFinding";

enum GameState {
  noneMarked = 0,
  oneMarked,
  twoMarked,
}

/**
 * Klasa implementująca mechanike gry
 */
export class Game {
  private board: number[][];
  private readonly board_size: IBoardSize;
  private readonly tile_size: number;
  private readonly ballColors: string[] = [
    "red",
    "blue",
    "yellow",
    "green",
    "black",
    "white",
    "pink",
  ];
  private boardObjects: Map<number, IFigure> = new Map<number, IFigure>();
  private gameSettings = {
    PREVIEW_BALLS_COUNT: 3,
    MIN_BALLS_COUNT_POINT: 5,
  };
  public points: number = 0;
  public cnt_number_of_moves: number = 0;

  /**
   * Konstruktor
   * @param rows - liczba wierszy planszy
   * @param cols - liczba kolumn planszy
   * @param tile_size - rozmiar boku kwadratowego pola w pikselach (px)
   */
  constructor(rows: number, cols: number, tile_size: number) {
    this.board_size = {
      rows: rows,
      cols: cols,
    };
    this.tile_size = tile_size;

    // Board initialization
    this.board = [];
    for (let row: number = 0; row < this.board_size.rows; row++) {
      this.board[row] = [];
      for (let col: number = 0; col < this.board_size.cols; col++) {
        this.board[row].push(null);
      }
    }

    this.createHTML();

    this.startGame();
  }

  /**
   * Generuje HTML dla planszy i gabloty podglądu
   */
  private createHTML(): void {
    const divContainer: HTMLDivElement = document.querySelector(
      ".container"
    ) as HTMLDivElement;
    divContainer.style.height = "fit-content";
    divContainer.style.width = "fit-content";
    divContainer.style.display = "flex";
    divContainer.style.flexWrap = "wrap";

    const divPreviewContainer: HTMLDivElement = document.createElement(
      "div"
    ) as HTMLDivElement;
    divPreviewContainer.innerHTML = `<p style="font-size: 20px; margin-bottom: 5px">Następne: </p>`;
    divPreviewContainer.style.width = "fit-content";
    divPreviewContainer.style.padding = "10px";

    const divPreview: HTMLDivElement = document.createElement(
      "div"
    ) as HTMLDivElement;
    divPreview.setAttribute("id", "preview-div");
    divPreview.style.height = `${this.tile_size}px`;
    divPreview.style.display = "grid";
    divPreview.style.gridTemplate = `1fr / repeat(${this.gameSettings.PREVIEW_BALLS_COUNT}, ${this.tile_size}px)`;
    divPreview.style.alignItems = "center";
    divPreview.style.justifyItems = "center";

    divPreviewContainer.appendChild(divPreview);

    divPreviewContainer.innerHTML += `<p id="points" style="font-size: 20px; margin-top: 5px">Punkty: ${this.points}</p>`;

    const divBoard: HTMLDivElement = document.createElement(
      "div"
    ) as HTMLDivElement;
    divBoard.style.display = "grid";
    divBoard.style.gridTemplate = `repeat(${this.board_size.rows}, 1fr) / repeat(${this.board_size.cols}, 1fr)`;
    divBoard.style.height = "fit-content";
    divBoard.style.width = "fit-content";
    divBoard.style.padding = "10px";
    divBoard.style.cursor = "pointer";

    for (let row: number = 0; row < this.board_size.rows; row++) {
      for (let col: number = 0; col < this.board_size.cols; col++) {
        let divTile = document.createElement("div");

        divTile.style.height = `${this.tile_size}px`;
        divTile.style.width = `${this.tile_size}px`;
        divTile.style.border = `1px solid black`;
        divTile.style.display = "flex";
        divTile.style.justifyContent = "center";
        divTile.style.alignItems = "center";
        divTile.setAttribute("id", `tile-${row}-${col}`);

        divBoard.appendChild(divTile);
      }
    }

    divContainer.appendChild(divPreviewContainer);
    divContainer.appendChild(divBoard);
  }

  private startGame(): void {
    let previewBalls: number[] = [];
    let nextId: number = 0;

    let gameState: GameState = GameState.noneMarked;

    type Path = {
      A: ICords;
      B: ICords;
    };

    let path: Path = { A: null, B: null };
    let canMove: boolean = false;
    let blockedMoves: boolean = false;

    const endGame = async () => {
      for (let row: number = 0; row < this.board_size.rows; row++) {
        for (let col: number = 0; col < this.board_size.cols; col++) {
          const divTile: HTMLDivElement = document.getElementById(
            `tile-${row}-${col}`
          ) as HTMLDivElement;
          divTile.removeEventListener("mouseenter", HoverHandler);
          divTile.removeEventListener("click", ClickHandler);

          if (this.board[row][col] != null) {
            const divBall: HTMLDivElement = document.getElementById(
              `ball-${row}-${col}`
            ) as HTMLDivElement;
            divBall.removeEventListener("click", ClickHandler);
          }
        }
      }

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 750);
      });

      alert(
        `KONIEC GRY!!!\n  Twoje punkty: ${this.points}\n  Liczba ruchów, które wykonałeś: ${this.cnt_number_of_moves}\nJeżeli chesz zagrać ponownie to odśwież strone.`
      );
    };

    const ClickHandler = async (event: Event) => {
      event.stopPropagation();

      if (blockedMoves) return true;

      const target: HTMLDivElement = event.target as HTMLDivElement;
      const idHTML: string = target.id;
      const pos: ICords = {
        row: Number(idHTML.split("-")[1]),
        col: Number(idHTML.split("-")[2]),
      };

      if (path.A != null && path.A.row == pos.row && path.A.col == pos.col) {
        // Unmarked ball
        gameState = GameState.noneMarked;

        this.boardObjects.get(this.board[path.A.row][path.A.col]).marked =
          false;

        path = { A: null, B: null };
      } else if (idHTML.split("-")[0] == "ball") {
        // Ball was clicked
        if (
          gameState == GameState.noneMarked ||
          gameState == GameState.oneMarked
        ) {
          // Reset last ball larger size
          if (path.A != null) {
            this.boardObjects.get(this.board[path.A.row][path.A.col]).marked =
              false;
          }

          path.A = pos;
          gameState = GameState.oneMarked;
          this.boardObjects.get(this.board[pos.row][pos.col]).marked = true;
        }
      } else if (idHTML.split("-")[0] == "tile") {
        // Tile was clicked
        if (gameState == GameState.oneMarked && canMove) {
          // can move ball
          path.B = pos;
          gameState = GameState.twoMarked;
          this.boardObjects.get(this.board[path.A.row][path.A.col]).marked =
            false;

          this.cnt_number_of_moves++;

          const ballMarked: Ball = this.boardObjects.get(
            this.board[path.A.row][path.A.col]
          ) as Ball;

          ballMarked.clearHTMLBoard();

          // updating ball's pos, board
          ballMarked.pos = path.B;
          this.board[path.B.row][path.B.col] =
            this.board[path.A.row][path.A.col];
          this.board[path.A.row][path.A.col] = null;

          ballMarked.drawHTMLBoard();

          await new Promise<void>((resolve) => {
            blockedMoves = true;
            for (let row: number = 0; row < this.board_size.rows; row++) {
              for (let col: number = 0; col < this.board_size.cols; col++) {
                const divTile: HTMLDivElement = document.getElementById(
                  `tile-${row}-${col}`
                ) as HTMLDivElement;
                if (divTile.style.backgroundColor == "red")
                  divTile.style.backgroundColor = "gray";
              }
            }
            setTimeout(() => {
              blockedMoves = false;
              resolve();
            }, 1000);
          }).then(() => {
            // Reset marked path
            for (let row: number = 0; row < this.board_size.rows; row++) {
              for (let col: number = 0; col < this.board_size.cols; col++) {
                const divTile: HTMLDivElement = document.getElementById(
                  `tile-${row}-${col}`
                ) as HTMLDivElement;
                divTile.style.backgroundColor = "white";
              }
            }
          });

          // Check for points
          let gotPoints: boolean = this.checkPoints(path.B);

          // After not getting points or no left balls on board
          if (!gotPoints || this.boardObjects.size == 0) {
            // Check if end
            if (
              this.board_size.rows * this.board_size.cols <=
              this.boardObjects.size
            ) {
              endGame();
              return;
            }

            // Add balls from preview to board
            previewBalls.forEach((val, indx) => {
              let newBall: IFigure = this.boardObjects.get(val);

              // new position, because old one is taken
              if (this.board[newBall.pos.row][newBall.pos.col] != null)
                newBall.generatePosition(this.board);
              this.board[newBall.pos.row][newBall.pos.col] = val;

              newBall.drawHTMLBoard();

              document
                .getElementById(`${newBall.idHTML}`)
                .addEventListener("click", ClickHandler);

              // check for points
              this.checkPoints(newBall.pos);
            });

            previewBalls = [];
            const divPreview: HTMLDivElement = document.getElementById(
              "preview-div"
            ) as HTMLDivElement;
            divPreview.innerHTML = "";

            // Generate new balls for preview
            for (let i = 0; i < this.gameSettings.PREVIEW_BALLS_COUNT; i++) {
              let newBall: Ball = new Ball(this.ballColors, this.board);

              this.boardObjects.set(nextId, newBall);
              previewBalls.push(nextId);

              newBall.drawHTMLPreview();

              nextId++;
            }
          }

          // Update points
          const divPoints: HTMLDivElement = document.getElementById(
            "points"
          ) as HTMLDivElement;
          divPoints.innerHTML = `Punkty: ${this.points}`;

          gameState = GameState.noneMarked;
          path = { A: null, B: null };
        }
      }

      this.render();
    };

    const HoverHandler = (event: Event) => {
      if (blockedMoves || gameState != GameState.oneMarked) return;

      const target: HTMLDivElement = event.target as HTMLDivElement;
      const idHTML: string = target.id;
      const pos: ICords = {
        row: Number(idHTML.split("-")[1]),
        col: Number(idHTML.split("-")[2]),
      };

      canMove = PathFinding.BFS(path.A, pos, this.board);
    };

    // Initial balls
    for (let i = 0; i < this.gameSettings.PREVIEW_BALLS_COUNT; i++) {
      let newBall: Ball = new Ball(this.ballColors, this.board);

      this.boardObjects.set(nextId, newBall);
      this.board[newBall.pos.row][newBall.pos.col] = nextId;

      newBall.drawHTMLBoard();

      document
        .getElementById(`${newBall.idHTML}`)
        .addEventListener("click", ClickHandler);

      nextId++;
    }

    // Initial preview
    for (let i = 0; i < this.gameSettings.PREVIEW_BALLS_COUNT; i++) {
      let newBall: Ball = new Ball(this.ballColors, this.board);

      this.boardObjects.set(nextId, newBall);
      previewBalls.push(nextId);

      newBall.drawHTMLPreview();

      nextId++;
    }

    // Adding EventListeners to all tiles
    for (let row: number = 0; row < this.board_size.rows; row++) {
      for (let col: number = 0; col < this.board_size.cols; col++) {
        document
          .getElementById(`tile-${row}-${col}`)
          .addEventListener("mouseenter", HoverHandler);

        document
          .getElementById(`tile-${row}-${col}`)
          .addEventListener("click", ClickHandler);
      }
    }
  }

  /**
   * Sprawdza czy doszło do jakiegoś zbicia
   * @param pos - pozycja, na której pojawiła się kulka
   * @returns boolean czy dodano jakieś punkty
   */
  private checkPoints(pos: ICords): boolean {
    let addedPoints: boolean = false;
    let ballsToRemove: ICords[] = [];

    let color: string = this.boardObjects.get(
      this.board[pos.row][pos.col]
    ).color;

    type IncrementLine = {
      row_inc: number;
      col_inc: number;
    };

    const checkLine = (inc1: IncrementLine, inc2: IncrementLine) => {
      ballsToRemove = [];

      // First direction
      let row: number = pos.row + inc1.row_inc;
      let col: number = pos.col + inc1.col_inc;
      let direction1: number = 0;
      while (
        row < this.board_size.rows &&
        col < this.board_size.cols &&
        row >= 0 &&
        col >= 0
      ) {
        if (
          this.board[row][col] == null ||
          color != this.boardObjects.get(this.board[row][col]).color
        )
          break;
        direction1++;
        ballsToRemove.push({ row: row, col: col });
        row += inc1.row_inc;
        col += inc1.col_inc;
      }

      // Second direction
      row = pos.row + inc2.row_inc;
      col = pos.col + inc2.col_inc;
      let direction2: number = 0;
      while (
        row < this.board_size.rows &&
        col < this.board_size.cols &&
        row >= 0 &&
        col >= 0
      ) {
        if (
          this.board[row][col] == null ||
          color != this.boardObjects.get(this.board[row][col]).color
        )
          break;
        direction2++;
        ballsToRemove.push({ row: row, col: col });
        row += inc2.row_inc;
        col += inc2.col_inc;
      }

      if (
        this.gameSettings.MIN_BALLS_COUNT_POINT <=
        direction1 + direction2 + 1
      ) {
        ballsToRemove.forEach((val: ICords, indx: number) => {
          this.boardObjects.delete(this.board[val.row][val.col]);
          this.board[val.row][val.col] = null;
        });
        this.points += direction1 + direction2;
        addedPoints = true;
      }
    };

    checkLine({ row_inc: 0, col_inc: 1 }, { row_inc: 0, col_inc: -1 });
    checkLine({ row_inc: 1, col_inc: 0 }, { row_inc: -1, col_inc: 0 });
    checkLine({ row_inc: 1, col_inc: 1 }, { row_inc: -1, col_inc: -1 });
    checkLine({ row_inc: 1, col_inc: -1 }, { row_inc: -1, col_inc: 1 });

    if (addedPoints) {
      this.boardObjects.delete(this.board[pos.row][pos.col]);
      this.board[pos.row][pos.col] = null;
      this.points++;
    }

    return addedPoints;
  }

  /**
   * Renderuje HTML na podstawie tablicy gry
   */
  private render(): void {
    for (let row: number = 0; row < this.board_size.rows; row++) {
      for (let col: number = 0; col < this.board_size.cols; col++) {
        if (this.board[row][col] == null) {
          const tileDiv: HTMLDivElement = document.getElementById(
            `tile-${row}-${col}`
          ) as HTMLDivElement;

          tileDiv.innerHTML = "";
        } else {
          this.boardObjects.get(this.board[row][col]).drawHTMLBoard();
        }
      }
    }
  }
}
