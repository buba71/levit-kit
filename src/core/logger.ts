export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
}

export class Logger {
  private static isJsonMode = false;

  static setJsonMode(enabled: boolean) {
    this.isJsonMode = enabled;
  }

  static info(message: string, data?: any) {
    this.log(LogLevel.INFO, message, data);
  }

  static warn(message: string, data?: any) {
    this.log(LogLevel.WARN, message, data);
  }

  static error(message: string, data?: any) {
    this.log(LogLevel.ERROR, message, data);
  }

  static debug(message: string, data?: any) {
    this.log(LogLevel.DEBUG, message, data);
  }

  private static log(level: LogLevel, message: string, data?: any) {
    if (this.isJsonMode) {
      console.log(JSON.stringify({ level, message, data, timestamp: new Date().toISOString() }));
    } else {
      const prefix = {
        [LogLevel.INFO]: "ℹ️",
        [LogLevel.WARN]: "⚠️",
        [LogLevel.ERROR]: "❌",
        [LogLevel.DEBUG]: "🔍",
      }[level];
      console.log(`${prefix} ${message}`);
      if (data && level === LogLevel.ERROR) {
        console.error(data);
      }
    }
  }
}
