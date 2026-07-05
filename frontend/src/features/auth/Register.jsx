import { useState } from "react";
import { registerUser } from "../../api/userApi";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    avatar: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "avatar") {
      setForm({ ...form, avatar: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      await registerUser(formData);

      alert("Registered successfully");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 text-slate-100">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-4xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20"
        >
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">
              Create account
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white">Register</h2>
            <p className="mt-2 text-sm text-slate-400">
              Start with a profile and jump straight into task planning.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="jane.doe"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-slate-900"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Full name
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Jane Doe"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-slate-900"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="jane@example.com"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-slate-900"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-slate-900"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Profile image
            </label>
            <input
              type="file"
              name="avatar"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-400 file:mr-4 file:rounded-full file:border-0 file:bg-sky-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-sky-400"
              onChange={handleChange}
              required
            />
          </div>

          <button className="mt-6 w-full rounded-full bg-linear-to-r from-sky-500 to-cyan-500 px-4 py-3 font-semibold text-white shadow-lg shadow-cyan-950/30 transition hover:-translate-y-0.5 hover:from-sky-400 hover:to-cyan-400">
            Register
          </button>

          <p className="mt-6 text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white"
            >
              Login
            </Link>
          </p>
        </form>

        <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-slate-950/55 p-8 shadow-2xl backdrop-blur">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.24),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(244,114,182,0.18),transparent_26%)]" />
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-sky-200/70">
                Build your workspace
              </p>
              <h1 className="mt-4 max-w-xl text-4xl font-black leading-tight text-white sm:text-6xl">
                A cleaner place to manage work and momentum.
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-6 text-slate-300 sm:text-base">
                Create an account to keep tasks, filters, analytics, and profile
                settings in one polished dashboard.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Avatar", "Upload a profile image"],
                ["Account", "Edit details anytime"],
                ["Workflow", "Track tasks clearly"],
                ["Access", "Protected by cookies"],
              ].map(([title, body]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
                >
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-1 text-xs text-slate-400">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Register;
