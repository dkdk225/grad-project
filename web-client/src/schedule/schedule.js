/**
 * Data structure storing multidimensional points in time
 * should be treated as an immutable object
 */
class Schedule {
  #fields;
  #pointArr;
  #essentialFields;
  #cache;
  /**
   * @param {Object} options - An options object
   * @param {Point[]} options.pointArr - Initial array of points to be stored
   * @param {string[]} options.fields - Key values of the fields
   */
  constructor({ fields, pointArr = [] }) {
    this.#fields = fields;
    this.#pointArr = pointArr;
    this.#cache = {};
    // essential fields are fields related to data excluding fields such as index and time
    this.#essentialFields = fields.filter(
      (field) => field !== "time" || field !== "index"
    );
  }

  /**
   * Initiate a point
   *
   */
  newPoint(values = []) {
    const newPoint = {};
    for (let field of this.#fields) {
      newPoint[field] = 0;
    }

    for (let value of Object.keys(values)) {
      newPoint[value] = values[value];
    }

    newPoint.time = -10000;
    newPoint.index = this.#pointArr.length;
    return new Schedule({
      fields: this.#fields,
      pointArr: [newPoint, ...this.#pointArr],
    });
  }

  updatePoint(newPoint) {
    const newPointArr = this.#pointArr.map((e) => e); // copy the point array
    newPointArr[newPoint.index] = newPoint;
    newPointArr.sort((e, b) => {
      return e.time - b.time;
    });
    newPointArr.forEach((point, index) => {
      point.index = index;
    });
    return new Schedule({ pointArr: newPointArr, fields: this.#fields });
  }
  /**
   * Seperate points into displayable format at chart
   */
  parse() {
    const parsed = {};
    for (let field of this.#essentialFields) {
      parsed[field] = [];
    }
    for (let point of this.#pointArr) {
      for (let field of this.#essentialFields) {
        parsed[field].push({ y: point[field], x: point.time });
      }
    }
    return parsed;
  }

  getPointArrCopy() {
    if (this.#cache.pointArr) {
      return this.#cache.pointArr;
    }
    this.#cache.pointArr = this.#pointArr.map((e) => e); // shallow copy of pointArr
    return this.#cache.pointArr;
  }

  /**
   * Creates an object that has namings for field keys
   * @returns {Object} An object which contains mappings from fields to their names.
   */
  createEssentialFieldNamings() {
    const namingMap = {};
    for (let field of Object.keys(this.#essentialFields)) {
      let withSpaces = field.replace(/([A-Z])/g, " $1");
      withSpaces = withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
      namingMap[field] = withSpaces;
    }
    return namingMap;
  }
}

export { Schedule };
