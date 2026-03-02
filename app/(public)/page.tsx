// this page should be used only as a splash page to decide where a user should be navigated to
// when logged in --> to /heists
// when not logged in --> to /login

import { Clock8 } from 'lucide-react';

export default function Home() {
  return (
    <div className="center-content">
      <div className="page-content">
        <h1>
          P<Clock8 className="logo" strokeWidth={2.75} />
          cket Heist
        </h1>
        <div>Tiny missions. Big office mischief.</div>
        <p>
          Welcome to Pocket Heist — the game where your office becomes the
          ultimate playground. Pull off sneaky micro-missions, outsmart your
          colleagues, and climb the leaderboard one mischievous task at a time.
          No heist is too small. No office is safe.
        </p>
      </div>
    </div>
  );
}
