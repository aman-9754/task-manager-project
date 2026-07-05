import { Link } from "react-router-dom";

const NotFount = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="max-w-md rounded-3xl border border-white/10 bg-slate-900/70 p-8 text-center shadow-2xl shadow-slate-950/20 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-sm text-slate-300">
          The page you requested does not exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-linear-to-r from-sky-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:from-sky-400 hover:to-cyan-400"
        >
          Go home
        </Link>
      </div>
    </div>
  );
};

export default NotFount;