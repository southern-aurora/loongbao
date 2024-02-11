---
title: TSON
---

<I18N>

# TSON

# TSON

TSON 是一个可扩展的 JSON 解析器，涵盖了更多的数据类型，是 JSON 的严格超集。

TSON is an extensible JSON parser that covers more data types and is a strict superset of JSON.

TSON 最初作为 Loongbao 的一部分，后续为了使前端及其他项目可用而被分离出来，作为一个独立的 npm 包发布。

TSON was initially part of Loongbao and was later separated as a standalone npm package to make it available for frontend and other projects.

## TSON 的作用是什么

## What is the purpose of TSON?

在数据传输过程中，序列化和反序列化是不可避免的步骤。JSON 是互联网上最常见的数据序列化协议，但它缺少了一些当今所需的新类型 (如 `bigint`、`Date` 等)。另一方面，Protocol 是一个看起来更好的选择，但是它太重了，而且不是专为 JavaScript 生态设计的。TSON 填补了这一空白，作为一个可扩展的 JSON 解析器，它提供了更多的数据类型，使得在传输数据时更加便捷和灵活。这使得我们可以在 JavaScript 环境中处理更为丰富的数据结构，而不仅仅局限于 JSON 定义的基本数据类型。

Serialization and deserialization are inevitable steps in data transmission. JSON is the most common data serialization protocol on the Internet, but it lacks some of the newer types needed today, such as `bigint` and `Date`. On the other hand, Protocol seems like a better choice, but it is too heavy and not specifically designed for the JavaScript ecosystem. TSON fills this gap as an extensible JSON parser that provides more data types, making data transmission more convenient and flexible. This allows us to handle richer data structures in the JavaScript environment, not just limited to the basic data types defined by JSON.

## 安装

## Installation

Loongbao 内置了 TSON，您发送的所有参数在接收并解析时，返回给前端的结果实际上都是通过 TSON 实现的。如果您正在使用 Loongbao，无需安装，直接通过以下方式使用即可。

Loongbao comes with TSON built-in. All the parameters you send will be received and parsed using TSON, and the results returned to the front-end are actually achieved through TSON. If you are using Loongbao, there is no need to install it. You can use it directly by following the steps below.

```ts
import { TSON } from "loongbao";
```

```ts
import { TSON } from "loongbao";
```

对于前端开发者而言，您可以选择将 Loongbao 的响应视为普通的 JSON，并按照常规方式处理它们。或者，您可以安装 TSON，并利用其功能，将一些有用的类型自动还原为原始对象，以便更方便地操作这些数据。这使得您可以更轻松地处理那些包含了更多复杂数据类型的响应，无需手动转换和处理。

For frontend developers, you can choose to treat the responses from Loongbao as regular JSON and handle them in the usual way. Alternatively, you can install TSON and utilize its features to automatically restore some useful types to their original objects for easier manipulation of the data. This allows you to handle responses that contain more complex data types more easily without manual conversion and processing.

```sh
# bun
bun add @southern-aurora/tson

# npm
npm install @southern-aurora/tson
```

```sh
# bun
bun add @southern-aurora/tson

# npm
npm install @southern-aurora/tson
```

## 使用

## Usage

TSON 与 JSON 兼容，在大多数情况下，您可以简单地将代码中所有的 JSON 替换为 TSON。

TSON is compatible with JSON, and in most cases, you can simply replace all instances of JSON in your code with TSON.

序列化：

Serialization:

```ts
TSON.stringify({ hello: "world", date: new Date(0), url: new URL("https://example.com") });
// Output: '{"hello":"world","date":"t!Date:1970-01-01T00:00:00.000Z","url":"t!URL:https://example.com/"}'
```

```ts
TSON.stringify({ hello: "world", date: new Date(0), url: new URL("https://example.com") });
// Output: '{"hello":"world","date":"t!Date:1970-01-01T00:00:00.000Z","url":"t!URL:https://example.com/"}'
```

反序列化：

