import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

import PlayerField from "./player-field";
import ArrangeShips from "./arrange-ships";
import StatusMessage from "./status-message";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gamePhase: "not started",
      currentPlayer: 0,
      shipLocations: [[], []],
      moveStarted: false,
      turnEnded: false,
      selectedCell: null,
      missedCells: [],
      statusMessage: { message: "" },
    };
  }

  handleGameStart = () => {
    this.setState((state) => {
      const gamePhase = {
        gamePhase:
          state.gamePhase === "not started" ? "arrange" : "not started",
      };

      if (gamePhase.gamePhase === "not started") {
        gamePhase.currentPlayer = 0;
        gamePhase.shipLocations = [[], []];
      }

      return {
        ...gamePhase,
        moveStarted: false,
        turnEnded: false,
        selectedCell: null,
        missedCells: [],
      };
    });
  };

  handleAttack = () => {
    this.setState((state) => {
      if (state.selectedCell === null) return {};

      const index = state.shipLocations[state.selectedCell.id].findIndex(
        (el) =>
          el.row === state.selectedCell.cell.row &&
          el.column === state.selectedCell.cell.column
      );
      const shipLocationsCopy = [...state.shipLocations];

      if (index === -1) {
        return {
          missedCells: [
            ...state.missedCells,
            {
              row: state.selectedCell.cell.row,
              column: state.selectedCell.cell.column,
              id: state.selectedCell.id,
            },
          ],
          selectedCell: null,
          turnEnded: true,
          statusMessage: { message: "Missed" },
        };
      }
      shipLocationsCopy[state.selectedCell.id][index].isDown = true;

      if (
        shipLocationsCopy[state.selectedCell.id].filter((el) => el.isDown)
          .length === 8
      ) {
        let name = state.currentPlayer ? "2nd" : "1st";
        return {
          shipLocations: shipLocationsCopy,
          selectedCell: null,
          statusMessage: {
            message: `Killed! ${name} player won!`,
          },
          gamePhase: "game ended",
        };
      }

      return {
        shipLocations: shipLocationsCopy,
        selectedCell: null,
        statusMessage: { message: "Killed" },
      };
    });
  };

  handleConfirmClick = () => {
    if (this.state.currentPlayer === 1) {
      this.setState({
        currentPlayer: 0,
        gamePhase: "game",
        shipLocations: [
          this.state.shipLocations[0].map((el) => ({ ...el, isDown: false })),
          this.state.shipLocations[1].map((el) => ({ ...el, isDown: false })),
        ],
      });
    } else this.setState({ currentPlayer: 1 });
  };

  handleShipPlacement = (cell, id) => {
    this.setState((state) => {
      const index = state.shipLocations[id].findIndex(
        (el) => el.row === cell.row && el.column === cell.column
      );
      const shipLocationsCopy = [...state.shipLocations];

      if (index === -1) shipLocationsCopy[id].push(cell);
      else shipLocationsCopy[id].splice(index, 1);

      return { shipLocations: shipLocationsCopy };
    });
  };

  handleStartmove = () => {
    this.setState({ moveStarted: true });
  };

  handleEndTurn = () => {
    this.setState((state) => ({
      currentPlayer: state.currentPlayer ? 0 : 1,
      moveStarted: false,
      turnEnded: false,
      statusMessage: { message: "" },
    }));
  };

  handleSelect = (cell, id) => {
    this.setState((state) => {
      if (
        state.selectedCell?.cell.row === cell.row &&
        state.selectedCell.cell.column === cell.column
      )
        return { selectedCell: null };

      return { selectedCell: { cell, id } };
    });
  };

  render() {
    return (
      <div className="main-bg-image">
        <div
          className="game-board"
          style={{
            backdropFilter:
              this.state.gamePhase !== "not started" ? "blur(3px)" : "",
          }}
        >
          <button
            name="button"
            onClick={this.handleGameStart}
            className={
              this.state.gamePhase !== "not started"
                ? "button-secondary"
                : "button-larger"
            }
          >
            {this.state.gamePhase !== "not started"
              ? "Reset"
              : "Start a new game"}
          </button>

          {this.state.gamePhase === "game" ||
          this.state.gamePhase === "game ended" ? (
            <>
              {gamePhaseMenu(this)}
              {this.state.moveStarted && (
                <div className="player-fields">
                  <PlayerField
                    id={0}
                    handleSelect={this.handleSelect}
                    currentPlayer={this.state.currentPlayer}
                    shipLocations={this.state.shipLocations[0]}
                    selectedCell={this.state.selectedCell}
                    missedCells={this.state.missedCells}
                    turnEnded={this.state.turnEnded}
                    gamePhase={this.state.gamePhase}
                  />
                  <br />
                  <PlayerField
                    id={1}
                    handleSelect={this.handleSelect}
                    currentPlayer={this.state.currentPlayer}
                    shipLocations={this.state.shipLocations[1]}
                    selectedCell={this.state.selectedCell}
                    missedCells={this.state.missedCells}
                    turnEnded={this.state.turnEnded}
                    gamePhase={this.state.gamePhase}
                  />
                </div>
              )}
            </>
          ) : (
            this.state.gamePhase === "arrange" && (
              <>
                {arrangeShipsPhaseMenu(this)}

                <ArrangeShips
                  id={this.state.currentPlayer}
                  handleConfirmClick={this.handleConfirmClick}
                  shipLocations={
                    this.state.shipLocations[this.state.currentPlayer]
                  }
                  handleShipPlacement={this.handleShipPlacement}
                />
              </>
            )
          )}
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

function gamePhaseMenu(component) {
  return (
    <div className="menu">
      <div className="control-panel">
        <h4 className="whose-turn-header">{hoppingTitle(component)}</h4>
        <p className="game-phase-instruction">Destroy your enemy ships!</p>
        {!component.state.moveStarted && (
          <>
            <p className="game-phase-instruction">Are you ready?</p>
            <button name="button" onClick={component.handleStartmove}>
              Start move
            </button>
          </>
        )}

        {component.state.moveStarted && (
          <>
            <button
              name="button"
              onClick={component.handleAttack}
              disabled={!component.state.selectedCell}
            >
              Attack
            </button>

            <button
              name="button"
              onClick={component.handleEndTurn}
              disabled={!component.state.turnEnded}
            >
              End turn
            </button>
          </>
        )}
      </div>

      <div className="result-box">
        <StatusMessage message={component.state.statusMessage} />
      </div>
    </div>
  );
}

function arrangeShipsPhaseMenu(component) {
  return (
    <div className="menu">
      <div className="control-panel">
        <h4 className="whose-turn-header">{hoppingTitle(component)}</h4>
        <p className="game-phase-instruction">Place your ships</p>
        <button
          disabled={
            component.state.shipLocations[component.state.currentPlayer]
              .length !== 8
          }
          name="button"
          onClick={component.handleConfirmClick}
        >
          Confirm
        </button>
        <p className="message">Each player must have exactly 8 ships</p>
      </div>
    </div>
  );
}

function hoppingTitle(component) {
  return (
    <>
      {component.state.currentPlayer ? (
        <span key={"0" + component.state.currentPlayer} className="hop hop-0">
          <span className="text-underline">2</span>
          <sup>nd</sup>
        </span>
      ) : (
        <span key={"0" + component.state.currentPlayer} className="hop hop-0">
          <span className="text-underline">1</span>
          <sup>st</sup>
        </span>
      )}
      &nbsp;
      <span key={"1" + component.state.currentPlayer} className="hop hop-1">
        p
      </span>
      <span key={"2" + component.state.currentPlayer} className="hop hop-2">
        l
      </span>
      <span key={"3" + component.state.currentPlayer} className="hop hop-3">
        a
      </span>
      <span key={"4" + component.state.currentPlayer} className="hop hop-4">
        y
      </span>
      <span key={"5" + component.state.currentPlayer} className="hop hop-5">
        e
      </span>
      <span key={"6" + component.state.currentPlayer} className="hop hop-6">
        r
      </span>
      <span key={"7" + component.state.currentPlayer} className="hop hop-7">
        's
      </span>
      &nbsp;
      <span key={"8" + component.state.currentPlayer} className="hop hop-8">
        t
      </span>
      <span key={"9" + component.state.currentPlayer} className="hop hop-9">
        u
      </span>
      <span key={"10" + component.state.currentPlayer} className="hop hop-10">
        r
      </span>
      <span key={"11" + component.state.currentPlayer} className="hop hop-11">
        n!
      </span>
    </>
  );
}
