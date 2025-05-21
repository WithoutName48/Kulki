/**
 * Interfejs dla koordynatów
 */
interface ICords {
  row: number;
  col: number;
}

/**
 * Interfejs dla rozmiarów planszy
 */
interface IBoardSize {
  rows: number;
  cols: number;
}

/**
 * Interfejs dla obiektów możliwych do umieszczenia na planszy
 */
interface IFigure {
  pos: ICords;
  board_size: IBoardSize;
  color: string;
  idHTML: string;
  marked: boolean;
  generateColor: (color_pool: string[]) => void;
  generatePosition: (board: number[][]) => void;
  drawHTMLPreview: () => void;
  drawHTMLBoard: () => void;
  clearHTMLBoard: () => void;
}
