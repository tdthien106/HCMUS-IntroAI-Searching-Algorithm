// BFS implementation
Maze.prototype.bfs = async function() {
    const startTime = performance.now();
    let exploredCount = 0;
    const queue = [{ ...this.start, path: [this.start] }];
    const visited = new Set();
    visited.add(`${this.start.i},${this.start.j}`);
  
    while (queue.length > 0 && isSolving) {
      const current = queue.shift();
      exploredCount++;
  
      if (!this.areStatesEqual(current, this.start)) {
        const cellIndex = current.i * this.width + current.j;
        this.mazeElement.children[cellIndex].className = "current";
        await wait(animationSpeed);
        this.mazeElement.children[cellIndex].className = "explored";
      }
  
      if (this.areStatesEqual(current, this.goal)) {
        const endTime = performance.now();
        updateStats(
          "BFS",
          "Solved",
          exploredCount,
          current.path.length,
          (endTime - startTime).toFixed(2)
        );
        await this.visualizePath(current.path);
        return current.path;
      }
  
      for (const neighbor of this.getNeighbors(current)) {
        const neighborKey = `${neighbor.i},${neighbor.j}`;
        if (!visited.has(neighborKey)) {
          visited.add(neighborKey);
          queue.push({
            ...neighbor,
            path: [...current.path, neighbor],
          });
  
          if (!this.areStatesEqual(neighbor, this.goal)) {
            const cellIndex = neighbor.i * this.width + neighbor.j;
            this.mazeElement.children[cellIndex].className = "frontier";
          }
        }
      }
  
      updateStats(
        "BFS",
        "Searching...",
        exploredCount,
        0,
        (performance.now() - startTime).toFixed(2)
      );
      await wait(animationSpeed);
    }
  
    if (isSolving) {
      updateStats(
        "BFS",
        "No solution",
        exploredCount,
        0,
        (performance.now() - startTime).toFixed(2)
      );
    }
    return null;
  };