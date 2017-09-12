import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Button(props) {
  return (
    <button className={props.name} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, j) {
    return (
      <Button
        name={"square"}
        value={this.props.squares[i][j]}
        onClick={() => this.props.onClick(i, j)}
      />
    );
  }

  renderLine(i) {
    var squares = [];
    for (var j = 0; j < 3; j++) {
      squares.push(this.renderSquare(i,j));
    }

    return (
      <div className="board-row">
        {squares}
      </div>
    )
  }

  render() {
    let completeBoard = [];
    for (let i = 0; i < 3; i++) {
      completeBoard.push(this.renderLine(i));
    }

    return (
      <div>
        {completeBoard}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: [
          Array(3).fill(null),
          Array(3).fill(null),
          Array(3).fill(null),
        ],
      }],
      stepNumber: 0,
      xIsNext: true,
      reverseMoves: false,
    };
}

render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      let zeroedMove = move ? move : 0;
      if (this.state.reverseMoves)
        zeroedMove = history.length - zeroedMove - 1;
      const textStyle = {
        'font-weight': (zeroedMove === this.state.stepNumber ? 'bold' : 'normal'),
      };
        const desc = zeroedMove != 0 ?
        'Move# ' + zeroedMove :
        'Game start';
      return (
        <li key={zeroedMove}>
          <a
            style={textStyle}
            href="#"
            onClick={() => this.jumpTo(zeroedMove)}>
              {desc}</a>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i, j) => this.handleClick(i, j)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <Button
              name={"rectangle"}
              value={"Reverse Moves"}
              onClick={() => this.toggleMoveOrder()}
            />
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }

  handleClick(i, j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = JSON.parse(JSON.stringify(current.squares));
    if (calculateWinner(squares) || squares[i][j]) {
      return;
    }
    squares[i][j] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  toggleMoveOrder() {
    this.setState({
      reverseMoves: !this.state.reverseMoves,
    });
  }
}

function calculateWinner(squares) {
  const lines = [
    [[0,0], [0,1], [0,2]],
    [[1,0], [1,1], [1,2]],
    [[2,0], [2,1], [2,2]],
    [[0,0], [1,0], [2,0]],
    [[0,1], [1,1], [2,1]],
    [[0,2], [1,2], [2,2]],
    [[0,0], [1,1], [2,2]],
    [[2,0], [1,1], [0,2]],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a[0]][a[1]] && squares[a[0]][a[1]] === squares[b[0]][b[1]] && squares[a[0]][a[1]] === squares[c[0]][c[1]]) {
      return squares[a[0]][a[1]];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
