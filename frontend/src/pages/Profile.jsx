import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {
  changeCurrentPassword,
  updateAccountDetails,
  updateUserAvatar,
} from "../api/userApi";

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [accountForm, setAccountForm] = useState({
    fullName: "",
    email: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [accountSaving, setAccountSaving] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setAccountForm({
        fullName: user.fullName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleAccountSubmit = async (e) => {
    e.preventDefault();

    try {
      setAccountSaving(true);
      const res = await updateAccountDetails(accountForm);
      setUser(res.data.data);
      toast.success("Account updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update account");
    } finally {
      setAccountSaving(false);
    }
  };

  const handleAvatarSubmit = async (e) => {
    e.preventDefault();

    if (!avatarFile) {
      toast.error("Please choose an image first");
      return;
    }

    try {
      setAvatarSaving(true);
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const res = await updateUserAvatar(formData);
      setUser(res.data.data);
      setAvatarFile(null);
      toast.success("Avatar updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update avatar");
    } finally {
      setAvatarSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      setPasswordSaving(true);
      await changeCurrentPassword(passwordForm);
      setPasswordForm({ oldPassword: "", newPassword: "" });
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-12 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-slate-900/70 p-8 text-center shadow-2xl backdrop-blur">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Profile
          </p>
          <h1 className="mt-3 text-3xl font-bold">Loading profile...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.92),rgba(15,23,42,1))] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-slate-950/20 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Account Center
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white">Profile</h1>
            <p className="mt-1 text-sm text-slate-300">
              Update your account, avatar, and password in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Back to dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-slate-950/65 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="h-28 w-28 rounded-3xl border border-white/15 object-cover shadow-lg"
                />

                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                    Username
                  </p>
                  <h2 className="text-2xl font-bold text-white">{user.username}</h2>
                  <p className="text-slate-300">{user.fullName}</p>
                  <p className="text-sm text-slate-400">{user.email}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Member since
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Updated
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">
                    {user.updatedAt
                      ? new Date(user.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Status
                  </p>
                  <p className="mt-2 text-sm font-medium text-emerald-300">
                    Active session
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-slate-100 shadow-2xl shadow-slate-950/20">
              <h2 className="text-2xl font-bold">Edit account</h2>
              <p className="mt-1 text-sm text-slate-400">
                Change your display name and email address.
              </p>

              <form onSubmit={handleAccountSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={accountForm.fullName}
                    onChange={(e) =>
                      setAccountForm({ ...accountForm, fullName: e.target.value })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:bg-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={accountForm.email}
                    onChange={(e) =>
                      setAccountForm({ ...accountForm, email: e.target.value })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:bg-slate-900"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={accountSaving}
                  className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {accountSaving ? "Saving..." : "Save changes"}
                </button>
              </form>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-slate-100 shadow-2xl shadow-slate-950/20">
              <h2 className="text-2xl font-bold">Update avatar</h2>
              <p className="mt-1 text-sm text-slate-400">
                Upload a new profile image.
              </p>

              <form onSubmit={handleAvatarSubmit} className="mt-6 space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  className="block w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300"
                  required
                />

                <button
                  type="submit"
                  disabled={avatarSaving}
                  className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {avatarSaving ? "Uploading..." : "Upload avatar"}
                </button>
              </form>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-slate-100 shadow-2xl shadow-slate-950/20">
              <h2 className="text-2xl font-bold">Change password</h2>
              <p className="mt-1 text-sm text-slate-400">
                Keep your account secure with a new password.
              </p>

              <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Current password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.oldPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        oldPassword: e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:bg-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    New password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:bg-slate-900"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {passwordSaving ? "Updating..." : "Change password"}
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;