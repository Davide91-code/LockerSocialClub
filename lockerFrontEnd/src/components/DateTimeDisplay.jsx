import { useEffect, useState } from 'react';

export default function DateTimeDisplay() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <span>
      {now.toLocaleString()} {/* esempio: 24/06/2025, 14:05:00 */}
    </span>
  );
}
