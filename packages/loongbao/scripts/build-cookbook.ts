/* eslint-disable no-console, @typescript-eslint/no-dynamic-delete */

import { TSON, type Cookbook } from "..";
import { join } from "node:path";
import { cwd } from "node:process";
import { writeFile, readFile } from "node:fs/promises";

export async function buildCookbook() {
  const schema = await import("../../../generate/api-schema");
  const paths = Object.keys(schema.default.apiMethodsSchema);

  const cookbook: Cookbook = {};
  for (const path of paths) {
    const module = await import(/* @vite-ignore */ join(`../../../src/apps/${path}`));
    let title;
    let desc;
    const descRaw = module.readme;
    if (descRaw) {
      const descRawLines = descRaw.split("\n");
      if (descRawLines.at(0)?.trim() === "") descRawLines.shift();
      if (descRawLines.at(-1)?.trim() === "") descRawLines.pop();
      for (let index = 0; index < descRawLines.length; index++) {
        const descRawLine = descRawLines[index];
        if (index === 0) {
          title = descRawLine.replace(/#/g, "").trim();
          // Originally the title was in the first line, desc is the rest of it, now desc contains complete markdown content.
          // continue;
        }
        desc = (desc ?? "") + "\n" + descRawLine.trim();
      }
    }

    const code = (await readFile(join(cwd(), `./src/apps/${path}.ts`))).toString();
    const codeLines = code.split("\n");
    let apiParams = /action\([\s\S]+?\)/.exec(code)?.[0] ?? ""; // The intention of the following code is to extract the parameter part of the action.
    apiParams = /\([\s\S]*,/.exec(apiParams)?.[0] ?? "";
    apiParams = apiParams.slice(0, -1);
    apiParams = apiParams.slice(/[\s\S]+?:/.exec(apiParams)?.[0].length);
    const apiParamsLines = apiParams.split("\n"); // The intention of the following code is to remove extra spaces, which will make the code look more beautiful.
    if (apiParamsLines.at(-1)?.trim() === "") apiParamsLines.pop();
    if (apiParamsLines.at(-1)?.trim() === "") apiParamsLines.pop();
    let spaceNumber = 0;
    for (const char of apiParamsLines.at(-1) ?? "") {
      if (char === " ") spaceNumber++;
      else break;
    }
    for (let index = 0; index < apiParamsLines.length; index++) {
      const line = apiParamsLines[index];
      let spaceNumberForThisLine = 0;
      for (const char of line) {
        if (char === " ") spaceNumberForThisLine++;
        else break;
      }
      if (spaceNumberForThisLine >= spaceNumber) {
        apiParamsLines[index] = line.slice(spaceNumber);
      } else {
        apiParamsLines[index] = line.slice(spaceNumberForThisLine);
      }
    }
    apiParams = apiParamsLines.join("\n");

    // Find the code for the API testing section.
    const apiTestsCodeChars = [];
    let apiTestsStartIndex = undefined as undefined | number;
    let semicolonMatch = 0;
    let semicolonMax = 0;
    for (let index = 0; index < codeLines.length; index++) {
      const codeLine = codeLines[index];
      if (apiTestsStartIndex === undefined && !codeLine.includes("defineApiTest(")) continue;
      if (apiTestsStartIndex === undefined) apiTestsStartIndex = index;
      const codeChars = codeLine.split("");
      for (const codeChar of codeChars) {
        if (codeChar === "[") {
          semicolonMatch++;
          semicolonMax++;
        }
        if (semicolonMatch !== 0) apiTestsCodeChars.push(codeChar);
        if (codeChar === "]") semicolonMatch--;
      }
      if (semicolonMatch === 0 && semicolonMax >= 1) {
        break;
      }
      apiTestsCodeChars.push("\n");
    }

    // Find the code for each API test case.
    const apiCaseCodes: Array<string> = [];
    let currentApiCaseCode = undefined as undefined | Array<string>;
    let apiTestCaseStartIndex = undefined as undefined | number;
    let apiTestCaseMatch = 0;
    for (let index = 0; index < apiTestsCodeChars.length; index++) {
      const apiTestsCodeChar = apiTestsCodeChars[index];
      if (apiTestCaseStartIndex === undefined && apiTestsCodeChar === "{") {
        currentApiCaseCode = [];
        apiTestCaseStartIndex = index;
      }
      if (apiTestsCodeChar === "{") {
        apiTestCaseMatch++;
      }

      if (apiTestCaseMatch !== 0) currentApiCaseCode!.push(apiTestsCodeChar);

      if (apiTestsCodeChar === "}") {
        apiTestCaseMatch--;
        if (apiTestCaseMatch === 0) {
          apiCaseCodes.push(currentApiCaseCode!.join(""));
          currentApiCaseCode = undefined;
          apiTestCaseStartIndex = undefined;
        }
      }
    }

    const apiCases: Array<{
      name: string;
      handler: string;
    }> = [];

    for (let index = 0; index < apiCaseCodes.length; index++) {
      const code = apiCaseCodes[index];
      const name = /name:[\s\S]+?,/.exec(code)?.[0]?.slice(5, -1)?.trim().slice(1, -1) ?? "";
      const handlerChars = /handler:[\s\S]*/.exec(code)?.[0]?.split("") ?? [];
      let handler = ""; // Find the main code of the handler.
      let handlerStartIndex = undefined as undefined | number;
      let handlerMatch = 0;
      for (let index = 0; index < handlerChars.length; index++) {
        const handlerChar = handlerChars[index];
        if (handlerStartIndex !== undefined && handlerChar === "{") handlerStartIndex = index;
        if (handlerChar === "{") handlerMatch++;
        if (handlerMatch !== 0) handler = handler + handlerChar;
        if (handlerChar === "}") handlerMatch--;
        if (handlerStartIndex !== undefined && handlerMatch === 0) break;
      }
      handler = handler.slice(1, -1);

      const handlerLines = handler.split("\n"); // The intention of the following code is to remove extra spaces, which will make the code look more beautiful.
      if (handlerLines.at(-1)?.trim() === "") handlerLines.pop();
      if (handlerLines.at(-1)?.trim() === "") handlerLines.pop();
      if (handlerLines.at(0)?.trim() === "") handlerLines.shift();
      if (handlerLines.at(0)?.trim() === "") handlerLines.shift();
      let spaceNumber = 0;
      for (const char of handlerLines.at(-1) ?? "") {
        if (char === " ") spaceNumber++;
        else break;
      }
      for (let index = 0; index < handlerLines.length; index++) {
        const line = handlerLines[index];
        let spaceNumberForThisLine = 0;
        for (const char of line) {
          if (char === " ") spaceNumberForThisLine++;
          else break;
        }
        if (spaceNumberForThisLine >= spaceNumber) {
          handlerLines[index] = line.slice(spaceNumber);
        } else {
          handlerLines[index] = line.slice(spaceNumberForThisLine);
        }
      }
      handler = handlerLines.join("\n");

      apiCases.push({
        name,
        handler
      });
    }

    // This value has been deprecated because TypeScript types can already replace it well
    // let paramsSchema;
    // try {
    //   const moduleGenerated = await import(/* @vite-ignore */ `../../../generate/products/apps/${path}`);
    //   paramsSchema = moduleGenerated.paramsSchema.schemas[0]?.properties?.data;
    // } catch (error) {}

    cookbook[path] = {
      title,
      desc,
      params: apiParams,
      cases: apiCases
    };
  }

  /**
   * -- indexes
   */

  const indexes: Record<string, Array<string>> = {};
  const folderIndexes: Record<string, Array<string>> = {};
  indexes["(root)"] = [];
  folderIndexes["(root)"] = [];
  for (const path in cookbook) {
    if (!path.includes("/")) indexes["(root)"].push(path);
  }
  for (const path in cookbook) {
    const dirnames = path.split("/");
    for (let index = 0; index < dirnames.length - 1; index++) {
      const dirpath = dirnames.slice(0, index + 1).join("/");
      if (!indexes[dirpath]) indexes[dirpath] = [];
      if (!folderIndexes[dirpath]) folderIndexes[dirpath] = [];
      if (index + 1 === dirnames.length - 1) {
        indexes[dirpath].push(path);
      } else {
        const childDirpath = dirnames.slice(0, index + 2).join("/");
        if (folderIndexes[dirpath].includes(childDirpath)) continue;
        folderIndexes[dirpath].push(childDirpath);
      }
    }
  }
  for (const path in folderIndexes) {
    if (path.includes("/") || path === "(root)") continue;
    folderIndexes["(root)"].push(path);
  }

  const readme = (await readFile(join(cwd(), "src", "apps", "README.md"))).toString();
  Object.keys(indexes).forEach((key) => indexes[key].length === 0 && delete indexes[key]);
  const generatedAt = new Date();

  await writeFile(
    join(cwd(), `./generate/cookbook.json`),
    TSON.stringify({
      cookbook,
      readme,
      indexes,
      folderIndexes,
      generatedAt
    })
  );
}

void buildCookbook();
