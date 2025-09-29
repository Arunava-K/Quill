import { Note } from "../types";

interface QuickStatsProps {
  notes: Note[];
}

export default function QuickStats({ notes }: QuickStatsProps) {
  // Calculate statistics
  const totalNotes = notes.length;
  const totalWords = notes.reduce((total, note) => {
    return total + note.content.trim().split(/\s+/).filter(word => word.length > 0).length;
  }, 0);

  // Notes created in the last 7 days
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const recentNotes = notes.filter(note => new Date(note.created_at) > weekAgo).length;

  // Notes updated today
  const today = new Date().toDateString();
  const todayNotes = notes.filter(note => new Date(note.updated_at).toDateString() === today).length;

  const stats = [
    {
      label: "Total Notes",
      value: totalNotes.toLocaleString(),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "primary",
      bgColor: "bg-primary-50",
      iconColor: "text-primary-500",
      textColor: "text-primary-700"
    },
    {
      label: "Total Words",
      value: totalWords.toLocaleString(),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      color: "secondary",
      bgColor: "bg-secondary-50",
      iconColor: "text-secondary-500",
      textColor: "text-secondary-700"
    },
    {
      label: "This Week",
      value: recentNotes.toString(),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: "accent",
      bgColor: "bg-accent-50",
      iconColor: "text-accent-500",
      textColor: "text-accent-700"
    },
    {
      label: "Updated Today",
      value: todayNotes.toString(),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "neutral",
      bgColor: "bg-neutral-50",
      iconColor: "text-neutral-500",
      textColor: "text-neutral-700"
    }
  ];

  if (totalNotes === 0) {
    return null; // Don't show stats if no notes
  }

  return (
    <section>
      <h2 className="text-xl font-semibold text-neutral-800 mb-6">Quick Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`${stat.bgColor} rounded-2xl p-6 border border-white/50 hover:shadow-soft transition-all duration-200 animate-fade-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.bgColor} rounded-xl ${stat.iconColor}`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-600">{stat.label}</span>
              {index === 2 && recentNotes > 0 && (
                <div className="flex items-center text-xs text-accent-600">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  Active
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
