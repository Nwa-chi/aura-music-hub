import { AwsClient } from "aws4fetch";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function safeFilename(filename) {
  return filename.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function onRequestPost({ request, env }) {
  const authorization = request.headers.get("authorization");
  if (!authorization) return json({ error: "Sign in before uploading." }, 401);

  const userResponse = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: { authorization, apikey: env.SUPABASE_ANON_KEY },
  });
  if (!userResponse.ok) return json({ error: "Your session is no longer valid." }, 401);

  const user = await userResponse.json();
  const { filename, contentType, kind = "audio" } = await request.json();
  if (!filename || !contentType) return json({ error: "File details are required." }, 400);
  if (!contentType.startsWith(kind === "cover" ? "image/" : "audio/")) {
    return json({ error: `A valid ${kind} file is required.` }, 400);
  }

  const key = `uploads/${user.id}/${kind}/${crypto.randomUUID()}-${safeFilename(filename)}`;
  const endpoint = `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${env.R2_BUCKET_NAME}/${key}`;
  const signer = new AwsClient({
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    region: "auto",
    service: "s3",
  });
  const url = new URL(endpoint);
  url.searchParams.set("X-Amz-Expires", "900");
  const signed = await signer.sign(new Request(url, {
    method: "PUT",
    headers: { "content-type": contentType },
  }), { aws: { signQuery: true } });

  return json({
    uploadUrl: signed.url,
    key,
    publicUrl: `${env.R2_PUBLIC_BASE_URL.replace(/\/$/, "")}/${key}`,
  });
}
