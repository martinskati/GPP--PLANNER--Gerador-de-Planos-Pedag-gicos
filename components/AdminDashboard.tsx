
import React, { useMemo } from 'react';
import { storageService } from '../services/storageService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  Users, FileText, TrendingUp, Clock, ArrowLeft, 
  Download, Filter, LayoutDashboard, MessageSquare 
} from 'lucide-react';

interface AdminDashboardProps {
  onBack: () => void;
}

const COLORS = ['#065f46', '#059669', '#10b981', '#34d399', '#6ee7b7'];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const logs = storageService.getUsageLogs();
  const feedbacks = storageService.getFeedbacks();

  const stats = useMemo(() => {
    const totalPlans = logs.reduce((acc, log) => acc + log.plansCount, 0);
    const uniqueUsers = new Set(logs.map(log => log.teacherName)).size;
    
    // Agrupar por dia
    const dailyUsage: Record<string, number> = {};
    logs.forEach(log => {
      const date = new Date(log.timestamp).toLocaleDateString();
      dailyUsage[date] = (dailyUsage[date] || 0) + 1;
    });
    
    const chartData = Object.entries(dailyUsage).map(([date, count]) => ({ date, count })).reverse();

    // Temas mais comuns
    const themeCounts: Record<string, number> = {};
    logs.forEach(log => {
      log.themes.forEach((theme: string) => {
        themeCounts[theme] = (themeCounts[theme] || 0) + 1;
      });
    });
    
    const topThemes = Object.entries(themeCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return {
      totalPlans,
      uniqueUsers,
      totalRequests: logs.length,
      chartData,
      topThemes,
      totalFeedbacks: feedbacks.length
    };
  }, [logs, feedbacks]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white rounded-full border border-transparent hover:border-slate-200 transition-all text-slate-500 hover:text-emerald-800"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <LayoutDashboard className="w-6 h-6 text-emerald-800" />
                Painel Administrativo
              </h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Monitoramento e Gestão da Plataforma</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Download className="w-4 h-4" /> Exportar Relatório
            </button>
            <button className="flex items-center gap-2 bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-900 transition-all shadow-lg">
              <Filter className="w-4 h-4" /> Filtrar Período
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Usuários Ativos", value: stats.uniqueUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Planos Gerados", value: stats.totalPlans, icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Requisições IA", value: stats.totalRequests, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Feedbacks", value: stats.totalFeedbacks, icon: MessageSquare, color: "text-rose-600", bg: "bg-rose-50" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`${stat.bg} p-4 rounded-2xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Usage Trend */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-800" />
                Frequência de Uso
              </h3>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" fontSize={10} fontWeight="bold" stroke="#94a3b8" />
                  <YAxis fontSize={10} fontWeight="bold" stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#065f46" strokeWidth={3} dot={{ r: 4, fill: '#065f46' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Themes */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-800" />
                Temas mais Solicitados
              </h3>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.topThemes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.topThemes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Atividade Recente</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data/Hora</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Professor</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Prompt</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Planos</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice(0, 10).map((log) => (
                  <tr key={log.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-xs font-bold text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-4 text-xs font-black text-slate-900">{log.teacherName}</td>
                    <td className="p-4 text-xs font-medium text-slate-600 max-w-xs truncate">{log.prompt}</td>
                    <td className="p-4">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-1 rounded-full">
                        {log.plansCount} Planos
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
