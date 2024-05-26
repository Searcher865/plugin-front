export class BugData {
  constructor() {
    if (BugData.instance) {
      return BugData.instance;
    }
    this._bugs = [];
    BugData.instance = this;
  }

  get bugs() {
    return this._bugs;
  }

  setBugs(data) {
    this._bugs = data;
  }

}  