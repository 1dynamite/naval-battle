export interface Cell {
  row: number;
  column: number;
}

type GamePhase = "not started" | "arrange" | "game ended" | "game";

interface ShipLocation {
  isDown: undefined | boolean;
  row: number;
  column: number;
}

type SelectedCell = null | { cell: Cell; id: 0 | 1 };

type MissedCell = { row: number; column: number; id: 0 | 1 };

export type ShipLocations = ShipLocation[];

export default interface IState {
  gamePhase: GamePhase;
  currentPlayer: 0 | 1;
  shipLocations: [ShipLocations, ShipLocations];
  moveStarted: boolean;
  turnEnded: boolean;
  selectedCell: SelectedCell;
  missedCells: MissedCell[];
  statusMessage: { message: string };
}

export interface GamePhaseSquarePropsType {
  id: 0 | 1;
  cell: Cell;
  ship: ShipLocation | undefined;
  handleSelect: (cell: { row: number; column: number }) => void;
  currentPlayer: 0 | 1;
  selectedCell: SelectedCell;
  missedCell: MissedCell | undefined;
  turnEnded: boolean;
  gameEnded: boolean;
}

export interface PlayerFieldPropsType {
  id: 0 | 1;
  handleSelect: (cell: { row: number; column: number }, id: 0 | 1) => void;
  currentPlayer: 0 | 1;
  shipLocations: ShipLocations;
  selectedCell: null | { cell: { row: number; column: number }; id: 0 | 1 };
  missedCells: MissedCell[];
  turnEnded: boolean;
  gamePhase: GamePhase;
}

export interface ArrangeShipsPropsType {
  id: 0 | 1;
  shipLocations: ShipLocations;
  handleShipPlacement: (cell: Cell, id: 0 | 1) => void;
  handleConfirmClick: () => void;
}

export interface ArrangePhaseSquarePropsType {
  key: number;
  cell: Cell;
  handleShipPlacement: (cell: Cell) => void;
  hasShip: boolean;
}