Deserialization:

```ts
TSON.parse(`{"hello":"world","date":"t!Date:1970-01-01T00:00:00.000Z","url":"t!URL:https://example.com/"}`);
// Output: { hello: "world", date: 1970-01-01T00:00:00.000Z, url: URL {...} }
```

```ts
TSON.parse(`{"hello":"world","date":"t!Date:1970-01-01T00:00:00.000Z","url":"t!URL:https://example.com/"}`);
// Output: { hello: "world", date: 1970-01-01T00:00:00.000Z, url: URL {...} }
```

## 原理

## Principles

TSON 会将 JSON 不支持的类型转换为字符串表示，例如：`"t!Date:1970-01-01T00:00:00.000Z"`。

TSON converts types that are not supported by JSON into string representations, for example: `"t!Date:1970-01-01T00:00:00.000Z"`.

该字符串由 TSON 前缀 `t!`、原对象的名称、和原对象的内容组成。原对象的内容会尽可能地被序列化为，可直接放置在对象构造函数中以便恢复的形式。您可以通过判断一个字符串是否以 `t!` 开头，来判断它是否是一个 TSON 前缀。

The string consists of the TSON prefix `t!`, the name of the original object, and the content of the original object. The content of the original object will be serialized as much as possible in a form that can be directly placed in an object constructor for recovery. You can determine whether a string starts with `t!` to determine if it has a TSON prefix.

## 默认支持的类型

## Default Supported Types

| 类型          | JSON | TSON |
| ------------- | ---- | ---- |
| `string`      | ✅   | ✅   |
| `number`      | ✅   | ✅   |
| `boolean`     | ✅   | ✅   |
| `null`        | ✅   | ✅   |
| `Array`       | ✅   | ✅   |
| `Object`      | ✅   | ✅   |
| `bigint`      | ❌   | ✅   |
| `Date`        | ❌   | ✅   |
| `RegExp`      | ❌   | ✅   |
| `URL`         | ❌   | ✅   |
| `Uint8Array`  | ❌   | ✅   |
| `ArrayBuffer` | ❌   | ✅   |

| Types         | JSON | TSON |
| ------------- | ---- | ---- |
| `string`      | ✅   | ✅   |
| `number`      | ✅   | ✅   |
| `boolean`     | ✅   | ✅   |
| `null`        | ✅   | ✅   |
| `Array`       | ✅   | ✅   |
| `Object`      | ✅   | ✅   |
| `bigint`      | ❌   | ✅   |
| `Date`        | ❌   | ✅   |
| `RegExp`      | ❌   | ✅   |
| `URL`         | ❌   | ✅   |
| `Uint8Array`  | ❌   | ✅   |
| `ArrayBuffer` | ❌   | ✅   |

