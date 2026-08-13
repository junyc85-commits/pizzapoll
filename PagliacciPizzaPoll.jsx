
import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Minus, Trophy, Pizza, RotateCcw, CheckCircle2, Users, ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "./supabaseClient";

const MAX_VOTES = 6;

const pizzas = [
  { id: "lil-woodys-primo", name: "Lil Woody's Primo", category: "Seasonal", vegetarian: false, prices: "11\" $27.99 · 13\" $31.99 · 17\" $36.99", desc: "Ground beef, bacon, onions, pickles, tomatoes, cheddar and mozzarella on olive oil, finished with fry sauce after bake." },
  { id: "summer-heirloom", name: "Summer Heirloom", category: "Seasonal", vegetarian: true, prices: "11\" $23.49 · 13\" $27.49 · 17\" $32.49", desc: "Original cheese pizza finished with fresh heirloom tomatoes, sea salt and basil after bake." },
  { id: "create-your-own", name: "Create Your Own", category: "Pagliacci Favorites", vegetarian: false, prices: "Base: 11\" $18.99 · 13\" $22.99 · 17\" $26.99", desc: "Custom pie with toppings and base of your choice." },
  { id: "original-cheese", name: "Original Cheese", category: "Pagliacci Favorites", vegetarian: true, prices: "11\" $18.99 · 13\" $22.99 · 17\" $26.99", desc: "Whole-milk mozzarella and seasoned tomato sauce on hand-tossed dough, baked on bricks." },
  { id: "burrata-soppressata", name: "Burrata Soppressata", category: "Pagliacci Favorites", vegetarian: false, prices: "11\" $27.99 · 13\" $31.99 · 17\" $36.99", desc: "Soppressata, tomatoes, burrata and red pepper flakes, finished with arugula tossed in olive oil and sea salt." },
  { id: "da-vito-primo", name: "Da Vito Primo", category: "Pagliacci Favorites", vegetarian: false, prices: "11\" $27.99 · 13\" $31.99 · 17\" $36.99", desc: "Italian sausage, peperonata peppers, spinach, romano and mozzarella on a crushed Italian tomato base." },
  { id: "tricolore-combo", name: "Tricolore Combo", category: "Pagliacci Favorites", vegetarian: true, prices: "11\" $22.99 · 13\" $26.99 · 17\" $31.49", desc: "Burrata over a crushed Italian tomato base, finished with sea salt and pesto after bake." },
  { id: "verde-vito", name: "Verde Vito", category: "Pagliacci Favorites", vegetarian: true, prices: "11\" $27.99 · 13\" $31.99 · 17\" $36.99", desc: "Plant-based mozzarella, vegan sausage, peperonata peppers and spinach over crushed Italian tomatoes." },
  { id: "12th-fan-primo", name: "12th Fan Primo", category: "Pagliacci Favorites", vegetarian: false, prices: "11\" $27.99 · 13\" $31.99 · 17\" $36.99", desc: "Pepperoni, salami, chicken, Mama Lil's peppers, olives and mozzarella on seasoned tomato sauce." },
  { id: "diavola", name: "Diavola", category: "Pagliacci Favorites", vegetarian: false, prices: "11\" $23.49 · 13\" $27.49 · 17\" $32.49", desc: "Soppressata, mozzarella and romano over seasoned tomato sauce, finished with hot honey after bake." },
  { id: "agog-primo", name: "AGOG Primo", category: "Pagliacci Favorites", vegetarian: true, prices: "11\" $27.99 · 13\" $31.99 · 17\" $36.99", desc: "Tomatoes, mushrooms, roasted garlic, Kalamata olives, goat cheese, fontina, mozzarella and parsley over olive oil." },
  { id: "brooklyn-bridge", name: "Brooklyn Bridge", category: "Pagliacci Favorites", vegetarian: false, prices: "11\" $27.99 · 13\" $31.99 · 17\" $36.99", desc: "Pepperoni, Italian sausage, mushrooms, olives, green peppers, onions and mozzarella over seasoned tomato sauce." },
  { id: "chicken-primo", name: "Chicken Primo", category: "Pagliacci Favorites", vegetarian: false, prices: "11\" $27.99 · 13\" $31.99 · 17\" $36.99", desc: "Marinated chicken, artichoke hearts, pickled red onions, peperonata peppers, mozzarella, ricotta and parsley over olive oil." },
  { id: "double-mushroom", name: "Double Mushroom", category: "Pagliacci Favorites", vegetarian: true, prices: "11\" $22.99 · 13\" $26.99 · 17\" $31.49", desc: "A veritable blanket of mushrooms over mozzarella and seasoned tomato sauce." },
  { id: "extra-pepperoni", name: "Extra Pepperoni", category: "Pagliacci Favorites", vegetarian: false, prices: "11\" $22.99 · 13\" $26.99 · 17\" $31.49", desc: "A veritable blanket of pepperoni over mozzarella and seasoned tomato sauce." },
  { id: "fresh-veggie", name: "Fresh Veggie", category: "Pagliacci Favorites", vegetarian: true, prices: "11\" $24.49 · 13\" $28.49 · 17\" $33.49", desc: "Tomatoes, mushrooms, green peppers, onions, olives, mozzarella and parsley over seasoned tomato sauce." },
  { id: "funghi-salsiccia", name: "Funghi Salsiccia", category: "Pagliacci Favorites", vegetarian: false, prices: "11\" $24.49 · 13\" $28.49 · 17\" $33.49", desc: "Italian sausage, mushrooms, fresh mozzarella, sea salt and olive oil with crushed Italian tomatoes as a base." },
  { id: "grand-salami-primo", name: "Grand Salami Primo", category: "Pagliacci Favorites", vegetarian: false, prices: "11\" $27.99 · 13\" $31.99 · 17\" $36.99", desc: "Salami, Canadian bacon, Italian sausage, pepperoni and mozzarella over seasoned tomato sauce." },
  { id: "margherita", name: "Margherita", category: "Pagliacci Favorites", vegetarian: true, prices: "11\" $22.99 · 13\" $26.99 · 17\" $31.49", desc: "Fresh mozzarella, basil, sea salt and olive oil with crushed Italian tomatoes as a base." },
  { id: "parma-primo", name: "Parma Primo", category: "Pagliacci Favorites", vegetarian: false, prices: "11\" $27.99 · 13\" $31.99 · 17\" $36.99", desc: "Prosciutto, tomatoes, mushrooms, basil, goat cheese and mozzarella over olive oil." },
  { id: "pesto-primo", name: "Pesto Primo", category: "Pagliacci Favorites", vegetarian: true, prices: "11\" $27.99 · 13\" $31.99 · 17\" $36.99", desc: "Artichoke hearts, peperonata peppers, ricotta, fontina and mozzarella over pesto base." },
  { id: "psr-combo", name: "PSR Combo", category: "Pagliacci Favorites", vegetarian: false, prices: "11\" $23.49 · 13\" $27.49 · 17\" $32.49", desc: "Pepperoni, Italian sausage, ricotta, mozzarella and romano on seasoned tomato sauce." },
  { id: "roman-holiday", name: "Roman Holiday", category: "Pagliacci Favorites", vegetarian: false, prices: "11\" $23.49 · 13\" $27.49 · 17\" $32.49", desc: "Italian sausage, roasted artichoke hearts, mushrooms, fresh mozzarella and parmesan over garlic and olive oil base." },
  { id: "south-philly", name: "South Philly", category: "Pagliacci Favorites", vegetarian: false, prices: "11\" $23.49 · 13\" $27.49 · 17\" $32.49", desc: "Italian sausage, mushrooms, onions, mozzarella and parsley over seasoned tomato sauce." },
  { id: "spicy-chicken", name: "Spicy Chicken", category: "Pagliacci Favorites", vegetarian: false, prices: "11\" $23.49 · 13\" $27.49 · 17\" $32.49", desc: "Marinated chicken, Mama Lil's peppers, parsley, mozzarella and feta over olive oil seasoned with red pepper flakes." },
  { id: "spinach-chicken", name: "Spinach & Chicken", category: "Pagliacci Favorites", vegetarian: false, prices: "11\" $23.49 · 13\" $27.49 · 17\" $32.49", desc: "Marinated chicken, spinach, mushrooms and mozzarella over fresh garlic oil seasoned with red pepper flakes." },
  { id: "hawaiian", name: "The Hawaiian", category: "Pagliacci Favorites", vegetarian: false, prices: "11\" $23.49 · 13\" $27.49 · 17\" $32.49", desc: "Canadian bacon and fresh cut pineapple over mozzarella and seasoned tomato sauce." },
  { id: "italiano", name: "The Italiano", category: "Pagliacci Favorites", vegetarian: true, prices: "11\" $23.49 · 13\" $27.49 · 17\" $32.49", desc: "Spinach, roasted garlic, mozzarella, fontina and parmesan over crushed Italian tomato base, finished with sea salt." },
  { id: "rocket", name: "The Rocket", category: "Pagliacci Favorites", vegetarian: false, prices: "11\" $23.49 · 13\" $27.49 · 17\" $32.49", desc: "Prosciutto and mozzarella, finished after bake with arugula tossed in olive oil and sea salt." },
  { id: "tomato-gorgonzola", name: "Tomato Gorgonzola", category: "Pagliacci Favorites", vegetarian: true, prices: "11\" $23.49 · 13\" $27.49 · 17\" $32.49", desc: "Tomatoes, gorgonzola and mozzarella over olive oil and oregano." },
  { id: "verde-primo", name: "Verde Primo", category: "Pagliacci Favorites", vegetarian: true, prices: "11\" $27.99 · 13\" $31.99 · 17\" $36.99", desc: "Artichoke hearts, mushrooms, pesto, goat cheese, garlic and mozzarella over seasoned tomato sauce." },
  { id: "verdura-primo", name: "Verdura Primo", category: "Pagliacci Favorites", vegetarian: true, prices: "11\" $27.99 · 13\" $31.99 · 17\" $36.99", desc: "Artichokes, Mama Lil's peppers, spinach, parsley, ricotta and fresh mozzarella on a pesto base." }
];

