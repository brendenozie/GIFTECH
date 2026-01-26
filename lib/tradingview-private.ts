// lib/tradingview-private.ts
let cachedSession: {
  cookies: string;
  csrf: string;
  expires: number;
} | null = null;

async function loginTradingView() {
  const res = await fetch("https://www.tradingview.com/accounts/signin/", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      origin: "https://www.tradingview.com",
      referer: "https://www.tradingview.com/",
      "user-agent": "Mozilla/5.0",
    },
    body: new URLSearchParams({
      username: process.env.TV_USER!,
      password: process.env.TV_PASS!,
      remember: "on",
    }),
    redirect: "manual",
  });

  const cookies = res.headers.get("set-cookie") || "";
  const csrfMatch = cookies.match(/csrf_token=([^;]+)/);

  if (!csrfMatch) throw new Error("No CSRF token");

  cachedSession = {
    cookies,
    csrf: csrfMatch[1],
    expires: Date.now() + 1000 * 60 * 20,
  };

  return cachedSession;
}

async function getSession() {
  if (cachedSession && cachedSession.expires > Date.now()) {
    return cachedSession;
  }
  return loginTradingView();
}

export async function grantTradingViewAccess(username: string) {
  const session = await getSession();

  const res = await fetch("https://www.tradingview.com/pine_perm/add/", {
    method: "POST",
    headers: {
      cookie: session.cookies,
      "x-csrf-token": session.csrf,
      "content-type": "application/json",
      referer: "https://www.tradingview.com/",
      "user-agent": "Mozilla/5.0",
    },
    body: JSON.stringify({
      username,
      script_id: process.env.TV_SCRIPT_ID,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt);
  }
}
