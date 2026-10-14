import { useEffect, useState } from "react";

/**
 * Mirrors the header's hide-on-scroll-down / show-on-scroll-up rule so
 * sticky page bars can sit just under it instead of being covered.
 */
export default function useNavVisible() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = Math.max(window.scrollY, 0);
      const delta = y - last;
      if (y < 80) setVisible(true);
      else if (delta > 6) setVisible(false);
      else if (delta < -6) setVisible(true);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return visible;
}
