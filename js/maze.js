class Maze {
    constructor(mazeText) {
      const mazeRows = mazeText.split("\n");
      this.width = mazeRows[0].length;
      this.height = mazeRows.length;
      this.cells = [];
      this.solution = null;
  
      this.mazeElement = document.getElementById("game");
      this.mazeElement.style.width = `${22 * this.width + 2}px`;
      this.mazeElement.style.height = `${22 * this.height + 2}px`;
      this.mazeElement.style.gridTemplateRows = `repeat(${this.height}, 1fr)`;
      this.mazeElement.style.gridTemplateColumns = `repeat(${this.width}, 1fr)`;
  
      this.walls = []; // Ma trận boolean (true = tường, false = ô trống)
      for (let i = 0; i < this.height; i++) {
        const row = [];
        for (let j = 0; j < this.width; j++) {
          const cellIndex = i * this.width + j;
          switch (mazeRows[i][j]) {
            case "A":
              this.start = { i, j }; // Node bắt đầu
              this.mazeElement.insertAdjacentHTML(
                "beforeend",
                '<div class="start"></div>'
              );
              row.push(false);
              break;
            case "B":
              this.goal = { i, j };// Node đích
              this.mazeElement.insertAdjacentHTML(
                "beforeend",
                '<div class="goal"></div>'
              );
              row.push(false);
              break;
            case " ":
              this.mazeElement.insertAdjacentHTML(
                "beforeend",
                '<div class="space"></div>'
              );
              row.push(false);  // Node có thể di chuyển qua
              break;
            default:
              this.mazeElement.insertAdjacentHTML(
                "beforeend",
                '<div class="wall"></div>'
              );
              row.push(true); // Node tường (#)
          }
          this.cells.push({ i, j });
        }
        this.walls.push(row);
      }
    }
    
    heuristic(state) {
      return (
        Math.abs(state.i - this.goal.i) + Math.abs(state.j - this.goal.j)
      );
    }
  
    getNeighbors(state) {
      const { i, j } = state;
      const neighbors = [];
  
      const directions = [
        { i: i - 1, j },
        { i: i + 1, j },
        { i, j: j - 1 },
        { i, j: j + 1 },
      ];
  
      for (const dir of directions) {
        if (
          dir.i >= 0 &&
          dir.i < this.height &&
          dir.j >= 0 &&
          dir.j < this.width &&
          !this.walls[dir.i][dir.j]
        ) {
          neighbors.push(dir);
        }
      }
  
      return neighbors;
    }
  
    areStatesEqual(stateA, stateB) {
      return stateA.i === stateB.i && stateA.j === stateB.j;
    }
  
    async visualizePath(path) {
      if (!path || path.length === 0) return;
  
      for (let i = 0; i < path.length; i++) {
        const state = path[i];
        const cellIndex = state.i * this.width + state.j;
        this.mazeElement.children[cellIndex].className = "path";
        await wait(animationSpeed);
      }
  
      updateStats(
        document.getElementById("algorithm-name").textContent,
        "Solved",
        document.getElementById("explored-count").textContent,
        path.length,
        document.getElementById("time-taken").textContent
      );
    }
  
    clearVisualization() {
      for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
          const cellIndex = i * this.width + j;
          const cell = this.mazeElement.children[cellIndex];
  
          if (this.areStatesEqual({ i, j }, this.start)) {
            cell.className = "start";
          } else if (this.areStatesEqual({ i, j }, this.goal)) {
            cell.className = "goal";
          } else if (!this.walls[i][j]) {
            cell.className = "space";
          }
        }
      }
    }
  }

  async function clearAndSolve(algorithm) {
    if (isSolving) return;

    isSolving = true;
    updateStats(algorithm, "Initializing...", 0, 0, 0);
  
    // Clear previous maze and create new one
    document.getElementById("game").innerHTML = "";
    currentMaze = new Maze(MAZE);
  
    // Solve with selected algorithm
    let solution = null;
    switch (algorithm) {
      case "BFS":
        solution = await currentMaze.bfs();
        break;
      case "DFS":
        solution = await currentMaze.dfs();
        break;
      case "UCS":
        solution = await currentMaze.ucs();
        break;
      case "A*":
        solution = await currentMaze.astar();
        break;
      case "IDDFS":
        solution = await currentMaze.iddfs();
        break;
      case "Bi-directional":
        solution = await currentMaze.bidirectional();
        break;
      case "Beam":
        solution = await currentMaze.beamSearch();
        break;
      case "IDA*":
        solution = await currentMaze.idaStar();
        break;
      default:
        console.error("Unknown algorithm:", algorithm);
        updateStats(algorithm, "Failed - Unknown algorithm", 0, 0, 0);
    }
  
    isSolving = false;
    return solution;
  }
  
  function resetMaze() {
    isSolving = false;
    document.getElementById("game").innerHTML = "";
    currentMaze = new Maze(MAZE);
    updateStats("-", "Ready", 0, 0, 0);
  }
  
  // Initialize the maze when page loads
  window.onload = function() {
    resetMaze();
  };