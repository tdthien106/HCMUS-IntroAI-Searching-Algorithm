// IDA* implementation
Maze.prototype.idaStar = async function() {
    const startTime = performance.now();
    let exploredCount = 0;
    let threshold = this.heuristic(this.start);
  
    while (isSolving) {
      const result = await this.idastarSearch(
        this.start,
        0,
        threshold,
        startTime,
        exploredCount
      );
  
      if (result.found) {
        const endTime = performance.now();
        updateStats(
          "IDA*",
          "Solved",
          exploredCount,
          result.path.length,
          (endTime - startTime).toFixed(2)
        );
        await this.visualizePath(result.path);
        return result.path;
      }
  
      if (result.cost === Infinity) {
        updateStats(
          "IDA*",
          "No solution",
          exploredCount,
          0,
          (performance.now() - startTime).toFixed(2)
        );
        return null;
      }
  
      threshold = result.cost;
  
      this.clearVisualization();
      exploredCount = 0;
      updateStats(
        "IDA*",
        `Searching (threshold=${threshold})...`,
        exploredCount,
        0,
        (performance.now() - startTime).toFixed(2)
      );
      await wait(animationSpeed * 2);
    }
  
    return null;
  };
  
  // Helper function for IDA*
  Maze.prototype.idastarSearch = async function(node, g, threshold, startTime, exploredCount) {
    exploredCount++;
    const f = g + this.heuristic(node);
  
    if (!this.areStatesEqual(node, this.start)) {
      const cellIndex = node.i * this.width + node.j;
      this.mazeElement.children[cellIndex].className = "current";
      await wait(animationSpeed);
      this.mazeElement.children[cellIndex].className = "explored";
    }
  
    if (this.areStatesEqual(node, this.goal)) {
      return {
        found: true,
        path: [node],
        cost: f,
      };
    }
  
    if (f > threshold) {
      return {
        found: false,
        cost: f,
      };
    }
  
    let min = Infinity;
    let bestPath = null;
  
    for (const neighbor of this.getNeighbors(node)) {
      const result = await this.idastarSearch(
        neighbor,
        g + 1,
        threshold,
        startTime,
        exploredCount
      );
  
      if (result.found) {
        return {
          found: true,
          path: [node, ...result.path],
          cost: result.cost,
        };
      }
  
      if (result.cost < min) {
        min = result.cost;
      }
  
      updateStats(
        "IDA*",
        `Searching (threshold=${threshold})...`,
        exploredCount,
        0,
        (performance.now() - startTime).toFixed(2)
      );
      await wait(animationSpeed);
    }
  
    return {
      found: false,
      cost: min,
    };
  };