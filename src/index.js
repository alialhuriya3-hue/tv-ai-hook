function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return new Response("TradingView webhook is online.");
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    let alert;
    try {
      alert = await request.json();
    } catch {
      return json({ error: "Send JSON only" }, 400);
    }

    if (!env.WEBHOOK_SECRET || alert.secret !== env.WEBHOOK_SECRET) {
      return json({ error: "Unauthorized" }, 401);
    }

    return json({
      ok: true,
      message: "TradingView alert received",
      symbol: alert.symbol,
      price: alert.price,
      signal: alert.signal,
      time: alert.time,
    });
  },
};
