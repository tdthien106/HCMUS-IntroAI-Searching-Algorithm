// DFS implementation
Maze.prototype.dfs = async function() {
    const startTime = performance.now();
    let exploredCount = 0;
    const stack = [{ ...this.start, path: [this.start] }];
    const visited = new Set();
    visited.add(`${this.start.i},${this.start.j}`);
  
    while (stack.length > 0 && isSolving) {
      const current = stack.pop();
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
          "DFS",
          "Solved",
          exploredCount,
          current.path.length,
          (endTime - startTime).toFixed(2)
        );
        await this.visualizePath(current.path);
        return current.path;
      }
  
      const neighbors = this.getNeighbors(current).reverse();
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.i},${neighbor.j}`;
        if (!visited.has(neighborKey)) {
          visited.add(neighborKey);
          stack.push({
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
        "DFS",
        "Searching...",
        exploredCount,
        0,
        (performance.now() - startTime).toFixed(2)
      );
      await wait(animationSpeed);
    }
  
    if (isSolving) {
      updateStats(
        "DFS",
        "No solution",
        exploredCount,
        0,
        (performance.now() - startTime).toFixed(2)
      );
    }
    return null;
  };