const starterTotals = {};

function PizzaArt({ name, vegetarian }) {
  const seed = [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const dots = Array.from({ length: 10 }, (_, i) => ({
    left: `${15 + ((seed * (i + 3)) % 68)}%`,
    top: `${16 + ((seed * (i + 7)) % 64)}%`,
    size: 6 + ((seed + i) % 10),
    color: vegetarian ? ["#22c55e", "#84cc16", "#ef4444"][i % 3] : ["#b91c1c", "#7f1d1d", "#f97316"][i % 3]
  }));

  return (
    <div className="relative h-36 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-200 via-orange-200 to-red-200 shadow-inner">
      <div className="absolute inset-5 rounded-full bg-gradient-to-br from-yellow-200 via-orange-300 to-amber-500 shadow-lg ring-8 ring-yellow-700/20" />
      <div className="absolute inset-9 rounded-full bg-red-500/70 blur-[1px]" />
      <div className="absolute inset-12 rounded-full bg-yellow-200/80" />
      {dots.map((dot, i) => (
        <span key={i} className="absolute rounded-full shadow" style={{ left: dot.left, top: dot.top, width: dot.size, height: dot.size, backgroundColor: dot.color }} />
      ))}
      <div className="absolute bottom-3 left-3 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-stone-700 shadow-sm">Photo placeholder</div>
    </div>
  );
}

export default function PagliacciPizzaPoll() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [ballot, setBallot] = useState({});
  const [voterName, setVoterName] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSubmissions() {
      const { data, error } = await supabase
        .from("pizza_ballots")
        .select("id, voter_name, votes, created_at")
        .order("created_at", { ascending: false });

      if (!active) return;
      if (error) {
        console.error("Unable to load ballots", error);
        setSubmitError("Could not load the shared leaderboard. Please refresh.");
      } else {
        setSubmissions((data || []).map(row => ({
          id: row.id,
          name: row.voter_name,
          votes: row.votes,
          time: row.created_at
        })));
      }
      setLoading(false);
    }

    loadSubmissions();

    const channel = supabase
      .channel("pizza-ballots-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "pizza_ballots" },
        payload => {
          const row = payload.new;
          setSubmissions(prev => {
            if (prev.some(s => s.id === row.id)) return prev;
            return [{
              id: row.id,
              name: row.voter_name,
              votes: row.votes,
              time: row.created_at
            }, ...prev];
          });
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const categories = ["All", ...Array.from(new Set(pizzas.map(p => p.category)))];
  const usedVotes = Object.values(ballot).reduce((a, b) => a + b, 0);
  const remaining = MAX_VOTES - usedVotes;

  const totals = useMemo(() => {
    const base = { ...starterTotals };
    for (const s of submissions) {
      Object.entries(s.votes).forEach(([id, count]) => {
        base[id] = (base[id] || 0) + count;
      });
    }
    return base;
  }, [submissions]);

  const leaderboard = useMemo(() => {
    return pizzas
      .map(p => ({ ...p, votes: totals[p.id] || 0 }))
      .sort((a, b) => b.votes - a.votes || a.name.localeCompare(b.name));
  }, [totals]);

  const filtered = pizzas.filter(p => {
    const text = `${p.name} ${p.desc} ${p.category}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (category === "All" || p.category === category) && (!vegOnly || p.vegetarian);
  });

  function addVote(id) {
    if (remaining <= 0) return;
    setBallot(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }

  function removeVote(id) {
    setBallot(prev => {
      const next = { ...prev };
      if (!next[id]) return next;
      next[id] -= 1;
      if (next[id] <= 0) delete next[id];
      return next;
    });
  }

  async function submitVote() {
    if (usedVotes === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");

    const label = voterName.trim() || `Voter ${submissions.length + 1}`;
    const votesToSave = { ...ballot };

    const { error } = await supabase
      .from("pizza_ballots")
      .insert({ voter_name: label, votes: votesToSave });

    if (error) {
      console.error("Unable to submit ballot", error);
      setSubmitError("Your ballot was not submitted. Please try again.");
    } else {
      setBallot({});
      setVoterName("");
    }

    setIsSubmitting(false);
  }

  const maxVotes = Math.max(1, ...leaderboard.map(p => p.votes));

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 p-4 text-stone-900 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.header initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[2rem] bg-stone-950 p-6 text-white shadow-2xl md:p-8">
          <div className="grid gap-6 md:grid-cols-[1.5fr_.9fr] md:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-500/20 px-3 py-1 text-sm font-medium text-red-100 ring-1 ring-red-300/20">
                <Pizza className="h-4 w-4" /> Pagliacci pizza poll
              </div>
              <h1 className="text-3xl font-black tracking-tight md:text-5xl">Pick the office pizza order</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-stone-200 md:text-lg">Each participant gets <b>6 votes</b>. Put all 6 on one pizza or spread them across the menu. The shared leaderboard updates live for everyone.</p>
            </div>
            <Card className="border-white/10 bg-white/10 text-white backdrop-blur">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-200">Votes remaining</span>
                  <span className="text-4xl font-black">{remaining}</span>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full rounded-full bg-gradient-to-r from-red-400 to-amber-300" style={{ width: `${(usedVotes / MAX_VOTES) * 100}%` }} />
                </div>
                <p className="mt-3 text-sm text-stone-300">Current ballot: {usedVotes}/{MAX_VOTES} votes used</p>
              </CardContent>
            </Card>
          </div>
        </motion.header>

        <div className="grid gap-6 lg:grid-cols-[1fr_370px]">
          <main className="space-y-5">
            <Card className="rounded-3xl border-0 shadow-xl">
              <CardContent className="p-4 md:p-5">
                <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
                  <label className="relative block">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search pizza, toppings, or style" className="w-full rounded-2xl border border-stone-200 bg-white py-3 pl-10 pr-4 text-sm outline-none ring-red-200 transition focus:ring-4" />
                  </label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none ring-red-200 focus:ring-4">
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <Button variant={vegOnly ? "default" : "outline"} onClick={() => setVegOnly(v => !v)} className="rounded-2xl px-4 py-6">Vegetarian only</Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p, idx) => {
                const count = ballot[p.id] || 0;
                return (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(idx * 0.02, 0.25) }}>
                    <Card className={`h-full overflow-hidden rounded-3xl border-0 shadow-lg ring-1 ring-stone-200/70 transition hover:-translate-y-0.5 hover:shadow-2xl ${count ? "bg-amber-50 ring-red-300" : "bg-white"}`}>
                      <CardContent className="flex h-full flex-col gap-4 p-4">
                        <PizzaArt name={p.name} vegetarian={p.vegetarian} />
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <h2 className="text-lg font-black leading-tight">{p.name}</h2>
                            {p.vegetarian && <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">Veg</span>}
                          </div>
                          <p className="mt-2 text-sm leading-6 text-stone-600">{p.desc}</p>
                          <p className="mt-3 text-xs font-semibold text-stone-500">{p.prices}</p>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl bg-stone-100 p-2">
                          <Button variant="outline" size="icon" onClick={() => removeVote(p.id)} disabled={!count} className="rounded-xl"><Minus className="h-4 w-4" /></Button>
                          <div className="text-center">
                            <div className="text-2xl font-black">{count}</div>
                            <div className="text-[11px] uppercase tracking-wide text-stone-500">your votes</div>
                          </div>
                          <Button size="icon" onClick={() => addVote(p.id)} disabled={remaining <= 0} className="rounded-xl bg-red-600 hover:bg-red-700"><Plus className="h-4 w-4" /></Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </main>

          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <Card className="rounded-3xl border-0 bg-white shadow-xl">
              <CardContent className="p-5">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-red-600" />
                  <h2 className="text-xl font-black">Submit ballot</h2>
                </div>
                <input value={voterName} onChange={e => setVoterName(e.target.value)} placeholder="Name, team, or initials" className="mt-4 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none ring-red-200 focus:ring-4" />
                <Button onClick={submitVote} disabled={usedVotes === 0 || isSubmitting} className="mt-3 w-full rounded-2xl bg-red-600 py-6 text-base font-bold hover:bg-red-700">
                  <CheckCircle2 className="mr-2 h-5 w-5" /> {isSubmitting ? "Submitting..." : `Submit ${usedVotes || ""} vote${usedVotes === 1 ? "" : "s"}`}
                </Button>
                <Button variant="outline" onClick={() => setBallot({})} className="mt-2 w-full rounded-2xl py-6"><RotateCcw className="mr-2 h-4 w-4" /> Reset current ballot</Button>
                {submitError && <p className="mt-3 text-xs font-semibold leading-5 text-red-600">{submitError}</p>}
                <p className="mt-3 text-xs leading-5 text-stone-500">Ballots are stored in Supabase and shared across everyone using this link.</p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 bg-white shadow-xl">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2"><Trophy className="h-5 w-5 text-amber-500" /><h2 className="text-xl font-black">Leaderboard</h2></div>
                  <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-bold text-stone-600">{submissions.length} ballots</span>
                </div>
                <div className="space-y-3">
                  {leaderboard.slice(0, 10).map((p, i) => (
                    <div key={p.id}>
                      <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                        <span className="font-bold"><span className="mr-1 text-stone-400">#{i + 1}</span>{p.name}</span>
                        <span className="font-black text-red-600">{p.votes}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-stone-100"><div className="h-full rounded-full bg-gradient-to-r from-red-500 to-amber-400" style={{ width: `${(p.votes / maxVotes) * 100}%` }} /></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 bg-stone-950 text-white shadow-xl">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Users className="h-5 w-5 text-red-300" /><h2 className="text-lg font-black">Recent voters</h2></div>
                  {loading && <span className="text-xs text-stone-400">Loading...</span>}
                </div>
                <div className="mt-3 space-y-2">
                  {submissions.length === 0 && <p className="text-sm text-stone-300">No submitted ballots yet.</p>}
                  {submissions.slice(0, 6).map((s, i) => (
                    <div key={`${s.time}-${i}`} className="rounded-2xl bg-white/10 p-3 text-sm">
                      <div className="font-bold">{s.name}</div>
                      <div className="mt-1 text-stone-300">{Object.values(s.votes).reduce((a, b) => a + b, 0)} votes submitted</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        <footer className="rounded-3xl bg-white/70 p-4 text-sm leading-6 text-stone-600 shadow-sm ring-1 ring-stone-200">
          Menu seeded from the Pagliacci online menu visible during setup. The page showed image placeholders in the accessible menu extract rather than stable direct pizza image URLs, so these cards use generated pizza-style placeholders. Replace the placeholder component with official image URLs if you obtain permitted assets.
        </footer>
      </div>
    </div>
  );
}
