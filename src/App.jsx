import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, CalendarDays, Sparkles, Users, MapPin } from "lucide-react";
import Navbar from "./components/Navbar";
import EventCard from "./components/EventCard";
import RegisterModal from "./components/RegisterModal";
import { api } from "./api";

const fallbackImage = "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=2000&q=85";

const normalizeEvent = (event) => ({
  ...event,
  image: event?.image?.trim() || fallbackImage,
});

const fallbackEvents = [
  {
    _id: "demo-1",
    title: "Creative Leaders Summit",
    category: "Conference",
    date: "Sep 18, 2026",
    location: "Mumbai",
    description: "A high-energy gathering for founders, creators and teams building what comes next.",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80"
  },
  {
    _id: "demo-2",
    title: "The Social Table",
    category: "Experience",
    date: "Oct 02, 2026",
    location: "Ahmedabad",
    description: "An intimate evening of food, music, conversations and carefully designed experiences.",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80"
  },
  {
    _id: "demo-3",
    title: "Future of Work",
    category: "Corporate",
    date: "Oct 16, 2026",
    location: "Bengaluru",
    description: "Ideas, people and practical conversations shaping the next generation of workplaces.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"
  }
];

function App() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    api.get("/events")
      .then((res) => {
        const responseData = res?.data;

        // Support the common API response shapes without changing the UI:
        // { data: [...] }, { events: [...] }, or a direct [...] response.
        const eventData = Array.isArray(responseData)
          ? responseData
          : Array.isArray(responseData?.data)
            ? responseData.data
            : Array.isArray(responseData?.events)
              ? responseData.events
              : Array.isArray(responseData?.data?.events)
                ? responseData.data.events
                : [];

        // If the API responds successfully but contains no events, keep
        // the existing demo fallback visible instead of rendering an empty page.
        setEvents(
          (eventData.length ? eventData : fallbackEvents).map(normalizeEvent)
        );
      })
      .catch(() => setEvents(fallbackEvents.map(normalizeEvent)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = ["All", ...new Set(events.map((e) => e.category).filter(Boolean))];
  const visibleEvents = events.filter((e) => {
    const categoryMatch = filter === "All" || e.category === filter;

    // Keep location filtering safe even if an event has no location.
    const eventLocation = String(e.location || "").trim().toLowerCase();
    const searchLocation = locationFilter.trim().toLowerCase();
    const locationMatch = !searchLocation || eventLocation.includes(searchLocation);

    let dateMatch = true;

    if (dateFilter) {
      const eventDate = String(e.date || "").trim();

      // Compare the selected YYYY-MM-DD directly when the API already
      // returns an ISO date, otherwise normalize common display-date formats.
      let eventDateKey = eventDate.slice(0, 10);

      if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDateKey)) {
        const parsedDate = new Date(eventDate);

        if (!Number.isNaN(parsedDate.getTime())) {
          const year = parsedDate.getFullYear();
          const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
          const day = String(parsedDate.getDate()).padStart(2, "0");
          eventDateKey = `${year}-${month}-${day}`;
        } else {
          eventDateKey = "";
        }
      }

      dateMatch = eventDateKey === dateFilter;
    }

    return categoryMatch && dateMatch && locationMatch;
  });

  const hasActiveFilters = dateFilter || locationFilter || filter !== "All";
  const hasNoResults = visibleEvents.length === 0 && hasActiveFilters;
  const displayedEvents = hasNoResults ? events : visibleEvents;

  return (
    <div className="min-h-screen bg-cream">
      <section className="relative min-h-[500px] sm:min-h-[600px] md:min-h-[720px] overflow-hidden bg-ink text-white">
        <img
          src="https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=2000&q=85"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        <Navbar />

        <div className="container-page relative flex min-h-[500px] sm:min-h-[600px] md:min-h-[720px] items-center pb-12 sm:pb-16 md:pb-20 pt-20 sm:pt-24 md:pt-28">
          <div className="max-w-4xl w-full">
            <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm backdrop-blur">
              <Sparkles size={14} className="sm:w-4" /> Experiences worth remembering
            </div>
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[.95] tracking-tight">
              We turn moments<br />
              <span className="text-orange-300">into stories.</span>
            </h1>
            <p className="mt-4 sm:mt-6 md:mt-7 max-w-2xl text-sm sm:text-base md:text-lg leading-6 sm:leading-7 md:leading-8 text-white/70">
              From intimate celebrations to high-impact corporate experiences,
              we design and deliver events people talk about long after they end.
            </p>
            <div className="mt-6 sm:mt-8 md:mt-9 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
              <a href="#events" className="flex items-center justify-center sm:justify-start gap-2 rounded-full bg-white px-4 sm:px-6 py-2.5 sm:py-3.5 font-bold text-sm sm:text-base text-ink">
                Explore events <ArrowDown size={16} className="sm:w-[18px]" />
              </a>
              <a href="#contact" className="flex items-center justify-center sm:justify-start gap-2 rounded-full border border-white/30 px-4 sm:px-6 py-2.5 sm:py-3.5 font-bold text-sm sm:text-base text-white backdrop-blur hover:bg-white/10">
                Start a project <ArrowUpRight size={16} className="sm:w-[18px]" />
              </a>
            </div>
          </div>
        </div>

        <div className={`absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 transition-all duration-500 ${scrollY > 100 ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <div className="animate-bounce flex flex-col items-center gap-1 sm:gap-2">
            <span className="text-xs sm:text-sm font-medium text-white/90">Scroll to explore</span>
            <ArrowDown size={16} className="sm:w-5 text-orange-300" />
          </div>
        </div>
      </section>

      <section className="border-b border-black/5 bg-white">
        <div className="container-page grid gap-4 sm:gap-6 md:gap-8 py-8 sm:py-10 md:py-12 grid-cols-1 sm:grid-cols-3">
          {[
            [CalendarDays, "150+", "Events delivered"],
            [Users, "40K+", "Guests hosted"],
            [MapPin, "12", "Cities covered"]
          ].map(([Icon, value, label]) => (
            <div key={label} className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left">
              <div className="rounded-2xl bg-orange-50 p-2 sm:p-3 text-orange-600 flex-shrink-0"><Icon size={24} className="sm:w-6 sm:h-6" /></div>
              <div><div className="text-xl sm:text-2xl font-bold">{value}</div><div className="text-xs sm:text-sm text-black/50">{label}</div></div>
            </div>
          ))}
        </div>
      </section>

      <section id="events" className="container-page py-16 sm:py-20 md:py-24">
        <div className="flex flex-col justify-between gap-4 sm:gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-semibold uppercase tracking-[.2em] text-xs sm:text-sm text-orange-600">What's happening</p>
            <h2 className="mt-2 sm:mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold">Upcoming events</h2>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-end md:gap-3">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium">Location</label>
            <input
              type="text"
              placeholder="Search by location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full rounded-xl border border-black/10 px-4 py-2.5 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
            />
          </div>
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium">Date</label>
            <div className="relative">
              <CalendarDays size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-600 pointer-events-none" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full rounded-xl border border-black/10 px-4 py-2.5 pl-10 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition ${filter === category ? "bg-ink text-white" : "bg-white text-black/60 ring-1 ring-black/10 hover:ring-black/20"}`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-6 md:gap-7 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3].map((x) => <div key={x} className="h-80 sm:h-96 md:h-[460px] animate-pulse rounded-3xl bg-black/5" />)}
          </div>
        ) : (
          <>
            {hasNoResults && (
              <div className="mt-8 sm:mt-10 rounded-2xl bg-orange-50 border border-orange-200 p-6 sm:p-8 text-center">
                <p className="text-base sm:text-lg font-semibold text-orange-700">No events found</p>
                <p className="mt-2 text-xs sm:text-sm text-orange-600">
                  couldn't find any events matching your search criteria.
                  {dateFilter && ` (Date: ${dateFilter})`}
                  {locationFilter && ` Location: ${locationFilter}`}
                  {filter !== "All" && ` Category: ${filter}`}
                  Showing all events instead.
                </p>
              </div>
            )}
            <div className={`${hasNoResults ? "mt-6 sm:mt-8" : "mt-8 sm:mt-10"} grid gap-4 sm:gap-6 md:gap-7 grid-cols-1 sm:grid-cols-2 md:grid-cols-3`}>
              {displayedEvents.map((event) => <EventCard key={event._id} event={event} onRegister={setSelectedEvent} />)}
            </div>
          </>
        )}
      </section>

      <section id="services" className="bg-ink py-16 sm:py-20 md:py-24 text-white">
        <div className="container-page">
          <div className="grid gap-8 sm:gap-10 md:gap-12 grid-cols-1 md:grid-cols-2">
            <div>
              <p className="font-semibold uppercase tracking-[.2em] text-xs sm:text-sm text-orange-300">What we do</p>
              <h2 className="mt-3 sm:mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold">Every detail has a purpose.</h2>
            </div>
            <div className="grid gap-3 sm:gap-4">
              {["Corporate events", "Brand launches", "Private celebrations", "Experiential marketing"].map((item, i) => (
                <div key={item} className="flex items-center justify-between border-b border-white/10 py-4 sm:py-5 text-base sm:text-lg md:text-xl">
                  <span><span className="mr-3 sm:mr-5 text-xs sm:text-sm text-white/30">0{i + 1}</span>{item}</span>
                  <ArrowUpRight size={20} className="text-orange-300 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-white py-16 sm:py-20 md:py-24">
        <div className="container-page grid gap-8 sm:gap-10 md:gap-12 grid-cols-1 md:grid-cols-2">
          <div>
            <p className="font-semibold uppercase tracking-[.2em] text-xs sm:text-sm text-orange-600">Let's create</p>
            <h2 className="mt-3 sm:mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold">Have an event in mind?</h2>
            <p className="mt-4 sm:mt-5 max-w-md leading-6 sm:leading-7 text-sm sm:text-base text-black/55">Tell us what you're planning. Our team will get back to you with the right approach.</p>
          </div>
          <ContactForm />
        </div>
      </section>

      <section id="about" className="container-page py-16 sm:py-20 md:py-24">
        <div className="rounded-2xl sm:rounded-3xl md:rounded-[2rem] bg-orange-100 p-6 sm:p-10 md:p-14">
          <div className="max-w-3xl">
            <p className="font-semibold uppercase tracking-[.2em] text-xs sm:text-sm text-orange-700">Why eventManager</p>
            <h2 className="mt-3 sm:mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Strategy, creativity and flawless execution — under one roof.</h2>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg leading-6 sm:leading-7 md:leading-8 text-black/60">
              We combine creative direction with operational discipline to make events feel effortless for guests and measurable for brands.
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-ink py-6 sm:py-8 text-white/50">
        <div className="container-page flex flex-col justify-between gap-3 sm:gap-4 text-xs sm:text-sm md:flex-row">
          <span className="text-white text-lg sm:text-xl">
            note: this website is for demo only.
          </span>
          <span className="text-center sm:text-right">© 2026 eventManager Studio</span>
          <span className="text-center sm:text-right">Built for memorable experiences.</span>
        </div>
      </footer>

      <RegisterModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.post("/contact", form);
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 sm:space-y-4">
      {status === "success" && <div className="rounded-xl bg-green-50 p-3 text-xs sm:text-sm text-green-700">Thanks! We'll contact you shortly.</div>}
      {status === "error" && <div className="rounded-xl bg-red-50 p-3 text-xs sm:text-sm text-red-700">Something went wrong. Please try again.</div>}
      {[
        ["name", "Your name", "text"],
        ["email", "Email address", "email"],
      ].map(([key, placeholder, type]) => (
        <input
          key={key}
          required
          type={type}
          placeholder={placeholder}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="w-full rounded-xl border border-black/10 bg-cream px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
        />
      ))}
      <textarea
        required
        rows="5"
        placeholder="Tell us about your event..."
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full resize-none rounded-xl border border-black/10 bg-cream px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
      />
      <button disabled={status === "sending"} className="w-full rounded-xl bg-ink py-3 sm:py-4 font-bold text-sm sm:text-base text-white transition disabled:opacity-60 hover:bg-opacity-90">
        {status === "sending" ? "Sending..." : "Send enquiry"}
      </button>
    </form>
  );
}

export default App;