注意：虽然 TSON 支持 Uint8Array 和 ArrayBuffer 类型，便于在网络传输中传递二进制文件。但这并不总是一个好主意，因为您还需要考虑分块传输、网络波动、带宽成本等因素。也许您实际所需的是类似于 [AWS S3](https://aws.amazon.com/cli/) 或 [TencentCloud COS](https://cloud.tencent.com/product/cos) 的服务？

Note: Although TSON supports Uint8Array and ArrayBuffer types for transmitting binary files over the network, it is not always a good idea because you also need to consider factors such as chunked transfer, network fluctuations, and bandwidth costs. Perhaps what you actually need is a service like [AWS S3](https://aws.amazon.com/cli/) or [TencentCloud COS](https://cloud.tencent.com/product/cos) ?

## 扩展更多类型

## Extend More Types

TSON 仅内置了常用的类型，您可以扩展更多类型。以常用的日期库 [Day.js](https://github.com/iamkun/dayjs) 为例。

TSON only includes the commonly used types, you can extend more types. For example, [Day.js](https://github.com/iamkun/dayjs) is used as an example.

```ts
import * as dayjs from "dayjs";

TSON.rules.stringify.push({
  match: (v) => v.$d instanceof Date,
  handler: (v: bigint) => `t!dayjs:${v.$d.toISOString()}`,
});

TSON.rules.parse.push({
  match: (v) => v.startsWith("t!dayjs:"),
  handler: (v: string) => dayjs(v.slice("t!dayjs:".length)),
});
```

```ts
import * as dayjs from "dayjs";

TSON.rules.stringify.push({
  match: (v) => v.$d instanceof Date,
  handler: (v: bigint) => `t!dayjs:${v.$d.toISOString()}`,
});

TSON.rules.parse.push({
  match: (v) => v.startsWith("t!dayjs:"),
  handler: (v: string) => dayjs(v.slice("t!dayjs:".length)),
});
```

我们通过判断一个对象是否存在 `$d` 属性，且该属性的值为 `Date` 类型来判断是否是 Day.js 日期对象。如果是，我们将其序列化为以 `t!dayjs:` 开头的字符串，以便在 JSON 中合法存储。注意，添加 TSON 规则的代码需要位于使用 TSON 的代码之前。

We can determine if an object is a Day.js date object by checking if it has a `$d` property with a value of type `Date`. If it is, we serialize it as a string starting with `dayjs:` to store it legally in JSON. Please note that the code for adding TSON rules needs to be placed before the code that uses TSON.

## 更多内置类型？

## More Built-in Types

TSON 对于添加更多内置类型非常谨慎，我们只会将常见的可能用于网络传输的类型内置到 TSON 中。以下类型虽然常见，但我们永远不会内置支持。

TSON is very cautious about adding more built-in types, and we will only include commonly used types for network transmission in TSON. The following types, although common, will never be natively supported.

### undefined

### undefined

JavaScript 会将不存在的值隐式转换为 `undefined`，因此在大多数情况下，您并不需要 TSON 支持 `undefined` 即可取到为 `undefined` 的值。而支持 `undefined` 将会增加传输的数据量。

JavaScript will implicitly convert non-existent values to `undefined`, so in most cases, you don't need TSON to support `undefined` in order to access the value that is `undefined`. Supporting `undefined` will increase the amount of data transferred.

### Set & Map

### Set & Map

大多数情况下，`Set`和`Map` 可以使用 Array & Object 来代替，并且它们可以轻松地与 Array & Object 相互转换。而且 Set & Map 语义是独立于 JSON 之外的，有些团队可能会倾向于使用 Set & Map 作为 Array & Object 的替代，来试图在某些场景下获得轻微的性能优势，但这么做除了会增加开发者的心智负担外，在 TSON 中序列化他们会拥有更低的性能，因为它们将被序列化两次。因此，TSON 不会内置支持 Set & Map。

In most cases, `Set` and `Map` can be replaced with Array & Object, and they can be easily converted back and forth with arrays & objects. Moreover, the semantics of Set & Map are independent of JSON. Some teams may prefer to use Set & Map as alternatives to Array & Object in order to achieve slight performance advantages in certain scenarios. However, doing so not only increases the mental burden on developers, but also results in lower performance when serializing them in TSON, as they will be serialized twice. Therefore, TSON does not have built-in support for Set & Map.

### Symbols

### Symbols

在网络传输中，我们无法保证他们是相等的，你是否在寻找 [cuid2](https://github.com/paralleldrive/cuid2) 或者其他类似的方案？

In network transmission, we cannot guarantee that they are equal. Are you looking for [cuid2](https://github.com/paralleldrive/cuid2) or similar solutions?

### Function

### Function

序列化函数涉及到许多问题，例如上下文中的变量以及潜在的安全风险。因此，TSON 永远不会内置支持函数。如果你想要将某些函数共享给前端，请考虑是否将其抽离成 npm 包是更好的解决方案。

The serialization function involves many issues, such as variables in the context and potential security risks. Therefore, TSON will never natively support functions. If you want to share certain functions with the frontend, consider whether extracting them into an npm package is a better solution.

</I18N>
