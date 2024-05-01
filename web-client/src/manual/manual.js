class Manual {
  #fields;
  #pointStorage;
  #cache;

  /**
   * @param {Object} options - An options object
   * @param {Object} options.pointStorage - Initial object of points to be stored
   * @param {string[]} options.fields - Key values of the fields
   */
  constructor({ fields, pointStorage }) {
    this.#fields = fields;
    this.#pointStorage = pointStorage;
    this.#cache = {};
    console.log(pointStorage);
    if (!pointStorage) {
      this.#pointStorage = {};
      for (let field of this.#fields) {
        this.#pointStorage[field] = 0;
      }
    }
  }

  getPointStorageCopy() {
    if (!this.#cache.pointStorage) {
      this.#cache.pointStorage = { ...this.#pointStorage }; // shallow copy of pointStorage
    }
    return this.#cache.pointStorage;
  }
  getFieldsCopy() {
    return [...this.#fields];
  }
  updatePoint(newPoint) {
    const { color, pwmValue } = newPoint;
    const newPointStorage = { ...this.#pointStorage };
    newPointStorage[color] = pwmValue;
    return new Manual({
      pointStorage: newPointStorage,
      fields: this.#fields,
    });
  }
  createFieldNamings() {
    const namingMap = {};
    for (let field of this.#fields) {
      let withSpaces = field.replace(/([A-Z])/g, " $1");
      withSpaces = withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
      namingMap[field] = withSpaces;
    }
    return namingMap;
  }
  buildPointStorage(manual) {
    return new Manual({
      fields: this.getFieldsCopy(),
      pointStorage: { ...manual },
    });
  }
}

export { Manual };
