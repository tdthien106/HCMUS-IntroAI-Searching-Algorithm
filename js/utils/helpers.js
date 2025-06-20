// Maze configuration
const MAZE = `###                 #########
              #   ###################   # #
              # ####          #     # # # #
              # ########## ######## # # # #
              #                     # # # #
              ##################### # # # #
              #   ##                # #   #
              # # ## ### ## ######### # # #
              # #    #   ##B#         # # #
              # # ## ################ # ###
              # # ##             #### # # #
              # # ############## ## # # # #
              # #             ##    # # # #
              # #### ######## ####### # # #
              ######    #             #   #
              A      ######################`;

// Global variables
let animationSpeed = 50;
let isSolving = false;
let currentMaze = null;

// Helper function to delay execution
const wait = async (n) => {
  if (n <= 0) return;
  return new Promise((resolve) => setTimeout(resolve, n));
};

// Update stats display
function updateStats(algorithm, status, explored, pathLength, time) {
  document.getElementById("algorithm-name").textContent = algorithm;
  document.getElementById("status").textContent = status;
  document.getElementById("explored-count").textContent = explored;
  document.getElementById("path-length").textContent = pathLength;
  document.getElementById("time-taken").textContent = time;
}

// Change animation speed
function changeSpeed(speed) {
  animationSpeed = parseInt(speed);
}