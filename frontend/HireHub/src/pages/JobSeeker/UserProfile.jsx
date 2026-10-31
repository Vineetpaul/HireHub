import { useEffect, useState } from 'react';
import { FileText, User, Upload, Trash2 } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import uploadImage from '../../utils/uploadImage';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removingResume, setRemovingResume] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    axiosInstance.get(API_PATHS.AUTH.GET_PROFILE)
      .then(({ data }) => {
        if (active) {
          setUser(data);
          setName(data.name || '');
        }
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || 'Could not load your profile.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const profile = { name: name.trim() };
      if (avatarFile) profile.avatar = (await uploadImage(avatarFile)).imageUrl;
      if (resumeFile) profile.resume = (await uploadImage(resumeFile)).imageUrl;
      const { data } = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, profile);
      setUser((current) => ({ ...current, ...data }));
      setAvatarFile(null);
      setResumeFile(null);
      event.target.reset();
      setMessage('Your profile has been updated.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveResume = async () => {
    setRemovingResume(true);
    setError('');
    setMessage('');
    try {
      await axiosInstance.delete(API_PATHS.AUTH.DELETE_RESUME, { data: { resumeUrl: user.resume } });
      setUser((current) => ({ ...current, resume: '' }));
      setResumeFile(null);
      setMessage('Resume removed.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not remove your resume.');
    } finally {
      setRemovingResume(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fafe]">
      <Navbar />
      <main className="container mx-auto max-w-3xl px-4 pb-12 pt-24 sm:px-6">
        <div className="mb-7">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-1 text-gray-500">Keep your information up to date.</p>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <p className="text-sm text-gray-500">Loading your profile...</p>
          </div>
        ) : error && !user ? (
          <div role="alert" className="rounded-2xl border border-red-200 bg-white p-8 text-center text-red-600">{error}</div>
        ) : user && (
          <form onSubmit={handleSave} className="space-y-5">
            {(error || message) && (
              <p role={error ? 'alert' : 'status'} className={`rounded-lg px-4 py-3 text-sm ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {error || message}
              </p>
            )}

            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 text-lg font-semibold text-gray-900">Personal information</h2>
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-blue-50 text-blue-600">
                  {user.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : <User className="h-7 w-7" />}
                </div>
                <label className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Upload className="mr-2 inline h-4 w-4" />
                  {avatarFile ? avatarFile.name : 'Change photo'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        setAvatarFile(file);
                        setError('');
                        setMessage('');
                      }
                    }}
                  />
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full name
                  <input
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                  <input
                    value={user.email || ''}
                    readOnly
                    className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-500"
                  />
                </label>
              </div>
            </section>

            {user.role === 'jobSeeker' && (
              <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-2 text-lg font-semibold text-gray-900">Resume</h2>
                <p className="mb-5 text-sm text-gray-500">Upload a PDF so employers can review your experience.</p>
                {user.resume && (
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-gray-50 p-3">
                    <a href={user.resume} target="_blank" rel="noreferrer" className="flex min-w-0 items-center gap-2 text-sm font-medium text-blue-600 hover:underline">
                      <FileText className="h-5 w-5 shrink-0" />
                      <span className="truncate">View current resume</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleRemoveResume}
                      disabled={removingResume}
                      className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      {removingResume ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                )}
                <label className="block cursor-pointer rounded-lg border border-dashed border-gray-300 p-5 text-center text-sm text-gray-600 hover:border-blue-400 hover:bg-blue-50/50">
                  <Upload className="mx-auto mb-2 h-5 w-5 text-gray-400" />
                  {resumeFile ? resumeFile.name : 'Choose a PDF resume'}
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        setResumeFile(file);
                        setError('');
                        setMessage('');
                      }
                    }}
                  />
                </label>
              </section>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving || !name.trim()}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default UserProfile;
