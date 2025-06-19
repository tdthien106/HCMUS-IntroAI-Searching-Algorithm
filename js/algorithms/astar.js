// A* implementation
Maze.prototype.astar = async function() {
    const startTime = performance.now();
    let exploredCount = 0;
    const priorityQueue = new PriorityQueue();
    priorityQueue.enqueue(
      {
        ...this.start,
        path: [this.start],
        cost: 0,
        heuristic: this.heuristic(this.start),
      },
      this.heuristic(this.start)
    );
    const visited = new Set();
    visited.add(`${this.start.i},${this.start.j}`);
  
    while (!priorityQueue.isEmpty() && isSolving) {
      const current = priorityQueue.dequeue().element;
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
          "A*",
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
          const newCost = current.cost + 1;
          const heuristic = this.heuristic(neighbor);
          priorityQueue.enqueue(
            {
              ...neighbor,
              path: [...current.path, neighbor],
              cost: newCost,
              heuristic: heuristic,
            },
            newCost + heuristic
          );
  
          if (!this.areStatesEqual(neighbor, this.goal)) {
            const cellIndex = neighbor.i * this.width + neighbor.j;
            this.mazeElement.children[cellIndex].className = "frontier";
          }
        }
      }
  
      updateStats(
        "A*",
        "Searching...",
        exploredCount,
        0,
        (performance.now() - startTime).toFixed(2)
      );
      await wait(animationSpeed);
    }
  
    if (isSolving) {
      updateStats(
        "A*",
        "No solution",
        exploredCount,
        0,
        (performance.now() - startTime).toFixed(2)
      );
    }
    return null;
  };