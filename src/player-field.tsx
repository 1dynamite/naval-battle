import React from "react";

import "./styles.css";

import { PlayerFieldPropsType, GamePhaseSquarePropsType, Cell } from "./types";

class Square extends React.Component<GamePhaseSquarePropsType> {
  handleSelect = () => {
    this.props.handleSelect(this.props.cell);
  };

  selectClassName = () => {
    let className = "square";

    if (
      this.props.selectedCell &&
      this.props.selectedCell.id === this.props.id &&
      this.props.selectedCell.cell.row === this.props.cell.row &&
      this.props.selectedCell.cell.column === this.props.cell.column
    )
      className += " selected-cell";

    if (
      this.props.missedCell &&
      this.props.missedCell.id !== this.props.currentPlayer
    ) {
      className += " ship-miss";
    }

    if (this.props.id !== this.props.currentPlayer && !this.props.ship?.isDown)
      className += " enemy-cell";

    return className;
  };

  selectClassNameForInnerDiv = () => {
    let className = "";
    if (this.props.ship) {
      if (this.props.ship.isDown) className += "ship-down";
      else if (this.props.currentPlayer === this.props.id) {
        className += "ship";
      }
    }

    return className;
  };

  render() {
    return (
      <div
        onClick={
          this.props.currentPlayer === this.props.id ||
          this.props.missedCell ||
          this.props.ship?.isDown ||
          this.props.turnEnded ||
          this.props.gameEnded
            ? undefined
            : this.handleSelect
        }
        className={this.selectClassName()}
      >
        <div className={this.selectClassNameForInnerDiv()}>
          <div
            className={
              this.selectClassNameForInnerDiv() === "ship-down" ? "smoke" : ""
            }
          />
        </div>
      </div>
    );
  }
}

export default class PlayerField extends React.Component<PlayerFieldPropsType> {
  handleSelect = (cell: Cell) => {
    this.props.handleSelect(cell, this.props.id);
  };

  render() {
    return (
      <div>
        {this.props.currentPlayer === this.props.id ? (
          <></>
        ) : (
          <p className="enemy-field-text">Enemy field</p>
        )}
        <div className="field">
          <div className="ocean-field"></div>
          {Array(5)
            .fill(0)
            .map((el, row) => (
              <div className="row" key={row}>
                {Array(5)
                  .fill(0)
                  .map((el, column) => (
                    <Square
                      key={column}
                      id={this.props.id}
                      cell={{ row, column }}
                      ship={this.props.shipLocations.find(
                        (el) => el.row === row && el.column === column
                      )}
                      handleSelect={this.handleSelect}
                      currentPlayer={this.props.currentPlayer}
                      selectedCell={this.props.selectedCell}
                      missedCell={this.props.missedCells.find(
                        (el) =>
                          el.id === this.props.id &&
                          el.column === column &&
                          el.row === row
                      )}
                      turnEnded={this.props.turnEnded}
                      gameEnded={this.props.gamePhase === "game ended"}
                    />
                  ))}
              </div>
            ))}
        </div>
      </div>
    );
  }
}
