import { useEffect, useState } from "react";
import axios from "axios";

const API = "/api/students";

const emptyForm = { name: "", fatherName: "", rollNo: "", email: "", semester: "", section: "" };export default function App() {
  const [form, setForm] = useState(emptyForm);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(API);
      const list = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];
      setStudents(list);
    } catch (err) {
      setError("Failed to load students. Is the server running?");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, form);
      } else {
        await axios.post(API, form);
      }
      reset();
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save student.");
    } finally {
      setSubmitting(false);
    }
  };

  const edit = (student) => {
    setEditingId(student._id);
    setForm({
      name: student.name,
      fatherName: student.fatherName || "",
      rollNo: student.rollNo,
      email: student.email,
      semester: student.semester,
      section: student.section,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      await load();
    } catch (err) {
      setError("Failed to delete student.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <h1 className="text-2xl font-bold text-slate-800">Student Management</h1>
          <p className="text-sm text-slate-500">MERN stack CRUD application</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            {editingId ? "Edit Student" : "Add Student"}
          </h2>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={form.name}
                onChange={onChange("name")}
                required
              />
            </div>
                        <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Father Name</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={form.fatherName}
                onChange={onChange("fatherName")}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Roll No</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={form.rollNo}
                onChange={onChange("rollNo")}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={form.email}
                onChange={onChange("email")}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Semester</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={form.semester}
                onChange={onChange("semester")}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Section</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={form.section}
                onChange={onChange("section")}
                required
              />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {submitting ? "Saving..." : editingId ? "Update Student" : "Add Student"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-lg border border-slate-300 px-5 py-2 font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Students</h2>
            <span className="text-sm text-slate-500">{students.length} total</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading...</div>
          ) : students.length === 0 ? (
            <div className="py-12 text-center text-slate-500">No students yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="px-3 py-2 font-medium">Name</th>
                                        <th className="px-3 py-2 font-medium">Father Name</th>
                    <th className="px-3 py-2 font-medium">Roll No</th>
                    <th className="px-3 py-2 font-medium">Email</th>
                    <th className="px-3 py-2 font-medium">Semester</th>
                    <th className="px-3 py-2 font-medium">Section</th>
                    <th className="px-3 py-2 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-3 py-2">{s.name}</td>
                                            <td className="px-3 py-2">{s.fatherName || "-"}</td>
                      <td className="px-3 py-2">{s.rollNo}</td>
                      <td className="px-3 py-2">{s.email}</td>
                      <td className="px-3 py-2">{s.semester}</td>
                      <td className="px-3 py-2">{s.section}</td>
                      <td className="px-3 py-2 text-right space-x-2">
                        <button
                          onClick={() => edit(s)}
                          className="rounded-md border border-slate-300 px-3 py-1 text-slate-700 hover:bg-slate-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => remove(s._id)}
                          className="rounded-md bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
