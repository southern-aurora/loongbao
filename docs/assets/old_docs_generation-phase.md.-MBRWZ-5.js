import{_ as o,c as e,o as a,V as t}from"./chunks/framework.ajfdQ9vp.js";const g=JSON.parse('{"title":"Generation Phase","description":"","frontmatter":{"title":"Generation Phase"},"headers":[],"relativePath":"old/docs/generation-phase.md","filePath":"old/docs/generation-phase.md"}'),s={name:"old/docs/generation-phase.md"},r=t('<h1 id="生成阶段" tabindex="-1">生成阶段 <a class="header-anchor" href="#生成阶段" aria-label="Permalink to &quot;生成阶段&quot;">​</a></h1><p>Loongbao 在正式启动前，会进入生成阶段。</p><p>生成阶段是完成您创建一个文件后，无需编写路由代码就可以直接访问的&quot;魔法&quot;的来源。当您创建了新的 <a href="/loongbao/old/docs/api.html">API 文件</a>，或修改了 <a href="/loongbao/old/docs/api.html">API 文件</a> 的内容时，Loongbao 会自动重新运行，并重新生成。</p><p>而当您修改了之外的代码逻辑，例如 <a href="/loongbao/old/docs/use.html">Use</a> 时，Loongbao 会通过热更新的方式，使您不需要再等待重新运行，即可直接看到新的代码效果。</p><h2 id="细节" tabindex="-1">细节 <a class="header-anchor" href="#细节" aria-label="Permalink to &quot;细节&quot;">​</a></h2><p>总而言之，生成阶段会完成以下几件事：</p><ul><li><p>递归扫描您的 <code>/src/app</code> 目录，并将您的 API 的路由，生成在 <code>/generate/api-schema.ts</code> 文件中。每次有新的请求时，会尝试从这个文件中匹配所对应的 API 并执行。</p></li><li><p>单层扫描您的 <code>/src/bootstrap</code> 目录，并将您的 Bootstrap 的概要，生成在 <code>/generate/bootstrap-schema.ts</code> 文件中。每次 Loongbao 启动时，会尝试执行您所有的 Bootstrap 中的代码。</p></li><li><p>将您所有的的 API 的所有的 params 的校验代码，生成在 <code>/generate/products/api-params.ts</code> 文件中。由它来保障，您的 API 参数的类型安全与数据校验。</p></li></ul>',7),n=[r];function c(d,p,i,l,h,_){return a(),e("div",null,n)}const u=o(s,[["render",c]]);export{g as __pageData,u as default};
