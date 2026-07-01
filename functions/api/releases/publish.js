function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function ownerEmails(env) {
  return Array.from(new Set([
    "udeinno01@gmail.com",
    ...(env.AURA_OWNER_EMAILS || env.NEXT_PUBLIC_AURA_OWNER_EMAILS || "").split(/[,\s]+/),
  ].map((email) => email.trim().toLowerCase()).filter(Boolean)));
}

async function getSignedInUser(request, env) {
  const authorization = request.headers.get("authorization");
  if (!authorization) return { error: "Sign in as the owner before publishing.", status: 401 };

  const response = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: { authorization, apikey: env.SUPABASE_ANON_KEY },
  });
  if (!response.ok) return { error: "Your owner session is no longer valid.", status: 401 };

  const user = await response.json();
  if (!ownerEmails(env).includes(user.email?.toLowerCase())) {
    return { error: "Only the configured AURA owner can publish releases.", status: 403 };
  }

  return { user, authorization };
}

async function logRelease(env, authorization, body, userEmail, deployResult) {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) return;
  await fetch(`${env.SUPABASE_URL}/rest/v1/release_logs`, {
    method: "POST",
    headers: {
      authorization,
      apikey: env.SUPABASE_ANON_KEY,
      "content-type": "application/json",
      prefer: "return=minimal",
    },
    body: JSON.stringify({
      version: body.version || "unknown",
      status: "published",
      notes: body.notes || `Owner ${userEmail} triggered Cloudflare deployment.`,
    }),
  });
  await fetch(`${env.SUPABASE_URL}/rest/v1/owner_change_events`, {
    method: "POST",
    headers: {
      authorization,
      apikey: env.SUPABASE_ANON_KEY,
      "content-type": "application/json",
      prefer: "return=minimal",
    },
    body: JSON.stringify({
      change_type: "publish",
      title: `Release ${body.version || "unknown"} publish triggered`,
      detail: deployResult,
      actor_email: userEmail,
      metadata: { version: body.version, commit: body.commit, source: "admin_dashboard" },
    }),
  });
}

export async function onRequestPost({ request, env }) {
  const auth = await getSignedInUser(request, env);
  if (auth.error) return json({ error: auth.error }, auth.status);

  if (!env.CLOUDFLARE_PAGES_DEPLOY_HOOK_URL) {
    return json({
      error: "Cloudflare deploy hook is not configured.",
      missing: "CLOUDFLARE_PAGES_DEPLOY_HOOK_URL",
      nextStep: "Create a Cloudflare Pages deploy hook and save it as a Pages secret. The button will then trigger a real deployment.",
    }, 428);
  }

  const body = await request.json().catch(() => ({}));
  const deployResponse = await fetch(env.CLOUDFLARE_PAGES_DEPLOY_HOOK_URL, { method: "POST" });
  const deployText = await deployResponse.text();

  if (!deployResponse.ok) {
    return json({
      error: "Cloudflare did not accept the publish request.",
      status: deployResponse.status,
      details: deployText.slice(0, 500),
    }, 502);
  }

  const detail = "Cloudflare Pages deployment was triggered by the owner dashboard.";
  await logRelease(env, auth.authorization, body, auth.user.email, detail);

  return json({
    ok: true,
    message: detail,
    version: body.version || "unknown",
    commit: body.commit || null,
    cloudflare: deployText ? deployText.slice(0, 500) : "Deploy hook accepted.",
  });
}
