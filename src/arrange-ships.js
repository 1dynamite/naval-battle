import React from "react";

import "./styles.css";

class Square extends React.Component {
  handleShipPlacement = () => {
    this.props.handleShipPlacement(this.props.cell);
  };
  render() {
    return (
      <div onClick={this.handleShipPlacement} className={"square"}>
        {this.props.hasShip && <div className="ship" />}
      </div>
    );
  }
}

export default class ArrangeShips extends React.Component {
  handleShipPlacement = (cell) => {
    this.props.handleShipPlacement(cell, this.props.id);
  };

  render() {
    return (
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
                    cell={{ row, column }}
                    handleShipPlacement={this.handleShipPlacement}
                    hasShip={
                      this.props.shipLocations.findIndex(
                        (el) => el.row === row && el.column === column
                      ) !== -1
                    }
                  />
                ))}
            </div>
          ))}
      </div>
    );
  }
}
