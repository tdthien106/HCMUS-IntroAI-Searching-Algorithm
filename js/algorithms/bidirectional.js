// Bi-directional Search implementation
Maze.prototype.bidirectional = async function() {
    const startTime = performance.now();
    let exploredCount = 0;
  
    const queueStart = [{ ...this.start, path: [this.start] }];
    const queueGoal = [{ ...this.goal, path: [this.goal] }];
  
    const visitedStart = new Set();
    const visitedGoal = new Set();
    const parentStart = new Map();
    const parentGoal = new Map();
  
    visitedStart.add(`${this.start.i},${this.start.j}`);
    visitedGoal.add(`${this.goal.i},${this.goal.j}`);
    parentStart.set(`${this.start.i},${this.start.j}`, null);
    parentGoal.set(`${this.goal.i},${this.goal.j}`, null);
  
    while ((queueStart.length > 0 || queueGoal.length > 0) && isSolving) {
      if (queueStart.length > 0) {
        const current = queueStart.shift();
        exploredCount++;
  
        if (!this.areStatesEqual(current, this.start)) {
          const cellIndex = current.i * this.width + current.j;
          this.mazeElement.children[cellIndex].className = "current";
          await wait(animationSpeed);
          this.mazeElement.children[cellIndex].className = "explored";
        }
  
        if (visitedGoal.has(`${current.i},${current.j}`)) {
          const pathFromStart = current.path;
          let pathFromGoal = [];
          let node = `${current.i},${current.j}`;
  
          while (node) {
            const [i, j] = node.split(",").map(Number);
            pathFromGoal.push({ i, j });
            node = parentGoal.get(node);
          }
  
          pathFromGoal.reverse();
          const fullPath = [...pathFromStart, ...pathFromGoal.slice(1)];
  
          const endTime = performance.now();
          updateStats(
            "Bi-directional",
            "Solved",
            exploredCount,
            fullPath.length,
            (endTime - startTime).toFixed(2)
          );
          await this.visualizePath(fullPath);
          return fullPath;
        }
  
        for (const neighbor of this.getNeighbors(current)) {
          const neighborKey = `${neighbor.i},${neighbor.j}`;
          if (!visitedStart.has(neighborKey)) {
            visitedStart.add(neighborKey);
            parentStart.set(neighborKey, `${current.i},${current.j}`);
            queueStart.push({
              ...neighbor,
              path: [...current.path, neighbor],
            });
  
            if (!this.areStatesEqual(neighbor, this.goal)) {
              const cellIndex = neighbor.i * this.width + neighbor.j;
              this.mazeElement.children[cellIndex].className = "frontier";
            }
          }
        }
      }
  
      if (queueGoal.length > 0) {
        const current = queueGoal.shift();
        exploredCount++;
  
        if (!this.areStatesEqual(current, this.goal)) {
          const cellIndex = current.i * this.width + current.j;
          this.mazeElement.children[cellIndex].className = "current";
          await wait(animationSpeed);
          this.mazeElement.children[cellIndex].className = "explored";
        }
  
        if (visitedStart.has(`${current.i},${current.j}`)) {
          let pathFromStart = [];
          let node = `${current.i},${current.j}`;
  
          while (node) {
            const [i, j] = node.split(",").map(Number);
            pathFromStart.push({ i, j });
            node = parentStart.get(node);
          }
  
          pathFromStart.reverse();
          const pathFromGoal = current.path;
          const fullPath = [...pathFromStart, ...pathFromGoal.slice(1)];
  
          const endTime = performance.now();
          updateStats(
            "Bi-directional",
            "Solved",
            exploredCount,
            fullPath.length,
            (endTime - startTime).toFixed(2)
          );
          await this.visualizePath(fullPath);
          return fullPath;
        }
  
        for (const neighbor of this.getNeighbors(current)) {
          const neighborKey = `${neighbor.i},${neighbor.j}`;
          if (!visitedGoal.has(neighborKey)) {
            visitedGoal.add(neighborKey);
            parentGoal.set(neighborKey, `${current.i},${current.j}`);
            queueGoal.push({
              ...neighbor,
              path: [...current.path, neighbor],
            });
  
            if (!this.areStatesEqual(neighbor, this.start)) {
              const cellIndex = neighbor.i * this.width + neighbor.j;
              this.mazeElement.children[cellIndex].className = "frontier";
            }
          }
        }
      }
  
      updateStats(
        "Bi-directional",
        "Searching...",
        exploredCount,
        0,
        (performance.now() - startTime).toFixed(2)
      );
      await wait(animationSpeed);
    }
  
    if (isSolving) {
      updateStats(
        "Bi-directional",
        "No solution",
        exploredCount,
        0,
        (performance.now() - startTime).toFixed(2)
      );
    }
    return null;
  };