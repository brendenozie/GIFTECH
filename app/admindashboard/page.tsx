"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, Users2, Globe, DollarSign, TrendingUp, 
  Search, Loader2, Download, ArrowUpRight, ArrowDownLeft, 
  Filter, Award, Star, Microscope, Building2, Plus, X, UserPlus,
  Trash2,
  Edit2,
  CalendarPlus,
  MapPin,
  Clock,
  AlertTriangle
} from "lucide-react";
import SchoolModal from "@/components/SchoolModal";
import StudentEnrollmentModal from "@/components/StudentEnrollmentModal";
import { time } from "console";
import CreateAssignmentModal from "@/components/CreateAssignmentModal";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function AdminDashboard() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("Global Insights");
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [globalStats, setGlobalStats] = useState<any>(null);
  const [facultyStats, setFacultyStats] = useState<any>(null);
  const [data, setData] = useState({
    faculty: [] as any[],
    revenue: [],
    transactions: [],
    schools: [] as any[],
    students: [] as any[],
    timetable: [] as any[]
  });

  // --- FORM STATE ---
  const [newMember, setNewMember] = useState({
    _id: "",
    name: "",
    role: "Senior Researcher",
    dept: "Applied Physics",
    research: "",
    progress: 50,
    status: "Active"
  });

  const [schoolForm, setSchoolForm] = useState({
    name: "",
    region: "",
    type: "Public",
    studentCount: 0
  });

  
  const [studentForm, setStudentForm] = useState({ 
    name: "", 
    grade: "", 
    status: "Active", 
    entryYear: 2026 
  });

  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

  // --- API DATA FETCHING ---
  useEffect(() => {
    const initLoad = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/admin/stats');
        const stats = await res.json();
        setGlobalStats(stats);
      } catch (e) { console.error("Initial load failed"); }
      finally { setIsLoading(false); }
    };
    initLoad();
  }, []);

  useEffect(() => {
    const fetchTabSpecifics = async () => {
      setIsGenerating(true);
      try {
        if (activeTab === "Faculty Management") {
          const [listRes, statRes] = await Promise.all([
            fetch('/api/faculty'),
            fetch('/api/faculty/stats')
          ]);
          const listData = await listRes.json();
          setData(prev => ({ ...prev, faculty: listData.faculty }));
          setFacultyStats(await statRes.json());
        } 
        else if (activeTab === "Revenue & Billing") {
          const res = await fetch('/api/finance');
          const json = await res.json();
          setData(prev => ({ ...prev, transactions: json.transactions, revenue: json.revenueData }));
        }
        else if (activeTab === "School Management") {
          const res = await fetch('/api/schools');
          const json = await res.json();
          setData(prev => ({ ...prev, schools: json }));
        }
        else if (activeTab === "Global Insights") {
          const res = await fetch('/api/admin/stats');
          const stats = await res.json();
          setGlobalStats(stats);
        }
        else if (activeTab === "School Management" && selectedSchool) {
          const res = await fetch(`/api/students?schoolId=${selectedSchool._id}`);
          const json = await res.json();

        }else if (activeTab === "Timetable") {
          const res = await fetch('/api/timetable');
          const json = await res.json();

          
          const resSchools = await fetch('/api/schools');
          const jsonSchools = await resSchools.json();

        
          const resFaculty = await fetch('/api/faculty');
          const jsonFaculty = await resFaculty.json();

          setData(prev => ({ ...prev, timetable: json, students: json, schools: jsonSchools, faculty: jsonFaculty.faculty }));
          setSelectedAssignment(null);

        }
      } catch (e) { console.error("Tab sync failed"); }
      finally { setIsGenerating(false); }
    };
    fetchTabSpecifics();
  }, [activeTab, selectedSchool]);

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a list or in the same spot
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    // 1. Find the moved item
    const movedItem = data.timetable?.find(t => t._id === draggableId);
    if (!movedItem) return;

    // 2. Update local state optimistically
    const updatedTimetable = data.timetable.length > 0 ? data.timetable?.map(t => {
      if (t._id === draggableId) {
        return { ...t, day: destination.droppableId }; // Update the day to the new column
      }
      return t;
    }) : [];

    setData(prev => ({ ...prev, timetable: updatedTimetable }));

    // 3. Persist to Backend
    try {
      await fetch(`/api/timetable?id=${draggableId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day: destination.droppableId }),
      });
    } catch (error) {
      console.error("Failed to save drag movement");
      // Optional: Revert state on error
      setData(prev => ({ ...prev, timetable: data.timetable }));
    }
  };

  // --- ADD FACULTY LOGIC ---
  const handleAddFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await fetch('/api/faculty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember),
      });

      if (res.ok) {
        const savedMember = await res.json();
        setData(prev => ({ ...prev, faculty: [savedMember, ...prev.faculty] }));
        setIsModalOpen(false);
        setNewMember({ _id: "", name: "", role: "Senior Researcher", dept: "Applied Physics", research: "", progress: 50, status: "Active" });
      }
    } catch (error) {
      alert("System failed to register new faculty member.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Simple confirmation to prevent accidental clicks
    if (!confirm("Are you sure you want to remove this faculty member?")) return;

    try {
      const res = await fetch(`/api/faculty?id=${id}`, { method: 'DELETE' });
      
      if (res.ok) {
        // Optimistic Update: Remove from local state immediately
        setData(prev => ({
          ...prev,
          faculty: prev.faculty.filter(f => f._id !== id)
        }));
      }
    } catch (error) {
      alert("Could not remove member. Please try again.");
    }
  };
  const openEditModal = (member: any) => {
    setNewMember(member); // Pre-fill form with existing data
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Update the Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    const method = isEditing ? 'PATCH' : 'POST';
    
    try {
      const res = await fetch('/api/faculty', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember),
      });

      if (res.ok) {
        // Refresh local data
        const updatedMember = isEditing ? newMember : await res.json();
        setData(prev => ({
          ...prev,
          faculty: isEditing 
            ? prev.faculty.map(f => f._id === newMember._id ? updatedMember : f)
            : [updatedMember, ...prev.faculty]
        }));
        
        setIsModalOpen(false);
        setIsEditing(false);
        setNewMember({ _id: "", name: "", role: "Senior Researcher", dept: "Applied Physics", research: "", progress: 50, status: "Active" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSchoolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    const method = isEditing ? 'PATCH' : 'POST';
    
    try {
      const res = await fetch('/api/schools', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schoolForm),
      });

      if (res.ok) {
        // Re-fetch schools to ensure data integrity
        const updatedList = await fetch('/api/schools').then(r => r.json());
        setData(prev => ({ ...prev, schools: updatedList }));
        setIsSchoolModalOpen(false);
      }
    } catch (error) {
      console.error("School registration failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditSchool = (school: any) => {
    setSchoolForm(school);
    setIsEditing(true);
    setIsSchoolModalOpen(true);
  };

  const handleDeleteSchool = async (id: string) => {
    if (!confirm("Are you sure you want to delete this school?")) return; 
    try {
      const res = await fetch(`/api/schools?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setData(prev => ({
          ...prev,
          schools: prev.schools.filter((s: any) => s._id !== id)
        }));
      }
    } catch (error) {
      console.error("Failed to delete school");
    }
  };


  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...studentForm,
          schoolId: selectedSchool._id // Passing the active school context
        }),
      });

      if (res.ok) {
        const newStudent = await res.json();
        // Update local student state so they appear in the roster immediately
        setData(prev => ({ 
          ...prev, 
          students: [...prev.students, newStudent] 
        }));
        setIsStudentModalOpen(false);
        setStudentForm({ name: "", grade: "", status: "Active", entryYear: 2026 });
      }
    } catch (error) {
      console.error("Enrollment failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const timeToMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const handleCreateAssignment = async (assignmentData: any) => {
  // 1. Conflict Check Logic
  const newStart = timeToMinutes(assignmentData.startTime);
  const newEnd = timeToMinutes(assignmentData.endTime);

  const conflict = data.timetable.find(entry => {
    // Check if it's the same faculty member on the same day
    if (entry.facultyId === assignmentData.facultyId && entry.day === assignmentData.day) {
      const existingStart = timeToMinutes(entry.startTime);
      const existingEnd = timeToMinutes(entry.endTime);

      // Overlap formula: (StartA < EndB) && (EndA > StartB)
      return newStart < existingEnd && newEnd > existingStart;
    }
    return false;
  });

  if (conflict) {
    alert(`Conflict detected! This faculty member is already assigned to ${conflict.subject} from ${conflict.startTime} to ${conflict.endTime}.`);
    return; // Stop the execution
  }

  const method = selectedAssignment ? 'PATCH' : 'POST';

  // 2. Proceed with API call if no conflict
  setIsGenerating(true);
  try {
    const res = await fetch('/api/timetable', {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...assignmentData,
        id: selectedAssignment?._id // Include the ID for PATCH requests
      }),
    });

    if (res.ok) {
      const newEntry = await res.json();
      setData(prev => ({ ...prev, timetable: [...prev.timetable, newEntry] }));
      setIsAssignmentModalOpen(false);
      setSelectedAssignment(null);
    }
  } catch (error) {
    console.error("Save failed", error);
  } finally {
    setIsGenerating(false);
  }
};

  // const handleCreateAssignment = async (assignmentData: any) => {
  //   setIsGenerating(true);
  //   try {
  //     const res = await fetch('/api/timetable', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(assignmentData),
  //     });

  //     if (res.ok) {
  //       const newEntry = await res.json();
  //       setData(prev => ({
  //         ...prev,
  //         timetable: [...prev.timetable, newEntry]
  //       }));
        
  //       // Close the modal ONLY on success
  //       setIsAssignmentModalOpen(false); 
  //       // Optional: Reset your form data state
  //       setSelectedAssignment(null); 
  //     } else {
  //       // Handle server errors (e.g., show a toast notification)
  //       console.error("Server returned an error");
  //     }
  //   } catch (error) {
  //     console.error("Failed to create assignment", error);
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };
  const hasTimeConflict = (currentEntry:any, allEntries:any[]) => {
    const toMin = (t:string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const startA = toMin(currentEntry.startTime);
    const endA = toMin(currentEntry.endTime);

    return allEntries.some(other => {
      // 1. Must be different records
      if (currentEntry._id === other._id) return false;
      
      // 2. Must be the same faculty member on the same day
      if (currentEntry.facultyId !== other.facultyId || currentEntry.day !== other.day) return false;

      const startB = toMin(other.startTime);
      const endB = toMin(other.endTime);

      // 3. Overlap formula: (StartA < EndB) AND (EndA > StartB)
      return startA < endB && endA > startB;
    });
  };

  const handleDeleteAssignment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/timetable?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setData(prev => ({
          ...prev,
          timetable: prev.timetable.filter((t: any) => t._id !== id)
        }));
      }
    } catch (error) {
      console.error("Failed to delete assignment");
    } finally {
      setIsGenerating(false);
    }
  };

  const openEditAssignmentModal = (entry: any) => {
    // setSelectedSchool(entry); // Reusing selectedSchool state to pass context
    // setIsScheduleModalOpen(true);
    setIsAssignmentModalOpen(true);
    setSelectedAssignment(entry);
  };

  // --- CONTEXTUAL SEARCH ---
  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (activeTab === "Faculty Management") {
      return data.faculty && data.faculty.length > 0 ? data.faculty?.filter((f: any) => 
        f.name.toLowerCase().includes(q) || f.dept.toLowerCase().includes(q)
      ) : [];
    }
    if (activeTab === "Revenue & Billing") {
      return data.transactions && data.transactions.length > 0 ? data.transactions?.filter((t: any) => 
        t.entity.toLowerCase().includes(q) || (t.id && t.id.toLowerCase().includes(q))
      ) : [];
    }
    if (activeTab === "School Management") {
      return data.schools && data.schools.length > 0 ? data.schools?.filter((s: any) => 
        s.name.toLowerCase().includes(q) || s.region.toLowerCase().includes(q)
      ) : [];
    }
    return [];
  }, [searchQuery, activeTab, data]);


  const maxRevenue = data.revenue && data.revenue.length > 0 ? Math.max(...data.revenue?.map((d: any) => d.amount)) : 1;

  // Inside your AdminDashboard component
  const enrichedTimetable = useMemo(() => {
    return data.timetable ? data.timetable?.map(entry => {
      // Find the faculty name from the faculty list we already fetched
      const faculty = data.faculty?.find(f => f._id === entry.facultyId);
      // Find the school name from the schools list
      const school = data.schools ? data.schools?.find(s => s._id === entry.schoolId) : null;

      return {
        ...entry,
        facultyName: faculty ? faculty.name : "Unassigned",
        schoolName: school ? school.name : "Unknown Location"
      };
    }) : [];
  }, [data.timetable, data.faculty, data.schools]);

  if (isLoading) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-white border-r border-slate-200 p-8 flex flex-col">
        <div className="flex items-center gap-3 mb-12">
          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">Gif <span className="text-blue-600">Tech</span></span>
        </div>

        <nav className="flex-grow space-y-2">
          {[
            { label: "Global Insights", icon: BarChart3 },
            { label: "Faculty Management", icon: Users2, count: data.faculty?.length || 0 },
            { label: "School Management", icon: Building2 },
            { label: "Timetable", icon: CalendarPlus },
            { label: "Revenue & Billing", icon: DollarSign },
          ].map((item) => (
            <button 
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeTab === item.label ? "bg-blue-50 text-blue-600 border border-blue-100" : "hover:bg-slate-50 text-slate-500"
              }`}
            >
              <div className="flex items-center gap-3 font-bold text-sm">
                <item.icon className="w-4 h-4" /> {item.label}
              </div>
              {item.count ? <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded">{item.count}</span> : null}
            </button>
          ))}
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow overflow-y-auto p-10">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tight">{activeTab}</h1>
            <p className="text-slate-500 font-medium text-sm">System operational. </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..."
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm w-64 focus:ring-2 focus:ring-blue-500/20 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {activeTab === "Faculty Management" && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                <Plus className="w-4 h-4" /> Add Member
              </button>
            )}
          </div>
        </header>

        {/* --- VIEW: FACULTY MANAGEMENT --- */}
        {activeTab === "Faculty Management" && (
          <div className="space-y-8">
            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Verified Faculty", val: facultyStats?.totalFaculty || 0, icon: Users2, bg: "bg-blue-50", text: "text-blue-600" },
                { label: "Active Grants", val: facultyStats?.activeGrants || 0, icon: Award, bg: "bg-purple-50", text: "text-purple-600" },
                { label: "Monthly Output", val: `+${facultyStats?.researchGrowth || 0}%`, icon: Microscope, bg: "bg-emerald-50", text: "text-emerald-600" },
              ].map((s, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-5">
                  <div className={`p-4 rounded-2xl ${s.bg} ${s.text}`}><s.icon className="w-6 h-6" /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">{s.label}</p>
                    <p className="text-2xl font-black">{s.val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Faculty Directory */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredData && filteredData.map((person: any) => (
                 <motion.div 
                    layout 
                    key={person._id} 
                    className="group relative bg-white border border-slate-200 rounded-[2.5rem] p-8 hover:shadow-lg transition-all"
                  >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black">{person.name.charAt(0)}</div>
                      <div>
                        <h4 className="font-black text-slate-900">{person.name}</h4>
                        <p className="text-xs text-blue-600 font-bold">{person.dept}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${person.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                      {person.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 italic mb-4">&quot;{person.research}&quot;</p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                      <span>Research Track</span>
                      <span>{person.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${person.progress}%` }} className="h-full bg-blue-600" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={() => openEditModal(person)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <Edit2 className="w-6 h-6" />
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(person._id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* --- OTHER TABS (REVENUE / INSIGHTS) --- */}
        {activeTab === "Global Insights" && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Active Nodes", val: globalStats?.activeEnrolled || 0, icon: Globe, color: "text-blue-600" },
              { label: "Gross Revenue", val: `$${(globalStats?.totalRevenue / 1000 || 0).toFixed(1)}k`, icon: TrendingUp, color: "text-emerald-600" },
              { label: "Avg. Project ROI", val: "24.2%", icon: Star, color: "text-purple-600" },
            ].map((stat, i) => (
              <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm">
                 <stat.icon className={`w-5 h-5 ${stat.color} mb-4`} />
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</p>
                 <p className="text-4xl font-black text-slate-900 mt-1">{stat.val}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "School Management" && (
          <div className="space-y-8">
            <header className="flex justify-between items-center">
              <h2 className="text-xl font-black">Registered Institutions</h2>
              <button 
                onClick={() => { setIsEditing(false); setSchoolForm({ name: "", region: "", type: "Public", studentCount: 0 }); setIsSchoolModalOpen(true); }}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add School
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.schools && data.schools?.map((school: any) => (
                <div key={school._id} className="group relative bg-white border border-slate-200 p-6 rounded-[2rem] hover:shadow-xl transition-all">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
                    <button onClick={() => handleEditSchool(school)} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600"><Edit2 className="w-3 h-3" /></button>
                    <button onClick={() => handleDeleteSchool(school._id)} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
                    <button onClick={() => { setSelectedSchool(school); }} 
                      className="w-full mt-4 py-3 bg-slate-50 text-slate-900 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                    >
                      View Student Roster
                    </button>
                  </div>
                  
                  <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                    <Building2 className="w-6 h-6" />
                  </div>
                  
                  <h3 className="font-black text-slate-900 mb-1">{school.name}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tight mb-4">{school.region}</p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Students</p>
                      <p className="font-bold text-slate-900">{school.studentCount.toLocaleString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${school.type === 'Public' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'}`}>
                      {school.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Timetable" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div>
                <h2 className="text-2xl font-black italic">Master Dispatch</h2>
                <p className="text-xs font-bold text-slate-400">Faculty Resource Allocation</p>
              </div>
              <button 
                onClick={() => setIsAssignmentModalOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100"
              >
                <CalendarPlus className="w-4 h-4" /> Create Assignment
              </button>
            </div>


              <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                    <div key={day} className="space-y-4">
                      <div className="bg-slate-900 text-white p-4 rounded-2xl text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest">{day}</span>
                      </div>

                      <Droppable droppableId={day}>
                        {(provided, snapshot) => (
                          <div 
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`space-y-4 min-h-[500px] rounded-3xl transition-colors ${snapshot.isDraggingOver ? "bg-blue-50/50 ring-2 ring-blue-200 ring-dashed" : ""}`}
                          >
                            {data.timetable && data.timetable.length > 0 ? data.timetable.filter(entry => entry.day === day)
                              .map((entry, index) => (
                                <Draggable key={entry._id} draggableId={entry._id} index={index}>
                                  {(provided, snapshot) => {
                                    const isConflicting = hasTimeConflict(entry, data.timetable);
                                    return (
                                      <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className={`group relative transition-all duration-300 w-full ${
                                            snapshot.isDragging ? "z-50" : "z-0"
                                          }`}
                                        >
                                          <div
                                            className={`relative overflow-hidden p-5 rounded-[2rem] border transition-all duration-300 shadow-sm
                                              ${snapshot.isDragging ? "scale-105 rotate-2 shadow-2xl bg-white/90 backdrop-blur-md border-blue-400" : "bg-white border-slate-100 hover:shadow-xl hover:-translate-y-1"}
                                              ${isConflicting ? "bg-red-50/50 border-red-100 ring-1 ring-red-200" : "hover:border-blue-100"}
                                            `}
                                          >
                                            {/* --- DECORATIVE ACCENT LINE --- */}
                                            <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${isConflicting ? 'bg-red-500' : 'bg-blue-600'}`} />

                                            {/* --- ACTION OVERLAY (Visible on Hover) --- */}
                                            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                              <button 
                                                onClick={(e) => { e.stopPropagation(); openEditAssignmentModal(entry); }}
                                                className="p-2 bg-white/80 backdrop-blur-md shadow-sm border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 hover:scale-110 transition-all"
                                              >
                                                <Edit2 className="w-3.5 h-3.5" />
                                              </button>
                                              <button 
                                                onClick={(e) => { e.stopPropagation(); handleDeleteAssignment(entry._id); }}
                                                className="p-2 bg-white/80 backdrop-blur-md shadow-sm border border-slate-100 rounded-xl text-slate-400 hover:text-red-600 hover:scale-110 transition-all"
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                            </div>

                                            {/* --- CARD CONTENT --- */}
                                            <div className="pl-2">
                                              <div className="flex flex-col gap-1 mb-4">
                                                <span className={`w-fit px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider
                                                  ${isConflicting ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                                  {entry.subject}
                                                </span>
                                                <h4 className="font-black text-slate-900 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                                                  {entry.facultyName}
                                                </h4>
                                              </div>

                                              <div className="space-y-2">
                                                <div className="flex items-center gap-2.5 text-slate-500">
                                                  <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                                                    <MapPin className="w-3 h-3 text-slate-400 group-hover:text-blue-500" />
                                                  </div>
                                                  <p className="text-[10px] font-bold tracking-tight">
                                                    {entry.schoolName} <span className="text-slate-300 mx-1">•</span> {entry.grade}
                                                  </p>
                                                </div>

                                                <div className="flex items-center gap-2.5 text-slate-500">
                                                  <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                                                    <Clock className="w-3 h-3 text-slate-400 group-hover:text-blue-500" />
                                                  </div>
                                                  <p className="text-[10px] font-black tracking-tight text-slate-600">
                                                    {entry.startTime} <span className="text-slate-300 font-normal">—</span> {entry.endTime}
                                                  </p>
                                                </div>
                                              </div>

                                              {/* --- CONFLICT INDICATOR --- */}
                                              {isConflicting && (
                                                <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-red-100/50 rounded-xl border border-red-100 animate-pulse">
                                                  <AlertTriangle className="w-3 h-3 text-red-600" />
                                                  <span className="text-[9px] font-black text-red-600 uppercase">Overlap Detected</span>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                    )
                                  }}
                                </Draggable>
                              )) : (
                                <div className="h-24 flex items-center justify-center text-slate-400 italic text-sm">
                                   No assignments for {day}
                                 </div>
                              )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
                </div>
              </DragDropContext>
              
            </div>
        )}

        {activeTab === "Revenue & Billing" && (
          <div className="bg-white border border-slate-200 rounded-[3rem] p-10 overflow-hidden">
             <h3 className="font-black mb-8">Transaction Ledger</h3>
             <div className="space-y-2">
               {filteredData && filteredData.map((tx: any) => (
                 <div key={tx._id} className="flex items-center justify-between p-5 hover:bg-slate-50 rounded-2xl transition-colors">
                   <div className="flex items-center gap-4">
                     <div className={`p-3 rounded-xl ${tx.type === 'Inbound' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
                       {tx.type === 'Inbound' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                     </div>
                     <div><p className="font-bold text-sm text-slate-900">{tx.entity}</p></div>
                   </div>
                   <p className="font-black text-slate-900">${tx.amount.toLocaleString()}</p>
                 </div>
               ))}
             </div>
          </div>
        )}
      </main>

      {/* --- ADD MEMBER MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-10 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><UserPlus className="w-6 h-6" /></div>
                  <h2 className="text-2xl font-black">Add Faculty</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleAddFaculty} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Full Name</label>
                  <input required type="text" placeholder="Dr. Jane Smith" className="w-full mt-2 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-medium" 
                    value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Department</label>
                    <select className="w-full mt-2 p-4 bg-slate-50 border-none rounded-2xl text-sm font-medium outline-none"
                      value={newMember.dept} onChange={e => setNewMember({...newMember, dept: e.target.value})}>
                      <option>Marketing</option>
                      <option>Teaching</option>
                      <option>Administration</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Status</label>
                    <select className="w-full mt-2 p-4 bg-slate-50 border-none rounded-2xl text-sm font-medium outline-none"
                      value={newMember.status} onChange={e => setNewMember({...newMember, status: e.target.value})}>
                      <option>Active</option>
                      <option>Sabbatical</option>
                      <option>Research Leave</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Current Skill description</label>
                  <textarea required rows={3} placeholder="Describe the current project..." className="w-full mt-2 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-medium"
                    value={newMember.research} onChange={e => setNewMember({...newMember, research: e.target.value})} />
                </div>

                <button type="submit" disabled={isGenerating} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Confirm Registration
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSchoolModalOpen && (
          <SchoolModal
            isOpen={isSchoolModalOpen}
            onClose={() => setIsSchoolModalOpen(false)}
            onSubmit={handleSchoolSubmit}
            formData={schoolForm}
            setFormData={setSchoolForm}
            isEditing={isEditing}
            isGenerating={isGenerating}
          />
        )}
      </AnimatePresence>


      {/* --- ADD MEMBER MODAL --- */}
      <AnimatePresence>
        {selectedSchool && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="space-y-6 bg-white border border-slate-200 rounded-[2.5rem] p-10">
              <button onClick={() => setSelectedSchool(null)} className="text-sm font-bold text-blue-600 mb-4 flex items-center gap-2">
                ← Back to Schools
              </button>
              
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black">{selectedSchool.name}</h2>
                  <p className="text-slate-400 font-bold">Student Directory / Class Management</p>
                </div>
                <button 
                  onClick={() => setIsStudentModalOpen(true)}
                  className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" /> Enroll Student
                </button>
              </div>

              {/* Grouping Logic */}
              {["Grade 9", "Grade 10", "Grade 11", "Grade 12"].map((grade) => (
                <div key={grade} className="bg-white border border-slate-100 rounded-[2.5rem] p-8">
                  <h3 className="text-lg font-black mb-6 flex items-center gap-3">
                    <div className="w-2 h-6 bg-blue-600 rounded-full" /> {grade}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.students ? data.students?.filter(s => s.grade.toLowerCase() === grade.toLowerCase())
                      .map(student => (
                        <div key={student._id} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-slate-400">
                              {student.name.charAt(0)}
                            </div>
                            <span className="font-bold text-sm">{student.name}</span>
                          </div>
                          <button className="opacity-0 group-hover:opacity-100 p-2 text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )) : (
                        <div className="col-span-full py-10 text-center text-slate-400 italic">
                          No students enrolled in {grade}
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isStudentModalOpen && selectedSchool && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <StudentEnrollmentModal
              isOpen={isStudentModalOpen}
              onClose={() => setIsStudentModalOpen(false)}
              onSubmit={handleEnrollStudent}
              studentData={studentForm}
              setStudentData={setStudentForm}
              schoolName={selectedSchool.name}
              isGenerating={isGenerating}
            />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(
          isAssignmentModalOpen && (
            <CreateAssignmentModal
              isOpen={isAssignmentModalOpen}
              onClose={() => setIsAssignmentModalOpen(false)}
              onSubmit={handleCreateAssignment} // Implement schedule creation logic as needed
              scheduleData={selectedAssignment || { subject: "", facultyId: "", schoolId: "", grade: "", day: "Monday", startTime: "", endTime: "" }}
              setScheduleData={setSelectedAssignment} // Implement state management for schedule form
              facultyList={data.faculty}
              schoolList={data.schools}
              isGenerating={isGenerating}
              />
          )
        )}
      </AnimatePresence>
    </div>
  );
}