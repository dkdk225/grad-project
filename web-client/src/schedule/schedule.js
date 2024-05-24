/**
 * Data structure storing multidimensional points in time
 * should be treated as an immutable object
 */
class Schedule {
  #fields;
  #pointStorage;
  #essentialFields;
  #cache;
  /**
   * @param {Object} options - An options object
   * @param {Object} options.pointStorage - Initial object of points to be stored
   * @param {string[]} options.fields - Key values of the fields
   */
  constructor({ fields, pointStorage = {} }) {
    this.#fields = fields;
    this.#pointStorage = pointStorage;
    this.#cache = {};
    // essential fields are fields related to data excluding fields such as index and time
    this.#essentialFields = fields.filter((field) => field !== "time");
  }

  /**
   * Initiate a point
   * @param {Object} - Object containing key-value pairs for initiation
   */
  newPoint(values = {}) {
    const newPoint = {};
    for (let field of this.#fields) {
      newPoint[field] = 0;
    }

    for (let value of Object.keys(values)) {
      newPoint[value] = values[value];
    }

    newPoint.time = -500;
    newPoint.key = generateKey(); //this key is used to access the point and to generate react components
    const newPointStorage = { ...this.#pointStorage }; // copy the object
    newPointStorage[newPoint.key] = newPoint;
    return new Schedule({
      fields: this.#fields,
      pointStorage: newPointStorage,
    });
  }

  removePoint(key) {
    const newPointStorage = { ...this.#pointStorage };
    delete newPointStorage[key];
    return new Schedule({
      fields: this.#fields,
      pointStorage: newPointStorage,
    });
  }

  updatePoint(newPoint) {
    const newPointStorage = { ...this.#pointStorage };
    newPointStorage[newPoint.key] = newPoint;
    return new Schedule({
      pointStorage: newPointStorage,
      fields: this.#fields,
    });
  }
  /**
   * builds the schedule according to parsed points
   */
  buildPointStorage(parsedPoints) {
    const newPointStorage = {};
    const firstfield = Object.keys(parsedPoints)[0];
    for (let i = 0; i < parsedPoints[firstfield].length; i++) {
      const newPoint = {};
      for (let field of this.#fields) {
        newPoint[field] = parsedPoints[field][i].y;
      }
      newPoint.key = generateKey();
      newPoint.time = parsedPoints[firstfield][i].x;
      newPointStorage[newPoint.key] = newPoint;
    }
    return new Schedule({
      pointStorage: newPointStorage,
      fields: this.#fields,
    });
  }

  /**
   * Seperate points into displayable format at chart.
   * Caches the response.
   */
  parse() {
    const getSortedPoints = () => {
      const sortedPoints = [];
      for (let key of Object.keys(this.#pointStorage)) {
        sortedPoints.push(this.#pointStorage[key]);
      }
      sortedPoints.sort((e, b) => {
        return e.time - b.time;
      });
      return sortedPoints;
    };

    if (!this.#cache.parsed) {
      const parsed = {};
      const fieldNamings = this.createEssentialFieldNamings();
      for (let field of this.#essentialFields) {
        parsed[field] = [];
        parsed[field].label = fieldNamings[field];
      }

      for (let point of getSortedPoints()) {
        for (let field of this.#essentialFields) {
          parsed[field].push({ y: point[field], x: point.time });
        }
      }
      this.#cache.parsed = parsed;
    }
    return this.#cache.parsed;
  }

  getPointStorageCopy() {
    if (!this.#cache.pointStorage) {
      this.#cache.pointStorage = { ...this.#pointStorage }; // shallow copy of pointStorage
    }
    return this.#cache.pointStorage;
  }

  /**
   * Creates an object that has namings for field keys
   * @returns {Object} An object which contains mappings from fields to their names.
   */
  createEssentialFieldNamings() {
    const namingMap = {};
    for (let field of this.#essentialFields) {
      let withSpaces = field.replace(/([A-Z])/g, " $1");
      withSpaces = withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
      namingMap[field] = withSpaces;
    }
    return namingMap;
  }
}

let currentKey = -1;
const generateKey = () => {
  currentKey++;
  return String(currentKey);
};

export { Schedule };
