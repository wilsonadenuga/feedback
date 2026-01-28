"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      <div className="w-full lg:w-[45%] flex items-center justify-center p-4 lg:p-8 bg-zinc-50/50 dark:bg-background border-r border-zinc-200 dark:border-zinc-800">
        {children}
      </div>

      <div className="hidden lg:flex lg:w-[55%] items-center justify-center relative overflow-hidden bg-white dark:bg-zinc-950">
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 p-12 max-w-lg">
          <blockquote className="mb-8">
            <svg
              className="w-10 h-10 text-primary/30 dark:text-primary/40 mb-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-xl text-zinc-800 dark:text-white/90 leading-relaxed mb-6">
              &quot;Finally, a feedback tool that doesn&apos;t get in the way.
              Our team collects and prioritizes user feedback 10x faster
              now.&quot;
            </p>
            <footer className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary/80 to-primary flex items-center justify-center text-white font-semibold">
                JD
              </div>
              <div>
                <div className="text-zinc-900 dark:text-white font-medium">
                  Jane Doe
                </div>
                <div className="text-zinc-500 text-sm">
                  Product Manager at Acme
                </div>
              </div>
            </footer>
          </blockquote>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                10k+
              </div>
              <div className="text-zinc-500 text-sm">Feedback items</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                500+
              </div>
              <div className="text-zinc-500 text-sm">Teams</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                99%
              </div>
              <div className="text-zinc-500 text-sm">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
