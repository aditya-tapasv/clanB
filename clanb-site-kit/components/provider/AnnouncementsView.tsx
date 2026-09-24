"use client";

import React, { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { formatDate, formatSessionTime, formatTime } from "@/lib/format";
import { repo } from "@/lib/data/repo";
import { useProvider, useProviderData } from "./ProviderContext";
import { loadAnnouncementsData } from "./loaders";
import { ErrorNote, LoadingBlock, PageHeader, Panel, inputClass, primaryButton } from "./ui";

/** Message everyone booked on a session, or all upcoming sessions (VEN-06). */
export function AnnouncementsView({ initialSessionId }: { initialSessionId?: string }) {
  const { orgId } = useProvider();
  const { data, loading, error, reload } = useProviderData(loadAnnouncementsData);
  const [sessionId, setSessionId] = useState(initialSessionId ?? "");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sentNote, setSentNote] = useState<string | null>(null);
  const [now] = useState(() => Date.now());

  const upcoming = (data?.sessions ?? []).filter(
    (s) => Date.parse(s.endsAt) > now && ["open", "full", "waitlist", "live", "published"].includes(s.status)
  );

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSendError(null);
    setSentNote(null);
    try {
      const a = await repo.sendAnnouncement({ organizationId: orgId, sessionId: sessionId || undefined, subject, body });
      setSentNote(`Sent to ${a.audienceCount} player${a.audienceCount === 1 ? "" : "s"}.`);
      setSubject("");
      setBody("");
      reload();
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Couldn't send.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageHeader title="Announcements" description="Updates go by email and in-app to everyone with a confirmed booking." />
      {error && <ErrorNote message={error} onRetry={reload} />}
      {!data ? (
        loading && <LoadingBlock rows={6} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <Panel title="Compose">
            <form onSubmit={send} noValidate className="space-y-3">
              <div>
                <label htmlFor="ann-session" className="mb-1 block text-[12px] text-mist">
                  Audience
                </label>
                <select id="ann-session" value={sessionId} onChange={(e) => setSessionId(e.target.value)} className={inputClass}>
                  <option value="">All upcoming sessions</option>
                  {upcoming.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} — {formatSessionTime(s.startsAt)} ({s.booked} booked)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="ann-subject" className="mb-1 block text-[12px] text-mist">
                  Subject
                </label>
                <input id="ann-subject" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={120} className={inputClass} />
              </div>
              <div>
                <label htmlFor="ann-body" className="mb-1 block text-[12px] text-mist">
                  Message
                </label>
                <textarea id="ann-body" rows={6} value={body} onChange={(e) => setBody(e.target.value)} maxLength={1000} className={inputClass} />
                <p className="mt-1 text-right font-mono text-[11px] text-zinc-500">{body.length}/1000</p>
              </div>
              {sendError && <ErrorNote message={sendError} />}
              {sentNote && (
                <p role="status" className="text-[13px] text-signal">
                  {sentNote}
                </p>
              )}
              <button type="submit" disabled={sending} className={primaryButton}>
                {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Send className="h-3.5 w-3.5" aria-hidden="true" />}
                Send announcement
              </button>
            </form>
          </Panel>

          <Panel title={`Sent (${data.announcements.length})`}>
            {data.announcements.length === 0 ? (
              <p className="text-[13px] text-mist">Nothing sent yet.</p>
            ) : (
              <ul className="divide-y divide-white/[0.06]">
                {data.announcements.map((a) => (
                  <li key={a.id} className="py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-white">{a.subject}</p>
                      <span className="shrink-0 font-mono text-[11px] text-zinc-500">
                        {formatDate(a.sentAt)} {formatTime(a.sentAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-[13px] text-mist">{a.body}</p>
                    <p className="mt-1 text-[11px] text-zinc-500">
                      {a.sessionId ? data.sessions.find((s) => s.id === a.sessionId)?.title ?? "One session" : "All upcoming"} ·{" "}
                      {a.audienceCount} recipients
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      )}
    </>
  );
}
