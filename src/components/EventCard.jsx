import { CalendarDays, MapPin } from "lucide-react";

const fallbackImage = "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=2000&q=85";

export default function EventCard({ event, onRegister }) {
  const imageSrc = event?.image?.trim() || fallbackImage;

  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-60 overflow-hidden">
        <img
          src={imageSrc}
          alt={event.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImage;
          }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur">
          {event.category}
        </span>
      </div>
      <div className="p-6">
        <div className="mb-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-orange-600">
            <CalendarDays size={16} className="flex-shrink-0" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-orange-600">
            <MapPin size={16} className="flex-shrink-0" />
            <span>{event.location}</span>
          </div>
        </div>
        <h3 className="font-display text-2xl font-bold">{event.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/55">{event.description}</p>
        <button onClick={() => onRegister(event)} className="mt-5 w-full rounded-xl bg-ink py-3 font-semibold text-white transition hover:bg-orange-600">
          Register now
        </button>
      </div>
    </article>
  );
}