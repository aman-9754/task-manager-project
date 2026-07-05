import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/userApi";

const Login = () => {
  const [form, setForm] = useState({
    // email: "",
    identifier: "",
    password: "",
  });

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(form);

      // console.log("Login.jsx res:", res);

      // const { accessToken, user } = res.data.data;
      const { user } = res.data.data;

      // store token
      // localStorage.setItem("accessToken", accessToken);

      // set user in context
      setUser(user);

      // redirect
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed!");
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 text-slate-100">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-slate-950/55 p-8 shadow-2xl backdrop-blur">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.2),transparent_28%)]" />
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-sky-200/70">
                Task Manager
              </p>
              <h1 className="mt-4 max-w-xl text-4xl font-black leading-tight text-white sm:text-6xl">
                Plan work with a calmer, sharper interface.
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-6 text-slate-300 sm:text-base">
                Track tasks, review analytics, manage your profile, and keep the
                whole flow visible without fighting the UI.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Fast", "Instant task updates"],
                ["Clear", "Readable hierarchy"],
                ["Secure", "Cookie-backed sessions"],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-1 text-xs text-slate-400">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center rounded-4xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20"
        >
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">
              Welcome back
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white">Login</h2>
            <p className="mt-2 text-sm text-slate-400">
              Use your username or email to continue.
            </p>
          </div>

          <label className="mb-2 text-sm font-medium text-slate-300">
            Username or email
          </label>
          <input
            type="text"
            name="identifier"
            placeholder="Enter username or email"
            className="mb-4 w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-slate-900"
            onChange={handleChange}
            required
          />

          <label className="mb-2 text-sm font-medium text-slate-300">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            className="mb-6 w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-slate-900"
            onChange={handleChange}
            required
          />

          <button className="w-full rounded-full bg-linear-to-r from-sky-500 to-cyan-500 px-4 py-3 font-semibold text-white shadow-lg shadow-cyan-950/30 transition hover:-translate-y-0.5 hover:from-sky-400 hover:to-cyan-400">
            Login
          </button>

          <p className="mt-6 text-sm text-slate-400">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
