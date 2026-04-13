class Point {
  static #count;        // number of points displayed
  static #colorIndex = 0; // used to cycle through colors

  #x;        // point's x-coordinate
  #y;        // point's y-coordinate
  #color;    // point's display color

  constructor(x, y) {
    this.#x = x;
    this.#y = y;

    // Assigns colors in the order: red -> green -> blue -> repeat
    if (Point.#colorIndex === 0) {
      this.#color = "red";
    }
    else if (Point.#colorIndex === 1) {
      this.#color = "green";
    }
    else {
      this.#color = "blue";
    }

    Point.#colorIndex = (Point.#colorIndex + 1) % 3;

    // Maintain count of displayed points (maximum of two)
    if (Point.#count === undefined) {
      Point.#count = 1;
    }
    else if (Point.#count === 1) {
      Point.#count = 2;
    }
  } // end constructor

  // Return the point in the format "(x, y)"
  value() {
    return "(" + this.#x + ", " + this.#y + ")";
  } // end value

  // Getter methods
  getX() {
    return this.#x;
  }

  getY() {
    return this.#y;
  }

  getColor() {
    return this.#color;
  }

  // Move the point to a new location (used for dragging)
  move(x, y) {
    this.#x = x;
    this.#y = y;
  } // end move

  // Return the number of Point objects currently displayed
  static getCount() {
    return (Point.#count === undefined) ? 0 : Point.#count;
  } // end getCount

  // Return the distance between two points or null if two points have not yet been created.
  static distance(pt1, pt2) {
    var xDist, yDist;
    var distance = null;

    if (Point.#count === 2) {
      xDist = pt1.#x - pt2.#x;
      yDist = pt1.#y - pt2.#y;
      distance = Math.sqrt(xDist * xDist + yDist * yDist);
    }
    return distance;
  } // end distance
} // end class Point

// Global variables to store the two most recent points
var point1, point2;

// This function stores a user's click location as a point.
function captureClick(e) {
  // Prevent the button from creating a new point
  if (e.target.id === "btn") {
    return;
  }

  if (Point.getCount() === 0) {
    point1 = new Point(e.clientX, e.clientY);
    document.getElementById("pt1Location").innerHTML = point1.value();
    displayPoint("pt1Graphic", point1);
  }
  else if (Point.getCount() === 1) {
    point2 = new Point(e.clientX, e.clientY);
    document.getElementById("pt2Location").innerHTML = point2.value();
    displayPoint("pt2Graphic", point2);
  }
  else {
    // Shift the second point to the first and create a new second point
    point1 = point2;
    point2 = new Point(e.clientX, e.clientY);
    document.getElementById("pt1Location").innerHTML = point1.value();
    document.getElementById("pt2Location").innerHTML = point2.value();
    displayPoint("pt1Graphic", point1);
    displayPoint("pt2Graphic", point2);
  }

  // Clear any previous distance message
  document.getElementById("message").innerHTML = "";
} // end captureClick

// This function displays a point on the page.
function displayPoint(id, pt) {
  var pointGraphic = document.getElementById(id);

  pointGraphic.innerHTML = "&nbsp;";
  pointGraphic.style.position = "absolute";
  pointGraphic.style.left = pt.getX() + "px";
  pointGraphic.style.top = pt.getY() + "px";
  pointGraphic.style.width = "8px";
  pointGraphic.style.height = "8px";
  pointGraphic.style.backgroundColor = pt.getColor();
  pointGraphic.style.border = "1px solid black";
  pointGraphic.style.borderRadius = "50%";
  pointGraphic.style.cursor = "move";
} // end displayPoint

// This function calculates and displays the distance
// between the two most recent points.
function displayDistance(e) {
  var distance;
  var message;

  // Prevent the button click from creating a new point
  e.stopPropagation();

  distance = Point.distance(point1, point2);

  if (distance === null) {
    message =
      "To calculate a distance, you must first create two points!";
  }
  else {
    message =
      "The two points are " + distance.toFixed(1) +
      " pixels apart.";
  }

  document.getElementById("message").innerHTML = message;
} // end displayDistance

// This function allows the user to drag a point to a new
// location and updates its coordinates accordingly.
function dragPoint(e) {
  var x = e.clientX;
  var y = e.clientY;

  // Prevent dragging from triggering the page's click handler
  e.stopPropagation();

  if (e.target.id === "pt1Graphic" && point1) {
    point1.move(x, y);
    document.getElementById("pt1Location").innerHTML =
      point1.value();
    displayPoint("pt1Graphic", point1);
  }
  else if (e.target.id === "pt2Graphic" && point2) {
    point2.move(x, y);
    document.getElementById("pt2Location").innerHTML =
      point2.value();
    displayPoint("pt2Graphic", point2);
  }
} // end dragPoint