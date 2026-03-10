"use client";

import { useHeists } from "@/hooks/useHeists";
import { HeistCard, HeistCardSkeleton } from "@/components/HeistCard";

const SKELETON_COUNT = 3;

function HeistGrid({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
      {loading
        ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <HeistCardSkeleton key={i} />
          ))
        : children}
    </div>
  );
}

export default function HeistsPage() {
  const { heists: activeHeists, loading: activeLoading } = useHeists("active");
  const { heists: assignedHeists, loading: assignedLoading } =
    useHeists("assigned");
  const { heists: expiredHeists } = useHeists("expired");

  return (
    <div className="page-content">
      <section className="active-heists">
        <h2>Your Active Heists</h2>
        <HeistGrid loading={activeLoading}>
          {activeHeists.map((heist) => (
            <HeistCard key={heist.id} heist={heist} />
          ))}
        </HeistGrid>
      </section>

      <section className="assigned-heists mt-10">
        <h2>Heists You&apos;ve Assigned</h2>
        <HeistGrid loading={assignedLoading}>
          {assignedHeists.map((heist) => (
            <HeistCard key={heist.id} heist={heist} />
          ))}
        </HeistGrid>
      </section>

      <section className="expired-heists mt-10">
        <h2>All Expired Heists</h2>
        <ul className="mt-4 flex flex-col gap-1">
          {expiredHeists.map((heist) => (
            <li key={heist.id} className="text-body text-sm">
              {heist.title}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
