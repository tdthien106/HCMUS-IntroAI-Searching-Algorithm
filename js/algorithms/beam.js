// Beam Search implementation
Maze.prototype.beamSearch = async function(k = 3) {
    const startTime = performance.now();
    let exploredCount = 0;
    let currentLevel = [
      {
        ...this.start,
        path: [this.start],
        heuristic: this.heuristic(this.start),
      },
    ];
    const visited = new Set();
    visited.add(`${this.start.i},${this.start.j}`);
  
    while (currentLevel.length > 0 && isSolving) {
      for (const node of currentLevel) {
        if (!this.areStatesEqual(node, this.start)) {
          const cellIndex = node.i * this.width + node.j;
          this.mazeElement.children[cellIndex].className = "current";
          await wait(animationSpeed / 2);
          this.mazeElement.children[cellIndex].className = "explored";
        }
      }
  
      for (const node of currentLevel) {
        if (this.areStatesEqual(node, this.goal)) {
          const endTime = performance.now();
          updateStats(
            "Beam Search",
            "Solved",
            exploredCount,
            node.path.length,
            (endTime - startTime).toFixed(2)
          );
          await this.visualizePath(node.path);
          return node.path;
        }
      }
  
      let nextLevel = [];
      for (const node of currentLevel) {
        exploredCount++;
        for (const neighbor of this.getNeighbors(node)) {
          const neighborKey = `${neighbor.i},${neighbor.j}`;
          if (!visited.has(neighborKey)) {
            visited.add(neighborKey);
            const heuristic = this.heuristic(neighbor);
            nextLevel.push({
              ...neighbor,
              path: [...node.path, neighbor],
              heuristic: heuristic,
            });
  
            if (!this.areStatesEqual(neighbor, this.goal)) {
              const cellIndex = neighbor.i * this.width + neighbor.j;
              this.mazeElement.children[cellIndex].className = "frontier";
            }
          }
        }
      }
  
      nextLevel.sort((a, b) => a.heuristic - b.heuristic);
      currentLevel = nextLevel.slice(0, k);
  
      updateStats(
        "Beam Search",
        "Searching...",
        exploredCount,
        0,
        (performance.now() - startTime).toFixed(2)
      );
      await wait(animationSpeed);
    }
  
    if (isSolving) {
      updateStats(
        "Beam Search",
        "No solution",
        exploredCount,
        0,
        (performance.now() - startTime).toFixed(2)
      );
    }
    return null;
  };