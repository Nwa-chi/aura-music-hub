import Link from "next/link";

const updated = "July 1, 2026";

export const legalDocs = {
  privacy: {
    title: "Privacy Policy",
    summary: "How AURA collects, uses, protects, and deletes account, listening, upload, and support data.",
    sections: [
      ["Information we collect", "AURA may collect account details, email address, profile settings, favorites, followed artists, listening history, uploads, content reports, support messages, device information, and basic analytics needed to run the service."],
      ["How we use information", "We use this information to provide streaming, synchronized lyrics, favorites, recommendations, uploads, owner moderation, support, fraud prevention, security, legal compliance, and product improvement."],
      ["Music uploads", "When you upload music, lyrics, cover art, or artist information, you confirm you have the rights to share it. Uploaded content may be reviewed, rejected, disabled, or removed if it violates rights, safety rules, or AURA policies."],
      ["Storage and processors", "AURA may use Supabase for account and database services, Cloudflare for hosting and storage, and other trusted service providers needed for security, analytics, support, and app delivery."],
      ["Your choices", "You can sign out, request account deletion, delete eligible uploaded content, contact support, or ask the owner to review personal data connected to your account."],
      ["Contact", "For privacy requests, contact support@auramusichub.com. AURA will review deletion and access requests as quickly as reasonably possible."],
    ],
  },
  terms: {
    title: "Terms of Service",
    summary: "The rules for using AURA as a listener, artist, uploader, or owner/admin.",
    sections: [
      ["Your account", "You are responsible for the email address and activity connected to your account. Do not share access in a way that compromises the service or other users."],
      ["Rights to content", "You may only upload songs, samples, lyrics, cover images, names, artist identity, and metadata that you own or have permission to use."],
      ["Streaming license", "By uploading content, you give AURA permission to host, stream, display, process, moderate, and promote that content inside the app until it is removed or disabled."],
      ["Prohibited conduct", "Do not upload infringing content, impersonate artists, scrape the service, bypass security, submit harmful files, abuse reports, or use AURA for unlawful activity."],
      ["Moderation", "AURA may reject, disable, remove, or limit content and accounts when needed for rights, safety, store compliance, legal compliance, or app integrity."],
      ["Service changes", "Features may change over time. Owner-approved releases may be saved before public publishing so changes can be reviewed and versioned."],
    ],
  },
  dmca: {
    title: "Copyright and DMCA Policy",
    summary: "How copyright owners can report music, lyrics, samples, artwork, or identity problems.",
    sections: [
      ["Report copyright concerns", "If you believe content on AURA infringes your rights, email support@auramusichub.com with the content title, artist name, URL if available, your contact information, and a clear explanation of the rights issue."],
      ["What to include", "Include proof of ownership or authorization, the exact content being reported, your good-faith statement, and confirmation that the information in your notice is accurate."],
      ["Review process", "AURA may disable reported content while reviewing. The owner/admin can reject, remove, restore, or request more information."],
      ["Counter-notices", "If your upload was removed by mistake, contact support@auramusichub.com with evidence that you own or are licensed to use the content."],
      ["Repeat infringement", "Accounts that repeatedly upload infringing content may lose upload access or be removed."],
    ],
  },
  "upload-rules": {
    title: "Upload Rules",
    summary: "What creators must confirm before uploading songs, lyrics, artwork, and artist information.",
    sections: [
      ["Rights checklist", "Before upload, confirm you have rights to every song, vocal, instrumental, sample, beat, lyric, cover image, artist photo, artist name, and featured artist identity."],
      ["Metadata quality", "Use accurate song titles, artist names, albums, genres, collection tags, lyrics, and credits. Do not mislabel content to gain discovery advantages."],
      ["Safety and quality", "Do not upload malware, deceptive files, explicit illegal content, impersonation, hate content, harassment, or anything that creates store or legal risk."],
      ["Review status", "Uploads may be saved as draft, pending, published, rejected, or disabled. The owner/admin decides what becomes public."],
      ["Deletion", "Eligible uploaded content can be deleted from the account area or removed by contacting support@auramusichub.com."],
    ],
  },
  "account-deletion": {
    title: "Account and Data Deletion",
    summary: "How listeners and creators can request deletion of an AURA account and related data.",
    sections: [
      ["In-app request", "Open your AURA account panel, choose Request deletion, and the owner/admin deletion queue will record your request."],
      ["Email request", "You can also email support@auramusichub.com from the account email address with the subject Account deletion request."],
      ["What may be deleted", "AURA can delete profile details, favorites, follows, listening history, reports linked to your account where legally allowed, and eligible uploads you control."],
      ["What may be retained", "AURA may retain limited records when needed for security, fraud prevention, copyright disputes, legal compliance, or financial/accounting requirements."],
      ["Uploaded content", "If content was public, copied, reported, licensed, or involved in a dispute, AURA may need to review it before removal."],
    ],
  },
};

export function LegalDocument({ docKey }) {
  const doc = legalDocs[docKey] || legalDocs.privacy;
  return <main className="legal-page">
    <nav className="legal-nav" aria-label="Legal pages">
      <Link href="/">AURA</Link>
      {Object.entries(legalDocs).map(([key, item]) => <Link key={key} href={`/${key}`} className={key === docKey ? "active" : ""}>{item.title.replace(" Policy", "")}</Link>)}
    </nav>
    <article className="legal-doc">
      <p className="eyebrow">AURA legal readiness</p>
      <h1>{doc.title}</h1>
      <p className="legal-summary">{doc.summary}</p>
      <p className="muted">Last updated: {updated}</p>
      {doc.sections.map(([title, body]) => <section key={title}>
        <h2>{title}</h2>
        <p>{body}</p>
      </section>)}
      <p className="legal-note">This page is an operational policy template for AURA. Have a qualified lawyer review it before relying on it for high-traffic public launch or store submission.</p>
    </article>
  </main>;
}
