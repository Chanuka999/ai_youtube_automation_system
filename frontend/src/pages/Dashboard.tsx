import {
  CheckCircle2,
  Clock3,
  Film,
  Upload,
} from "lucide-react";

const stats = [
  {
    title: "Total Videos",
    value: "24",
    icon: Film,
  },
  {
    title: "Processing",
    value: "3",
    icon: Clock3,
  },
  {
    title: "Uploaded",
    value: "19",
    icon: Upload,
  },
  {
    title: "Ready",
    value: "2",
    icon: CheckCircle2,
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Overview of your YouTube automation system.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-100 p-3">
                  <Icon
                    size={22}
                    className="text-slate-700"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Welcome 👋
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Your AI YouTube automation dashboard is ready.
          Create your first video project from the Video
          Projects section.
        </p>
      </div>
    </div>
  );
}