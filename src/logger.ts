/* eslint-disable no-console */
import { type LoggerOptions, type ExecuteId } from "loongbao";

// By default, log output to the console
// You can customize an object to implement the log output to the file, or send it to the private log center

export const loggerOptions = {
  onSubmit: (tags, logs) => {
    //
  },
  onInsert: (options) => {
    console[options.loggerLevel](options.description, ...options.params);

    return true;
  }
} satisfies LoggerOptions;
