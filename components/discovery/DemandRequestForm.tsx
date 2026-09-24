"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Sparkles, Send, ArrowLeft } from "lucide-react";
import { track } from "@/lib/analytics";

interface FormData {
  activity: string;
  kind: "board-game" | "sport";
  neighbourhood: string;
  timeWindow: string;
  groupSize: string;
  skill: string;
  email: string;
  notes: string;
}

const INITIAL_FORM: FormData = {
  activity: "",
  kind: "board-game",
  neighbourhood: "Koramangala",
  timeWindow: "this-weekend",
  groupSize: "solo",
  skill: "all-levels",
  email: "",
  notes: "",
};

export function DemandRequestForm() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.activity.trim()) {
      setError("Please specify the game or sport you would like to play.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please enter a valid email address to receive host match updates.");
      return;
    }

    setError(null);
    setSubmitting(true);

    // Simulate API submission
    await new Promise((resolve) => setTimeout(resolve, 600));

    track("demand_request_submit", {
      activity: formData.activity,
      neighbourhood: formData.neighbourhood,
      groupSize: formData.groupSize,
    });

    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-signal/30 bg-panel p-8 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-signal/40 bg-signal/10 text-signal">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest font-mono text-signal">
            DEMAND SIGNAL LOGGED
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
            We’ve Broadcast Your Request
          </h2>
          <p className="text-sm text-mist leading-relaxed">
            Your request for <strong className="text-white">{formData.activity}</strong> in{" "}
            <strong className="text-white">{formData.neighbourhood}</strong> has been shared with verified
            local hosts and venue partners.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left text-xs space-y-2 text-mist">
          <div className="flex justify-between">
            <span className="text-white/50">Target Area:</span>
            <span className="text-white font-medium">{formData.neighbourhood}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Timing:</span>
            <span className="text-white font-medium capitalize">{formData.timeWindow.replace("-", " ")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Group Size:</span>
            <span className="text-white font-medium capitalize">{formData.groupSize}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Updates to:</span>
            <span className="text-signal font-mono">{formData.email}</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/play"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-xs font-medium text-white hover:border-signal hover:text-signal transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Discover
          </Link>
          <button
            type="button"
            onClick={() => {
              setFormData(INITIAL_FORM);
              setSubmitted(false);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-signal bg-signal px-6 py-2.5 text-xs font-semibold text-black hover:bg-white transition-colors"
          >
            Request Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-panel p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Activity Kind Selector */}
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-wider text-mist font-mono">
            Activity Category
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, kind: "board-game" })}
              className={`rounded-xl border p-3 text-left transition-all ${
                formData.kind === "board-game"
                  ? "border-signal bg-signal/10 text-white"
                  : "border-white/10 bg-white/5 text-mist hover:text-white"
              }`}
            >
              <div className="font-semibold text-sm">Board Game / Tabletop</div>
              <div className="text-[11px] text-mist">Strategy, deduction, casual co-op</div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, kind: "sport" })}
              className={`rounded-xl border p-3 text-left transition-all ${
                formData.kind === "sport"
                  ? "border-signal bg-signal/10 text-white"
                  : "border-white/10 bg-white/5 text-mist hover:text-white"
              }`}
            >
              <div className="font-semibold text-sm">Sport / Active Turf</div>
              <div className="text-[11px] text-mist">Badminton, futsal, pickleball, chess</div>
            </button>
          </div>
        </div>

        {/* Activity Name */}
        <div className="space-y-2">
          <label htmlFor="activity" className="block text-xs uppercase tracking-wider text-mist font-mono">
            Game or Sport Title *
          </label>
          <input
            id="activity"
            type="text"
            required
            value={formData.activity}
            onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
            placeholder={
              formData.kind === "board-game"
                ? "e.g. Dune: Imperium, Terraforming Mars, Secret Hitler"
                : "e.g. 5v5 Futsal, Doubles Pickleball, Swiss Blitz Chess"
            }
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/60 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
          />
        </div>

        {/* Preferred Area & Date Window */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="neighbourhood" className="block text-xs uppercase tracking-wider text-mist font-mono">
              Preferred Area in Bengaluru
            </label>
            <select
              id="neighbourhood"
              value={formData.neighbourhood}
              onChange={(e) => setFormData({ ...formData, neighbourhood: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-surface px-4 py-2.5 text-sm text-white focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
            >
              <option value="Koramangala">Koramangala</option>
              <option value="Indiranagar">Indiranagar</option>
              <option value="HSR Layout">HSR Layout</option>
              <option value="Jayanagar">Jayanagar</option>
              <option value="Whitefield">Whitefield</option>
              <option value="JP Nagar">JP Nagar</option>
              <option value="Central Bengaluru">Central Bengaluru</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="timeWindow" className="block text-xs uppercase tracking-wider text-mist font-mono">
              Target Timing Window
            </label>
            <select
              id="timeWindow"
              value={formData.timeWindow}
              onChange={(e) => setFormData({ ...formData, timeWindow: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-surface px-4 py-2.5 text-sm text-white focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
            >
              <option value="tonight">Tonight / Immediate</option>
              <option value="this-weekend">This Upcoming Weekend</option>
              <option value="next-week">Next Week</option>
              <option value="flexible">Flexible / Anytime this Month</option>
            </select>
          </div>
        </div>

        {/* Group Size & Skill Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="groupSize" className="block text-xs uppercase tracking-wider text-mist font-mono">
              Your Group Size
            </label>
            <select
              id="groupSize"
              value={formData.groupSize}
              onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-surface px-4 py-2.5 text-sm text-white focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
            >
              <option value="solo">Solo (Match me with a table/team)</option>
              <option value="duo">Duo (2 players)</option>
              <option value="small-group">Small Group (3-5 players)</option>
              <option value="full-squad">Full Squad (6+ players)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="skill" className="block text-xs uppercase tracking-wider text-mist font-mono">
              Preferred Skill Level
            </label>
            <select
              id="skill"
              value={formData.skill}
              onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-surface px-4 py-2.5 text-sm text-white focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
            >
              <option value="all-levels">All Levels / Social</option>
              <option value="beginner">Beginner (Need rules explained)</option>
              <option value="intermediate">Intermediate / Regulars</option>
              <option value="advanced">Competitive / Rated</option>
            </select>
          </div>
        </div>

        {/* Contact Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-xs uppercase tracking-wider text-mist font-mono">
            Your Email for Match Notifications *
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="you@domain.com"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/60 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
          />
        </div>

        {/* Additional Notes */}
        <div className="space-y-2">
          <label htmlFor="notes" className="block text-xs uppercase tracking-wider text-mist font-mono">
            Specific Requests or Timing Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="e.g. Prefer weekdays after 7pm, or looking for players who know the Arrakis expansion..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/60 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-signal bg-signal px-6 py-3 text-sm font-semibold text-black hover:bg-white disabled:opacity-50 transition-all duration-200"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-spin" />
                Broadcasting to Bengaluru Hosts...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Submit Demand Request (USR-14)
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
