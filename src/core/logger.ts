import chalk from "chalk";

export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
  SUCCESS = "SUCCESS",
}

export class Logger {
  private static isJsonMode = false;

  static setJsonMode(enabled: boolean) {
    this.isJsonMode = enabled;
  }

  static getJsonMode(): boolean {
    return this.isJsonMode;
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

  static success(message: string, data?: any) {
    this.log(LogLevel.SUCCESS, message, data);
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
        [LogLevel.SUCCESS]: "✅",
      }[level];

      // Color the message based on level
      let coloredMessage = message;
      switch (level) {
        case LogLevel.INFO:
          coloredMessage = chalk.blue(message);
          break;
        case LogLevel.WARN:
          coloredMessage = chalk.yellow(message);
          break;
        case LogLevel.ERROR:
          coloredMessage = chalk.red(message);
          break;
        case LogLevel.DEBUG:
          coloredMessage = chalk.gray(message);
          break;
        case LogLevel.SUCCESS:
          coloredMessage = chalk.green(message);
          break;
      }

      console.log(`${prefix} ${coloredMessage}`);
      if (data && level === LogLevel.ERROR) {
        console.error(data);
      }
    }
  }
}
