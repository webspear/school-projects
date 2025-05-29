// based upon
// https://briangrinstead.com/blog/astar-search-algorithm-in-javascript/
// https://medium.com/codesphere-cloud/pathfinding-with-javascript-the-a-algorithm-263c23f344ac
// https://en.wikipedia.org/wiki/A*_search_algorithm#Pseudocode
// http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html

// NODE //
class Node {
  constructor(x, y, g, h, parent = null) {
    this.x = x;
    this.y = y;
    this.g = g; // cost start - current
    this.h = h; // cost current - end (heuristic)
    this.f = g + h; // total cost
    this.parent = parent; // ref prev
  }
}

// A* //
export function aStar(grid, start, goal, congregateDistance = 2) {
  // 0 to go to goal
  const openList = [];
  const closedList = [];
  let closestNode = null;

  // manhattan distance heuristic h(n) = |x1 - x2| + |y1 - y2|
  const heuristic = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

  openList.push(new Node(start.x, start.y, 0, heuristic(start, goal)));

  while (openList.length > 0) {
    // low f cost first
    openList.sort((a, b) => a.f - b.f);
    const current = openList.shift();

    // if goal reached, reconstruct path
    if (heuristic(current, goal) <= congregateDistance) {
      const path = [];
      let temp = current;
      while (temp) {
        path.unshift({ x: temp.x, y: temp.y });
        temp = temp.parent;
      }
      return path;
    }

    // Update closest node if current node is closer to the goal
    if (
      !closestNode ||
      heuristic(current, goal) < heuristic(closestNode, goal)
    ) {
      closestNode = current;
    }

    closedList.push(current);

    // hello neighbor
    const neighbors = [
      { x: current.x - 1, y: current.y }, // left
      { x: current.x + 1, y: current.y }, // right
      { x: current.x, y: current.y - 1 }, // up
      { x: current.x, y: current.y + 1 }, // down
      { x: current.x - 1, y: current.y - 1 }, // top-left
      { x: current.x + 1, y: current.y - 1 }, // top-right
      { x: current.x - 1, y: current.y + 1 }, // bottom-left
      { x: current.x + 1, y: current.y + 1 }, // bottom-right
    ];

    for (const neighbor of neighbors) {
      // grid bounds check && walk
      if (
        neighbor.x < 0 ||
        neighbor.y < 0 ||
        neighbor.x >= grid[0].length ||
        neighbor.y >= grid.length ||
        grid[neighbor.y][neighbor.x] === 1 ||
        closedList.some(
          (node) => node.x === neighbor.x && node.y === neighbor.y,
        )
      )
        continue;

      const isDiagonal = current.x !== neighbor.x && current.y !== neighbor.y;
      const g = current.g + (isDiagonal ? Math.sqrt(2) : 1);
      const h = heuristic(neighbor, goal);
      const neighborNode = new Node(neighbor.x, neighbor.y, g, h, current);

      // check if neighbor is already in open list,
      // if so, check if new path is better
      const openNode = openList.find(
        (node) => node.x === neighbor.x && node.y === neighbor.y,
      );
      if (openNode) {
        if (g < openNode.g) {
          openNode.g = g;
          openNode.f = g + h;
          openNode.parent = current;
        }
      } else {
        openList.push(neighborNode);
      }
    }
  }

  // congregation dist not reached, return closest node
  if (closestNode) {
    const path = [];
    let temp = closestNode;
    while (temp) {
      path.unshift({ x: temp.x, y: temp.y });
      temp = temp.parent;
    }
    return path;
  }

  return []; // hopefully this never happens
}

// TEST(s or not) //
const grid = [
  [0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0],
];

const start = { x: 0, y: 0 };
const goal = { x: 4, y: 4 };

const path = aStar(grid, start, goal, 0);
console.log(path);
