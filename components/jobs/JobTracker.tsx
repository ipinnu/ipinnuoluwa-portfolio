"use client";

import { useEffect, useMemo, useState } from "react";
import type { DraftType, Job, JobStatus } from "@/lib/types/jobs";
import { createEmptyJob, JOB_STATUSES } from "@/lib/types/jobs";

const STORE = "ipinnu-opportunity-desk-v1";
const label: Record<JobStatus, string> = { new: "New", saved: "Saved", applied: "Applied", interviewing: "Interviewing", rejected: "Rejected", offer: "Offer", dismissed: "Dismissed" };
const pipeline: JobStatus[] = ["saved", "applied", "interviewing", "offer", "rejected"];
const input = "w-full min-h-11 bg-bg-primary border border-border px-3 text-base text-text-primary outline-none focus:border-neon";

function SearchIcon() {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>;
}

function salary(job: Job) {
  if (job.salaryMin == null && job.salaryMax == null) return "Salary not listed";
  const fmt = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
  return `${job.currency || "USD"} ${job.salaryMin ? fmt.format(job.salaryMin) : "?"}–${job.salaryMax ? fmt.format(job.salaryMax) : "?"}`;
}

export default function JobTracker() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<JobStatus | "all">("all");
  const [remote, setRemote] = useState(false);
  const [view, setView] = useState<"feed" | "pipeline">("feed");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<Job | null>(null);
  const [drafting, setDrafting] = useState<DraftType | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try { const value = localStorage.getItem(STORE); if (value) setJobs(JSON.parse(value)); } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem(STORE, JSON.stringify(jobs)); }, [jobs, loaded]);

  const selected = jobs.find(job => job.id === selectedId) || null;
  const visible = useMemo(() => jobs.filter(job => {
    const text = `${job.title} ${job.company} ${job.description} ${job.employmentType}`.toLowerCase();
    return (!query || text.includes(query.toLowerCase())) && (filter === "all" || job.status === filter) && (!remote || job.remote);
  }).sort((a, b) => b.discoveredAt.localeCompare(a.discoveredAt)), [jobs, query, filter, remote]);
  const patch = (id: string, change: Partial<Job>) => setJobs(all => all.map(job => job.id === id ? { ...job, ...change } : job));
  const count = (status: JobStatus) => jobs.filter(job => job.status === status).length;

  async function draft(type: DraftType) {
    if (!selected) return;
    setDrafting(type); setMessage("");
    try {
      const response = await fetch("/api/jobs/draft", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, job: selected, cvVersion: selected.cvVersion, cvText: selected.cvText, contactPerson: selected.contactPerson, contactContext: selected.contactContext }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      patch(selected.id, { drafts: [{ id: crypto.randomUUID(), type, text: data.text, cvVersion: selected.cvVersion, createdAt: new Date().toISOString() }, ...selected.drafts] });
      setMessage(`Draft created with ${data.provider}.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Draft failed."); }
    setDrafting(null);
  }

  if (!loaded) return <main className="min-h-screen pt-28 text-center text-text-secondary">Loading opportunity desk…</main>;
  return <main className="min-h-screen bg-bg-primary pt-24 pb-16">
    <div className="max-w-[1440px] mx-auto px-4 md:px-6">
      <header className="border-b border-border pb-6 mb-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
        <div><p className="font-mono text-[10px] tracking-[0.2em] text-neon uppercase mb-2">Private workspace / Resources</p><h1 className="font-syne font-bold text-3xl md:text-5xl">Opportunity desk</h1><p className="text-text-secondary mt-2">Review premium roles, move applications forward, record market feedback.</p></div>
        <button onClick={() => setForm(createEmptyJob())} className="min-h-11 bg-neon text-black font-semibold px-5 py-3 cursor-pointer hover:bg-[#d8ef3f] transition-colors">+ Add job</button>
      </header>
      <section aria-label="Overview" className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[["To review", count("new")], ["Saved", count("saved")], ["Active", count("applied") + count("interviewing")], ["Offers", count("offer")]].map(([name, value]) => <div key={name} className="bg-bg-secondary border border-border p-4"><strong className="block font-syne text-2xl">{value}</strong><span className="text-xs text-text-secondary">{name}</span></div>)}
      </section>
      <div className="flex border-b border-border mb-5" role="tablist">{(["feed", "pipeline"] as const).map(tab => <button key={tab} onClick={() => setView(tab)} role="tab" aria-selected={view === tab} className={`min-h-11 px-4 capitalize font-mono text-xs cursor-pointer border-b-2 ${view === tab ? "border-neon text-neon" : "border-transparent text-text-secondary"}`}>{tab}</button>)}</div>
      {view === "feed" ? <>
        <div className="grid md:grid-cols-[1fr_auto_auto] gap-3 mb-5">
          <label className="relative"><span className="sr-only">Search jobs</span><span className="absolute left-3 top-3.5 text-text-tertiary"><SearchIcon /></span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search title, company, technology…" className={`${input} pl-10`} /></label>
          <select aria-label="Filter by status" value={filter} onChange={e => setFilter(e.target.value as JobStatus | "all")} className={`${input} cursor-pointer`}><option value="all">All statuses</option>{JOB_STATUSES.map(s => <option key={s} value={s}>{label[s]}</option>)}</select>
          <label className="min-h-11 flex items-center gap-2 bg-bg-secondary border border-border px-3 text-sm text-text-secondary cursor-pointer"><input type="checkbox" checked={remote} onChange={e => setRemote(e.target.checked)} className="accent-[#E8FF47]"/> Remote only</label>
        </div>
        <div className="grid lg:grid-cols-[minmax(0,.85fr)_minmax(360px,1.15fr)] border border-border min-h-[580px]">
          <div className="border-b lg:border-b-0 lg:border-r border-border max-h-[72vh] overflow-y-auto">{visible.length ? visible.map(job => <button key={job.id} onClick={() => setSelectedId(job.id)} className={`w-full text-left p-4 md:p-5 border-b border-border cursor-pointer transition-colors ${selectedId === job.id ? "bg-bg-tertiary" : "bg-bg-secondary hover:bg-bg-tertiary/70"}`}><div className="flex justify-between gap-3"><div><h2 className="font-syne font-semibold">{job.title}</h2><p className="text-sm text-text-secondary">{job.company}</p></div><span className="font-mono text-[9px] uppercase text-neon">{label[job.status]}</span></div><div className="flex flex-wrap gap-3 mt-3 font-mono text-[10px] text-text-tertiary"><span>{job.remote ? "Remote" : job.location || "Location unknown"}</span><span>{salary(job)}</span><span>{job.source}</span></div></button>) : <div className="p-10 text-center text-text-secondary">No jobs here yet. Add your first listing.</div>}</div>
          <Detail job={selected} patch={change => selected && patch(selected.id, change)} edit={() => selected && setForm(selected)} draft={draft} drafting={drafting} message={message}/>
        </div>
      </> : <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-3">{pipeline.map(status => <section key={status} className="bg-bg-secondary border border-border p-3"><div className="flex justify-between mb-3"><h2 className="font-mono text-[10px] uppercase text-text-secondary">{label[status]}</h2><span className="font-mono text-[10px] text-neon">{count(status)}</span></div><div className="space-y-2">{jobs.filter(job => job.status === status).map(job => <button key={job.id} onClick={() => { setSelectedId(job.id); setView("feed"); }} className="w-full text-left bg-bg-primary border border-border p-3 cursor-pointer hover:border-text-tertiary"><strong className="block text-sm">{job.title}</strong><span className="text-xs text-text-secondary">{job.company}</span><span className="block mt-2 text-[11px] text-text-tertiary line-clamp-2">{job.nextAction}</span></button>)}</div></section>)}</div>}
    </div>
    {form && <JobForm job={form} close={() => setForm(null)} save={job => { setJobs(all => all.some(item => item.id === job.id) ? all.map(item => item.id === job.id ? job : item) : [job, ...all]); setSelectedId(job.id); setForm(null); }}/>} 
  </main>;
}

function Detail({ job, patch, edit, draft, drafting, message }: { job: Job | null; patch: (change: Partial<Job>) => void; edit: () => void; draft: (type: DraftType) => void; drafting: DraftType | null; message: string }) {
  if (!job) return <div className="hidden lg:flex items-center justify-center text-text-tertiary">Select a job to review it.</div>;
  const field = (name: string, key: keyof Job, area = false) => <label className="block"><span className="block font-mono text-[9px] uppercase text-text-tertiary mb-1.5">{name}</span>{area ? <textarea value={String(job[key] || "")} onChange={e => patch({ [key]: e.target.value })} rows={3} className={`${input} py-3 resize-y`}/> : <input value={String(job[key] || "")} onChange={e => patch({ [key]: e.target.value })} className={input}/>}</label>;
  return <article className="p-5 md:p-7 overflow-y-auto max-h-[72vh]">
    <div className="flex justify-between gap-4 mb-5"><div><p className="font-mono text-[10px] uppercase text-neon mb-2">{job.source} / {label[job.status]}</p><h2 className="font-syne font-bold text-2xl">{job.title}</h2><p className="text-text-secondary">{job.company} · {job.remote ? "Remote" : job.location || "Unknown"}</p></div><button onClick={edit} className="min-h-11 px-3 border border-border cursor-pointer hover:border-text-tertiary">Edit</button></div>
    <div className="flex flex-wrap gap-2 mb-6"><select aria-label="Job status" value={job.status} onChange={e => patch({ status: e.target.value as JobStatus, appliedAt: e.target.value === "applied" && !job.appliedAt ? new Date().toISOString().slice(0,10) : job.appliedAt })} className={`${input} w-auto cursor-pointer`}>{JOB_STATUSES.map(s => <option key={s} value={s}>{label[s]}</option>)}</select>{job.applicationUrl && <a href={job.applicationUrl} target="_blank" rel="noreferrer" className="min-h-11 inline-flex items-center px-4 bg-neon text-black font-semibold">Open listing ↗</a>}</div>
    <p className="text-sm leading-7 text-text-secondary whitespace-pre-wrap mb-7">{job.description || "No description saved."}</p>
    <div className="grid md:grid-cols-2 gap-4 mb-7">{field("Why save it", "savedReason", true)}{field("Next action", "nextAction", true)}{field("Missing requirements", "missingRequirements", true)}{field("Follow-up date", "followUpAt")}{field("Contact person", "contactPerson")}{field("Compensation discussed", "compensationDiscussed")}{field("Interview notes", "interviewNotes", true)}{field(job.status === "rejected" ? "Rejection reason" : "Response", job.status === "rejected" ? "rejectionReason" : "response", true)}</div>
    <section className="border-t border-border pt-6"><div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4"><div><p className="font-mono text-[10px] uppercase text-neon">Drafting assistance</p><h3 className="font-syne font-semibold text-lg">Application material</h3></div><div className="flex gap-2"><button disabled={!!drafting} onClick={() => draft("cover_letter")} className="min-h-11 px-3 border border-border cursor-pointer disabled:opacity-50">{drafting === "cover_letter" ? "Drafting…" : "Cover letter"}</button><button disabled={!!drafting} onClick={() => draft("outreach")} className="min-h-11 px-3 border border-border cursor-pointer disabled:opacity-50">{drafting === "outreach" ? "Drafting…" : "Outreach note"}</button></div></div>
      <div className="grid md:grid-cols-2 gap-3 mb-3">{field("CV version", "cvVersion")}{field("Recruiter context", "contactContext")}</div>{field("CV text", "cvText", true)}{message && <p className="mt-3 text-sm text-neon">{message}</p>}
      <div className="mt-5 space-y-3">{job.drafts.map(item => <div key={item.id} className="border border-border bg-bg-secondary p-4"><div className="flex justify-between mb-3"><span className="font-mono text-[9px] uppercase text-neon">{item.type.replace("_", " ")}</span><span className="font-mono text-[9px] text-text-tertiary">{new Date(item.createdAt).toLocaleString()}</span></div><textarea aria-label={`${item.type} draft`} value={item.text} onChange={e => patch({ drafts: job.drafts.map(d => d.id === item.id ? { ...d, text: e.target.value } : d) })} rows={8} className="w-full bg-transparent text-sm leading-6 outline-none resize-y"/></div>)}</div>
    </section>
  </article>;
}

function JobForm({ job: initial, close, save }: { job: Job; close: () => void; save: (job: Job) => void }) {
  const [job, setJob] = useState(initial);
  const set = (key: keyof Job, value: unknown) => setJob(current => ({ ...current, [key]: value }));
  return <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center md:p-6"><form onSubmit={e => { e.preventDefault(); save(job); }} className="bg-bg-secondary border border-border w-full md:max-w-2xl max-h-[92vh] overflow-y-auto p-5 md:p-7"><div className="flex justify-between mb-6"><div><p className="font-mono text-[9px] uppercase text-neon">Manual capture</p><h2 className="font-syne font-bold text-2xl">Add job</h2></div><button type="button" aria-label="Close" onClick={close} className="w-11 h-11 border border-border cursor-pointer">×</button></div><div className="grid md:grid-cols-2 gap-4">
    {[["Title *","title"],["Company *","company"],["Location","location"],["Employment type","employmentType"],["Application URL","applicationUrl"],["Deadline","deadline"]].map(([name,key]) => <label key={key}><span className="block text-xs text-text-secondary mb-1.5">{name}</span><input required={name.includes("*")} value={String(job[key as keyof Job] || "")} onChange={e => set(key as keyof Job, e.target.value)} className={input}/></label>)}
    <label><span className="block text-xs text-text-secondary mb-1.5">Source</span><select value={job.source} onChange={e => set("source", e.target.value)} className={`${input} cursor-pointer`}>{["manual","greenhouse","lever","remoteok","adzuna"].map(source => <option key={source}>{source}</option>)}</select></label><label className="flex items-end"><span className="min-h-11 w-full flex items-center gap-2 bg-bg-primary border border-border px-3 cursor-pointer"><input type="checkbox" checked={job.remote} onChange={e => set("remote", e.target.checked)} className="accent-[#E8FF47]"/> Remote role</span></label>
    <label><span className="block text-xs text-text-secondary mb-1.5">Salary minimum</span><input type="number" value={job.salaryMin || ""} onChange={e => set("salaryMin", e.target.value ? Number(e.target.value) : null)} className={input}/></label><label><span className="block text-xs text-text-secondary mb-1.5">Salary maximum</span><input type="number" value={job.salaryMax || ""} onChange={e => set("salaryMax", e.target.value ? Number(e.target.value) : null)} className={input}/></label>
    <label className="md:col-span-2"><span className="block text-xs text-text-secondary mb-1.5">Description *</span><textarea required rows={8} value={job.description} onChange={e => set("description", e.target.value)} className={`${input} py-3 resize-y`}/></label></div><div className="flex justify-end gap-2 mt-6"><button type="button" onClick={close} className="min-h-11 px-5 border border-border cursor-pointer">Cancel</button><button className="min-h-11 px-5 bg-neon text-black font-semibold cursor-pointer">Save job</button></div></form></div>;
}
