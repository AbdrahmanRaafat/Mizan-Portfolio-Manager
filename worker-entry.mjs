import app from "./server/index.js";

const APP_DEMO_OLD = "commit({version:2,demo:true,transactions,quotes:{}});";
const APP_DEMO_NEW = "commit({version:2,demo:true,demoVersion:2,transactions,quotes:{}});";
const APP_START_OLD = "if(!localStorage.getItem('mizan-v2')&&!state.transactions.length&&!state.cash){loadDemo();}else render();schedule();refresh();";
const APP_START_NEW = "if((state.demo&&state.demoVersion!==2)||(!localStorage.getItem('mizan-v2')&&!state.transactions.length&&!state.cash)){loadDemo();}else render();schedule();refresh();";
const CORE_OLD = "return {version:2,transactions,quotes,demo:input.demo===true,...(input.cash?{cash:validateCash(input.cash)}:{})};";
const CORE_NEW = "return {version:2,transactions,quotes,demo:input.demo===true,demoVersion:Number.isInteger(input.demoVersion)?input.demoVersion:0,...(input.cash?{cash:validateCash(input.cash)}:{})};";

function patchedResponse(response, text) {
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  headers.set("cache-control", "no-cache");
  return new Response(text, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request, env, ctx) {
    const response = await app.fetch(request, env, ctx);
    const path = new URL(request.url).pathname;

    if (response.ok && path === "/app.js") {
      let text = await response.text();
      text = text.replace(APP_DEMO_OLD, APP_DEMO_NEW).replace(APP_START_OLD, APP_START_NEW);
      return patchedResponse(response, text);
    }

    if (response.ok && path === "/core.mjs") {
      let text = await response.text();
      text = text.replace(CORE_OLD, CORE_NEW);
      return patchedResponse(response, text);
    }

    return response;
  },
};
