import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Card } from "../components/ui/card";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Table, TableHead, TableBody, TableRow, TableCell } from "../components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../components/ui/select";
import { toast, Toaster } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog as Modal, DialogContent as ModalContent, DialogHeader as ModalHeader, DialogTitle as ModalTitle } from "../components/ui/dialog";

const SUBJECTS = [
  "Mathematics", "Science", "History", "Geography", "Literature", "Computer Science", "General Knowledge"
];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Quiz management state
  const [quizzes, setQuizzes] = useState([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState("");
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [quizForm, setQuizForm] = useState({
    title: "",
    description: "",
    subject: SUBJECTS[0],
    difficulty: DIFFICULTIES[0],
    timeLimit: 10,
    questions: [
      { text: "", answers: [ { text: "", isCorrect: true }, { text: "", isCorrect: false } ], explanation: "", points: 1 }
    ],
    tags: [],
    isActive: true
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

  // User/attempt detail modals
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [attemptSearch, setAttemptSearch] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    setLoading(true);
    setError("");
    if (tab === "users") {
      fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/admin/users`, { credentials: "include" })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch users: ' + res.status);
          return res.json();
        })
        .then((data) => {
          if (data.success) setUsers(data.data);
          else setError(data.message || "Failed to fetch users");
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch users");
          setLoading(false);
        });
    } else if (tab === "attempts") {
      fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/admin/attempts`, { credentials: "include" })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch attempts: ' + res.status);
          return res.json();
        })
        .then((data) => {
          if (data.success) setAttempts(data.data);
          else setError(data.message || "Failed to fetch attempts");
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch attempts");
          setLoading(false);
        });
    }
  }, [tab, user]);

  // Fetch quizzes when tab is 'quizzes'
  useEffect(() => {
    if (tab !== "quizzes" || !user || user.role !== "admin") return;
    setQuizLoading(true);
    setQuizError("");
    fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/quizzes?limit=1000`, { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch quizzes: ' + res.status);
        return res.json();
      })
      .then(data => {
        if (data.success) setQuizzes(data.data.quizzes);
        else setQuizError(data.message || "Failed to fetch quizzes");
        setQuizLoading(false);
      })
      .catch(() => {
        setQuizError("Failed to fetch quizzes");
        setQuizLoading(false);
      });
  }, [tab, showQuizModal]);

  // Handlers for quiz modal
  const openCreateQuiz = () => {
    setEditingQuiz(null);
    setQuizForm({
      title: "",
      description: "",
      subject: SUBJECTS[0],
      difficulty: DIFFICULTIES[0],
      timeLimit: 10,
      questions: [
        { text: "", answers: [ { text: "", isCorrect: true }, { text: "", isCorrect: false } ], explanation: "", points: 1 }
      ],
      tags: [],
      isActive: true
    });
    setShowQuizModal(true);
  };
  const openEditQuiz = (quiz) => {
    setEditingQuiz(quiz);
    setQuizForm({
      ...quiz,
      questions: quiz.questions.map(q => ({
        ...q,
        answers: q.answers.map(a => ({ ...a }))
      }))
    });
    setShowQuizModal(true);
  };
  const closeQuizModal = () => {
    setShowQuizModal(false);
    setEditingQuiz(null);
  };

  // Quiz form handlers
  const handleQuizFormChange = (e) => {
    const { name, value } = e.target;
    setQuizForm(f => ({ ...f, [name]: value }));
  };
  const handleQuizQuestionChange = (idx, field, value) => {
    setQuizForm(f => {
      const questions = [...f.questions];
      questions[idx][field] = value;
      return { ...f, questions };
    });
  };
  const handleQuizAnswerChange = (qIdx, aIdx, field, value) => {
    setQuizForm(f => {
      const questions = [...f.questions];
      const answers = [...questions[qIdx].answers];
      answers[aIdx][field] = value;
      // If setting isCorrect true, set all others false
      if (field === "isCorrect" && value) {
        answers.forEach((a, i) => { if (i !== aIdx) a.isCorrect = false; });
      }
      questions[qIdx].answers = answers;
      return { ...f, questions };
    });
  };
  const addQuizQuestion = () => {
    setQuizForm(f => ({
      ...f,
      questions: [...f.questions, { text: "", answers: [ { text: "", isCorrect: true }, { text: "", isCorrect: false } ], explanation: "", points: 1 }]
    }));
  };
  const removeQuizQuestion = (idx) => {
    setQuizForm(f => ({ ...f, questions: f.questions.filter((_, i) => i !== idx) }));
  };
  const addQuizAnswer = (qIdx) => {
    setQuizForm(f => {
      const questions = [...f.questions];
      if (questions[qIdx].answers.length < 4) {
        questions[qIdx].answers.push({ text: "", isCorrect: false });
      }
      return { ...f, questions };
    });
  };
  const removeQuizAnswer = (qIdx, aIdx) => {
    setQuizForm(f => {
      const questions = [...f.questions];
      if (questions[qIdx].answers.length > 2) {
        questions[qIdx].answers = questions[qIdx].answers.filter((_, i) => i !== aIdx);
      }
      return { ...f, questions };
    });
  };

  // Submit quiz (create or edit)
  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    const method = editingQuiz ? "PUT" : "POST";
    const url = editingQuiz ? `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/quizzes/${editingQuiz._id}` : `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/quizzes`;
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(quizForm)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to save quiz");
      toast(`Quiz ${editingQuiz ? "updated" : "created"} successfully!`);
      setShowQuizModal(false);
    } catch (err) {
      toast(err.message || "Failed to save quiz", { variant: "destructive" });
    }
  };

  // Delete quiz
  const handleDeleteQuiz = async () => {
    if (!quizToDelete) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/quizzes/${quizToDelete._id}`, {
        method: "DELETE",
        credentials: "include"
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to delete quiz");
      toast("Quiz deleted successfully!");
      setShowDeleteDialog(false);
      setQuizToDelete(null);
      setShowQuizModal(false);
    } catch (err) {
      toast(err.message || "Failed to delete quiz", { variant: "destructive" });
    }
  };

  // Filtered users/attempts
  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );
  const filteredAttempts = attempts.filter(a =>
    (a.userId?.username?.toLowerCase().includes(attemptSearch.toLowerCase()) ||
     a.quizId?.title?.toLowerCase().includes(attemptSearch.toLowerCase()))
  );

  if (authLoading) return null;
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 dark:from-black dark:via-gray-900 dark:to-black">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 dark:bg-black/80 p-8 rounded-xl shadow-xl text-center">
          <h2 className="text-3xl font-bold mb-4 text-gradient bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Admin Access Required</h2>
          <p className="text-gray-700 dark:text-gray-300">You must be an admin to view this page.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-black dark:via-gray-900 dark:to-black py-16 px-4">
      <Toaster position="top-right" richColors />
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gradient bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Admin Dashboard</h1>
        <Tabs value={tab} onValueChange={setTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="attempts">Quiz Attempts</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>
        </Tabs>
        {loading && <div className="text-center text-lg text-gray-500 dark:text-gray-300">Loading...</div>}
        {error && <div className="text-center text-red-500 mb-4">{error}</div>}
        {/* Users Tab */}
        {tab === "users" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-purple-700 dark:text-pink-400">All Users</h2>
              <div className="text-xs text-gray-500 dark:text-gray-400 mr-4">Search is client-side and only works for loaded users.</div>
              <Input
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                placeholder="Search users..."
                className="w-64"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredUsers.map((u) => (
                <Card key={u._id} className="p-6 bg-white/90 dark:bg-gray-900/80 rounded-xl shadow-lg cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => setSelectedUser(u)}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg text-purple-600 dark:text-pink-400">{u.username}</span>
                    <span className="text-xs px-2 py-1 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white">{u.role}</span>
                  </div>
                  <div className="text-gray-700 dark:text-gray-200 mb-1">{u.email}</div>
                  <div className="text-gray-400 text-xs">ID: {u._id}</div>
                </Card>
              ))}
              {filteredUsers.length === 0 && <div className="col-span-2 text-center text-gray-500">No users found.</div>}
            </div>
            {/* User Detail Modal */}
            <Modal open={!!selectedUser} onOpenChange={v => !v && setSelectedUser(null)}>
              <ModalContent>
                <ModalHeader>
                  <ModalTitle>User Details</ModalTitle>
                </ModalHeader>
                {selectedUser && (
                  <div className="space-y-2">
                    <div><span className="font-semibold">Username:</span> {selectedUser.username}</div>
                    <div><span className="font-semibold">Email:</span> {selectedUser.email}</div>
                    <div><span className="font-semibold">Role:</span> {selectedUser.role}</div>
                    <div><span className="font-semibold">ID:</span> {selectedUser._id}</div>
                    <div><span className="font-semibold">Created:</span> {new Date(selectedUser.createdAt).toLocaleString()}</div>
                  </div>
                )}
              </ModalContent>
            </Modal>
          </div>
        )}
        {/* Attempts Tab */}
        {tab === "attempts" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-purple-700 dark:text-pink-400">All Quiz Attempts</h2>
              <div className="text-xs text-gray-500 dark:text-gray-400 mr-4">Search is client-side and only works for loaded attempts.</div>
              <Input
                value={attemptSearch}
                onChange={e => setAttemptSearch(e.target.value)}
                placeholder="Search attempts..."
                className="w-64"
              />
            </div>
            <div className="overflow-x-auto rounded-xl shadow-lg bg-white/90 dark:bg-gray-900/80">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Quiz</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAttempts.map((a) => (
                    <TableRow key={a._id} className="cursor-pointer hover:bg-purple-50 dark:hover:bg-gray-800" onClick={() => setSelectedAttempt(a)}>
                      <TableCell>{a.userId?.username || "-"} <span className="block text-xs text-gray-400">{a.userId?.email}</span></TableCell>
                      <TableCell>{a.quizId?.title || "-"} <span className="block text-xs text-gray-400">{a.quizId?.subject}</span></TableCell>
                      <TableCell>{a.score ?? "-"}</TableCell>
                      <TableCell>{new Date(a.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  {filteredAttempts.length === 0 && <TableRow><TableCell colSpan="4" className="text-center text-gray-500">No attempts found.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
            {/* Attempt Detail Modal */}
            <Modal open={!!selectedAttempt} onOpenChange={v => !v && setSelectedAttempt(null)}>
              <ModalContent>
                <ModalHeader>
                  <ModalTitle>Attempt Details</ModalTitle>
                </ModalHeader>
                {selectedAttempt && (
                  <div className="space-y-2">
                    <div><span className="font-semibold">User:</span> {selectedAttempt.userId?.username} ({selectedAttempt.userId?.email})</div>
                    <div><span className="font-semibold">Quiz:</span> {selectedAttempt.quizId?.title} ({selectedAttempt.quizId?.subject})</div>
                    <div><span className="font-semibold">Score:</span> {selectedAttempt.score}</div>
                    <div><span className="font-semibold">Correct Answers:</span> {selectedAttempt.correctAnswers}</div>
                    <div><span className="font-semibold">Total Questions:</span> {selectedAttempt.totalQuestions}</div>
                    <div><span className="font-semibold">Date:</span> {new Date(selectedAttempt.createdAt).toLocaleString()}</div>
                    <div><span className="font-semibold">Attempt ID:</span> {selectedAttempt._id}</div>
                  </div>
                )}
              </ModalContent>
            </Modal>
          </div>
        )}
        {tab === "quizzes" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-purple-700 dark:text-pink-400">Manage Quizzes</h2>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white" onClick={openCreateQuiz}><Plus className="w-5 h-5 mr-2" />Create Quiz</Button>
            </div>
            {quizLoading && <div className="text-center text-lg text-gray-500 dark:text-gray-300">Loading quizzes...</div>}
            {quizError && <div className="text-center text-red-500 mb-4">{quizError}</div>}
            {!quizLoading && !quizError && (
              <div className="overflow-x-auto rounded-xl shadow-lg bg-white/90 dark:bg-gray-900/80">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Difficulty</TableCell>
                      <TableCell>Questions</TableCell>
                      <TableCell>Time Limit</TableCell>
                      <TableCell>Active</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {quizzes.map(q => (
                      <TableRow key={q._id}>
                        <TableCell>{q.title}</TableCell>
                        <TableCell>{q.subject}</TableCell>
                        <TableCell>{q.difficulty}</TableCell>
                        <TableCell>{q.questions.length}</TableCell>
                        <TableCell>{q.timeLimit || "-"} min</TableCell>
                        <TableCell>{q.isActive ? "Yes" : "No"}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" className="mr-2" onClick={() => openEditQuiz(q)}><Edit className="w-4 h-4" /></Button>
                          <Button size="sm" variant="destructive" onClick={() => { setQuizToDelete(q); setShowDeleteDialog(true); }}><Trash2 className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {quizzes.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-gray-500">No quizzes found.</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </div>
            )}
            {/* Quiz Modal */}
            <Dialog open={showQuizModal} onOpenChange={setShowQuizModal}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingQuiz ? "Edit Quiz" : "Create Quiz"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleQuizSubmit} className="space-y-4">
                  <Input name="title" value={quizForm.title} onChange={handleQuizFormChange} placeholder="Quiz Title" required className="w-full" />
                  <Input name="description" value={quizForm.description} onChange={handleQuizFormChange} placeholder="Description" required className="w-full" />
                  <div className="flex gap-4">
                    <Select value={quizForm.subject} onValueChange={v => setQuizForm(f => ({ ...f, subject: v }))}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Subject" /></SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={quizForm.difficulty} onValueChange={v => setQuizForm(f => ({ ...f, difficulty: v }))}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Difficulty" /></SelectTrigger>
                      <SelectContent>
                        {DIFFICULTIES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input name="timeLimit" type="number" min={1} max={180} value={quizForm.timeLimit} onChange={handleQuizFormChange} placeholder="Time Limit (minutes)" className="w-full" />
                  {/* Questions */}
                  <div className="space-y-6">
                    {quizForm.questions.map((q, qIdx) => (
                      <div key={qIdx} className="p-4 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-800 dark:to-gray-900">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-purple-700 dark:text-pink-400">Question {qIdx + 1}</span>
                          {quizForm.questions.length > 1 && <Button size="sm" variant="destructive" onClick={e => { e.preventDefault(); removeQuizQuestion(qIdx); }}>Remove</Button>}
                        </div>
                        <Input value={q.text} onChange={e => handleQuizQuestionChange(qIdx, "text", e.target.value)} placeholder="Question text" required className="mb-2" />
                        <Input value={q.explanation} onChange={e => handleQuizQuestionChange(qIdx, "explanation", e.target.value)} placeholder="Explanation (optional)" className="mb-2" />
                        <Input type="number" min={1} value={q.points} onChange={e => handleQuizQuestionChange(qIdx, "points", Number(e.target.value))} placeholder="Points" className="mb-2 w-32" />
                        {/* Answers */}
                        <div className="space-y-2">
                          {q.answers.map((a, aIdx) => (
                            <div key={aIdx} className="flex items-center gap-2">
                              <Input value={a.text} onChange={e => handleQuizAnswerChange(qIdx, aIdx, "text", e.target.value)} placeholder={`Answer ${aIdx + 1}`} required className="flex-1" />
                              <label className="flex items-center gap-1 text-xs">
                                <input type="radio" name={`correct-${qIdx}`} checked={a.isCorrect} onChange={() => handleQuizAnswerChange(qIdx, aIdx, "isCorrect", true)} /> Correct
                              </label>
                              {q.answers.length > 2 && <Button size="sm" variant="destructive" onClick={e => { e.preventDefault(); removeQuizAnswer(qIdx, aIdx); }}>Remove</Button>}
                            </div>
                          ))}
                          {q.answers.length < 4 && <Button size="sm" variant="outline" onClick={e => { e.preventDefault(); addQuizAnswer(qIdx); }}>Add Answer</Button>}
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" onClick={e => { e.preventDefault(); addQuizQuestion(); }}>Add Question</Button>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-full">{editingQuiz ? "Update Quiz" : "Create Quiz"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Quiz</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete this quiz? This action cannot be undone.</p>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                  <Button variant="destructive" onClick={handleDeleteQuiz}>Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </motion.div>
    </div>
  );
} 