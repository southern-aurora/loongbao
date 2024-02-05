import{_ as e,c as o,o as a,V as s}from"./chunks/framework.ajfdQ9vp.js";const g=JSON.parse('{"title":"Serverless","description":"","frontmatter":{"title":"Serverless"},"headers":[],"relativePath":"old/docs/serverless.md","filePath":"old/docs/serverless.md"}'),r={name:"old/docs/serverless.md"},l=s('<h1 id="serverless" tabindex="-1">Serverless <a class="header-anchor" href="#serverless" aria-label="Permalink to &quot;Serverless&quot;">​</a></h1><p>在无服务器（Serverless）场景中，保持卓越的性能一直是 Loongbao 的首要目标之一。</p><p>在无服务器环境下，您的应用通常运行在受限且资源较低的容器中。同时，当您的应用一段时间没有被访问时，容器会被回收。而当您面临访问增长而资源不足时，将会快速拉起一个新的容器来保障您应用可以正常访问。因此，应用的冷启动速度至关重要。</p><h2 id="loongbao-是如何做的" tabindex="-1">Loongbao 是如何做的？ <a class="header-anchor" href="#loongbao-是如何做的" aria-label="Permalink to &quot;Loongbao 是如何做的？&quot;">​</a></h2><p>Loongbao 中的每个 <a href="/loongbao/old/docs/api.html">API</a> 和 <a href="/loongbao/old/docs/use.html">Use</a> 都采用了惰性加载的方式。在启动 Loongbao 时，只会启动一个 HTTP 服务器。当您实际调用某个 API 时，Loongbao 才会加载并执行相应的代码。这种策略在项目规模庞大时非常有效，能够节省大量的冷启动时间和内存，尤其是当您引入了一些较大的 SDK 时。</p><p>同样考虑到节约冷启动时间，Loongbao 没有选择创建工作线程池来利用多核心 CPU。Loongbao 假设您的应用运行在只被分配了一个 vCPU 核心的容器中。Loongbao 不建议直接在具有多个 CPU 核心的服务器上部署，因为这样会导致 Loongbao 无法充分利用多核心 CPU 的优势。我们建议您通过使用云服务提供商的 Serverless 服务来部署您的应用，或者通过在服务器上安装 Kubernetes 进行部署。如果您非常希望直接在服务器上部署，可以考虑使用 Nginx 作为负载均衡网关，并在其后面启动与服务器实际 CPU 核心数相匹配的 Loongbao 实例。</p><h2 id="硬件配置" tabindex="-1">硬件配置 <a class="header-anchor" href="#硬件配置" aria-label="Permalink to &quot;硬件配置&quot;">​</a></h2><p>我们编写了一个 Hello World 程序，它从 MySQL 中读取一行 Hello World 并将其返回给客户端。在使用 <code>--smol</code> 参数打包为单个二进制文件后，内存占用约为 50 MB 左右；而未经过打包直接运行，则约为 80 MB 左右。</p><p>当然，这只是一个参考值，实际的内存需求取决于您的应用场景。我们建议在上线之前进行压力测试，以确定您的应用实际所需的资源量。</p>',9),t=[l];function n(d,c,i,_,h,p){return a(),o("div",null,t)}const m=e(r,[["render",n]]);export{g as __pageData,m as default};
