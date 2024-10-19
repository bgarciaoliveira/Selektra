// src/utils/Logger.ts

export class Logger {
    private debug: boolean;
  
    constructor(debug: boolean = false) {
      this.debug = debug;
    }
  
    public log(message: string): void {
      if (this.debug) {
        console.log(message);
      }
    }
  
    public setDebug(debug: boolean): void {
      this.debug = debug;
    }
}