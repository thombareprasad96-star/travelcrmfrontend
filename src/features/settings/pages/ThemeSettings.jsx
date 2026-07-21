import { useEffect, useRef, useState } from "react";
import { Download, Palette, RotateCcw, Save, Upload } from "lucide-react";
import { useTheme } from "@shared/theme/ThemeProvider";
import { themeService } from "@shared/theme/themeService";
import { DEFAULT_THEME, mergeTheme } from "@shared/theme/themeDefaults";
import { companyService } from "../api/companyService";

const COLORS = ["primaryColor","secondaryColor","accentColor","sidebarBg","headerBg","surfaceColor","borderColor","textPrimary","textSecondary","loginBackground"];
const LABEL = (key) => key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
const unwrap = (r) => r?.data?.data ?? r?.data;

export default function ThemeSettings() {
  const { theme, branding, install } = useTheme();
  const [draft, setDraft] = useState(() => mergeTheme(theme));
  const [saving, setSaving] = useState(false);
  const input = useRef(null);
  const logoInput = useRef(null);
  const faviconInput = useRef(null);
  const backgroundInput = useRef(null);
  useEffect(() => setDraft(mergeTheme(theme)), [theme]);
  const change = (key, value) => { const next={...draft,[key]:value}; setDraft(next); install({...branding,values:next},false); };
  const save = async () => { setSaving(true); try { install(unwrap(await themeService.update(draft))); } finally { setSaving(false); } };
  const reset = async () => { const data=unwrap(await themeService.reset()); setDraft(data.values); install(data); };
  const exportTheme = () => { const blob=new Blob([JSON.stringify({values:draft},null,2)],{type:"application/json"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="tenant-theme.json"; a.click(); URL.revokeObjectURL(a.href); };
  const importTheme = async (file) => { const json=JSON.parse(await file.text()); const values=mergeTheme(json.values||json); const data=unwrap(await themeService.importTheme(values)); setDraft(data.values); install(data); };
  const uploadCompanyAsset = async (kind, file) => { setSaving(true); try { if(kind==="logo") await companyService.uploadLogo(file); else await companyService.uploadFavicon(file); window.dispatchEvent(new Event("company-updated")); } finally { setSaving(false); } };
  const uploadBackground = async (file) => { setSaving(true); try { const data=unwrap(await themeService.uploadLoginBackground(file)); setDraft(data.values); install(data); } finally { setSaving(false); } };

  return <main className="min-h-full bg-page p-6 text-theme">
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="flex items-center gap-2 text-2xl font-extrabold"><Palette className="text-primary"/>Branding & Theme</h1><p className="text-sm text-muted">Changes preview instantly and apply to every signed-in user after saving.</p></div><div className="flex gap-2"><button className="theme-btn-secondary" onClick={reset}><RotateCcw size={16}/>Reset</button><button className="theme-btn-secondary" onClick={()=>input.current.click()}><Upload size={16}/>Import</button><input ref={input} hidden type="file" accept="application/json" onChange={(e)=>e.target.files[0]&&importTheme(e.target.files[0])}/><button className="theme-btn-secondary" onClick={exportTheme}><Download size={16}/>Export</button><button className="theme-btn-primary" disabled={saving} onClick={save}><Save size={16}/>{saving?"Saving…":"Save theme"}</button></div></header>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        <section className="theme-card space-y-6"><div><h2 className="font-bold">Color system</h2><p className="text-xs text-muted">All components consume these semantic tokens.</p></div><div className="grid gap-4 sm:grid-cols-2">{COLORS.map(key=><label key={key} className="text-sm font-semibold">{LABEL(key)}<span className="mt-1 flex items-center gap-2"><input type="color" value={draft[key]} onChange={e=>change(key,e.target.value.toUpperCase())} className="h-10 w-12 rounded border-theme"/><input className="theme-input font-mono" value={draft[key]} onChange={e=>change(key,e.target.value)}/></span></label>)}</div>
          <div className="grid gap-4 sm:grid-cols-2">{[["fontFamily",["Plus Jakarta Sans","Inter","Roboto","Open Sans","Lato","Poppins","system-ui"]],["colorMode",["light","dark","system"]],["sidebarStyle",["solid","gradient","compact"]],["headerStyle",["light","colored","transparent"]],["buttonStyle",["rounded","pill","square"]],["cardStyle",["flat","bordered","elevated"]],["borderRadius",["0","0.25rem","0.5rem","0.75rem","1rem"]]].map(([key,options])=><label key={key} className="text-sm font-semibold">{LABEL(key)}<select className="theme-input mt-1" value={draft[key]} onChange={e=>change(key,e.target.value)}>{options.map(x=><option key={x}>{x}</option>)}</select></label>)}</div>
          <div className="border-t border-theme pt-5"><h3 className="font-bold">Brand assets</h3><p className="mb-3 text-xs text-muted">Uploads are isolated to this tenant and update the application immediately.</p><div className="flex flex-wrap gap-2"><button className="theme-btn-secondary" onClick={()=>logoInput.current.click()}>Upload logo</button><button className="theme-btn-secondary" onClick={()=>faviconInput.current.click()}>Upload favicon</button><button className="theme-btn-secondary" onClick={()=>backgroundInput.current.click()}>Login background</button></div><input hidden ref={logoInput} type="file" accept="image/*" onChange={e=>e.target.files[0]&&uploadCompanyAsset("logo",e.target.files[0])}/><input hidden ref={faviconInput} type="file" accept=".ico,.png,image/png,image/x-icon" onChange={e=>e.target.files[0]&&uploadCompanyAsset("favicon",e.target.files[0])}/><input hidden ref={backgroundInput} type="file" accept="image/*" onChange={e=>e.target.files[0]&&uploadBackground(e.target.files[0])}/></div>
        </section>
        <section className="theme-card overflow-hidden p-0"><div className="border-b border-theme bg-header px-5 py-4 font-bold">Live preview</div><div className="grid min-h-[620px] grid-cols-[180px_1fr]"><aside className="bg-sidebar p-4 text-white"><div className="mb-8 text-lg font-extrabold">{branding.tenantName||"Your company"}</div>{["Dashboard","Leads","Bookings","Customers","Reports"].map((x,i)=><div key={x} className={`mb-2 rounded-theme px-3 py-2 text-sm ${i===0?"bg-primary":"text-white/70"}`}>{x}</div>)}</aside><div className="bg-page"><div className="bg-header border-b border-theme p-4 text-sm font-semibold">Welcome back</div><div className="space-y-4 p-5"><div className="grid grid-cols-2 gap-4">{["New leads","Revenue","Bookings","Tasks"].map((x,i)=><div className="theme-card" key={x}><p className="text-xs text-muted">{x}</p><p className="mt-1 text-2xl font-extrabold">{[24,"₹1.2L",18,7][i]}</p></div>)}</div><div className="theme-card"><div className="mb-4 flex justify-between"><b>Recent activity</b><button className="theme-btn-primary">Create new</button></div>{[1,2,3,4].map(x=><div key={x} className="flex justify-between border-t border-theme py-3 text-sm"><span>Sample customer {x}</span><span className="text-muted">Updated today</span></div>)}</div></div></div></div></section>
      </div>
    </div>
  </main>;
}
