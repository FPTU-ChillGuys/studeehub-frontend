import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex-1 p-6 md:p-10 w-full">
      <section className="mx-auto max-w-6xl">
        <div className="space-y-3 text-center">
          <Skeleton className="mx-auto h-7 w-64" />
          <Skeleton className="mx-auto h-4 w-80" />
        </div>

        <div className="flex items-center justify-center gap-3 mt-6">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-6 w-11 rounded-full" />
          <Skeleton className="h-4 w-36" />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl border p-6">
              <div className="flex justify-center">
                <Skeleton className="h-12 w-12 rounded-xl" />
              </div>
              <div className="mt-4 space-y-2 text-center">
                <Skeleton className="mx-auto h-6 w-40" />
                <Skeleton className="mx-auto h-4 w-56" />
              </div>
              <div className="mt-6 space-y-2">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
              <Skeleton className="mt-6 h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


