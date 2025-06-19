// IDDFS implementation
Maze.prototype.iddfs = async function() {
    const startTime = performance.now();
    let depth = 0;
    let exploredCount = 0;
  
    while (isSolving) {
      const result = await this.dls(
        this.start,
        depth,
        startTime,
        exploredCount
      );
      if (result) {
        return result;
      }
      depth++;
  
      this.clearVisualization();
      exploredCount = 0;
      updateStats(
        "IDDFS",
        `Searching (depth=${depth})...`,
        exploredCount,
        0,
        (performance.now() - startTime).toFixed(2)
      );
      await wait(animationSpeed * 2);
    }
  
    if (isSolving) {
      updateStats(
        "IDDFS",
        "No solution",
        exploredCount,
        0,
        (performance.now() - startTime).toFixed(2)
      );
    }
    return null;
  };
  
  // Depth-Limited Search (helper for IDDFS)
  Maze.prototype.dls = async function(currentState, limit, startTime, exploredCount) {
    const stack = [{ ...currentState, path: [currentState], depth: 0 }];
    const visited = new Set();
  
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
          "IDDFS",
          "Solved",
          exploredCount,
          current.path.length,
          (endTime - startTime).toFixed(2)
        );
        await this.visualizePath(current.path);
        return current.path;
      }
  
      if (current.depth < limit) {
        const neighbors = this.getNeighbors(current).reverse();
        for (const neighbor of neighbors) {
          const neighborKey = `${neighbor.i},${neighbor.j},${current.depth + 1}`;
          if (!visited.has(neighborKey)) {
            visited.add(neighborKey);
            stack.push({
              ...neighbor,
              path: [...current.path, neighbor],
              depth: current.depth + 1,
            });
  
            if (!this.areStatesEqual(neighbor, this.goal)) {
              const cellIndex = neighbor.i * this.width + neighbor.j;
              this.mazeElement.children[cellIndex].className = "frontier";
            }
          }
        }
      }
  
      updateStats(
        "IDDFS",
        `Searching (depth=${limit})...`,
        exploredCount,
        0,
        (performance.now() - startTime).toFixed(2)
      );
      await wait(animationSpeed);
    }
  
    return null;
  };