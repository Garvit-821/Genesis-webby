import React from "react";

/**
 * Production ErrorBoundary — catches render/lifecycle failures in the tree
 * below it. Note: does NOT catch errors inside event handlers or useEffect;
 * those need local try/catch (see HeroCanvas).
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    if (typeof this.props.onError === "function") {
      this.props.onError(error, info);
    } else if (process.env.NODE_ENV !== "production") {
      console.error("[ErrorBoundary]", error, info?.componentStack);
    }
  }

  reset = () => {
    this.setState({ error: null });
    if (typeof this.props.onReset === "function") {
      this.props.onReset();
    }
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (typeof this.props.fallback === "function") {
      return this.props.fallback({ error, reset: this.reset });
    }

    if (this.props.fallback != null) {
      return this.props.fallback;
    }

    return (
      <DefaultErrorFallback
        error={error}
        reset={this.reset}
        title={this.props.title}
        compact={this.props.compact}
      />
    );
  }
}

function DefaultErrorFallback({
  error,
  reset,
  title = "Something went wrong.",
  compact = false,
}) {
  return (
    <div
      role="alert"
      className={
        compact
          ? "flex min-h-[40vh] w-full flex-col items-center justify-center bg-[#181818] px-6 py-16 text-center"
          : "flex min-h-[100svh] w-full flex-col items-center justify-center bg-[#181818] px-6 py-28 text-center"
      }
    >
      <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-[var(--text-faint)]">
        Runtime error
      </p>
      <h2 className="mt-4 font-display text-3xl tracking-tight text-[var(--heading)] sm:text-4xl md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-[var(--text-dim)] md:text-base">
        This section failed to render. You can try again, or continue browsing
        the rest of the site.
      </p>
      {error?.message ? (
        <pre className="mt-6 max-w-full overflow-x-auto rounded border border-white/10 bg-black/40 px-4 py-3 text-left font-mono text-[11px] text-red-300/90">
          {String(error.message)}
        </pre>
      ) : null}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <button type="button" className="btn-cinema" onClick={reset}>
          Try again
        </button>
        <a href="/" className="btn-ghost">
          Go home
        </a>
      </div>
    </div>
  );
}
