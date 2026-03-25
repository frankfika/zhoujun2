import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Box, 
  TrendingUp, 
  Leaf, 
  Cpu, 
  Settings, 
  ChevronRight,
  Activity,
  Zap,
  BarChart3,
  AlertCircle,
  BrainCircuit,
  Factory
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { getIndustrialInsights } from './services/geminiService';
import { 
  ArrowRight, 
  AlertCircle, 
  Flame, 
  TrendingDown,
  Factory,
  Zap,
  Search,
  Activity,
  Cpu,
  ShieldAlert,
  BarChart3
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  Zap, 
  Eye, 
  Database, 
  ArrowUp, 
  ArrowDown, 
  Activity, 
  Layers, 
  Settings, 
  ShieldCheck,
  ChevronRight,
  Maximize2,
  Box,
  Network
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  Settings, 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  AlertCircle, 
  ChevronRight, 
  BarChart3, 
  Zap,
  History,
  ArrowDownToLine,
  Activity
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { RollingData, Recommendation, HistoricalRecord } from './types';
import { getRollingRecommendation } from './services/geminiService';
import { 
  Thermometer, 
  Activity, 
  Navigation, 
  Zap, 
  Database, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Gauge, 
  Flame, 
  Cpu, 
  Layers
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  AreaChart,
  Area
} from 'recharts';
import { 
  Zap, 
  Activity, 
  Wind, 
  Database, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  Cpu,
  Layers,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  ArrowRight, 
  DollarSign,
  Clock,
  Factory
} from 'lucide-react';

// [0] 君昌智·数字孪生
// --- Mock Data ---
const PRODUCTION_DATA = [
  { name: '08:00', output: 420, energy: 85, carbon: 12 },
  { name: '10:00', output: 450, energy: 88, carbon: 13 },
  { name: '12:00', output: 380, energy: 75, carbon: 11 },
  { name: '14:00', output: 510, energy: 95, carbon: 15 },
  { name: '16:00', output: 490, energy: 92, carbon: 14 },
  { name: '18:00', output: 460, energy: 87, carbon: 13 },
  { name: '20:00', output: 430, energy: 82, carbon: 12 },
];

const ROI_MODEL = [
  { month: 0, cost: -5000, profit: 0 },
  { month: 3, cost: -4200, profit: 800 },
  { month: 6, cost: -3000, profit: 2000 },
  { month: 9, cost: -1500, profit: 3500 },
  { month: 12, cost: -200, profit: 4800 },
  { month: 14, cost: 500, profit: 5500 }, // Breakeven
  { month: 18, cost: 2500, profit: 7500 },
];

const ESG_DISTRIBUTION = [
  { name: '再生材料', value: 65, color: '#10b981' },
  { name: '原矿', value: 35, color: '#3f3f46' },
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
      active 
        ? "bg-industrial-accent/10 text-industrial-accent border border-industrial-accent/20" 
        : "text-industrial-muted hover:text-industrial-text hover:bg-white/5"
    )}
  >
    <Icon size={20} className={cn("transition-transform group-hover:scale-110", active && "text-industrial-accent")} />
    <span className="font-medium text-sm">{label}</span>
    {active && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-industrial-accent" />}
  </button>
);

const StatCard = ({ title, value, unit, trend, icon: Icon, color = "accent" }: any) => (
  <div className="glass-panel p-5 flex flex-col gap-2">
    <div className="flex justify-between items-start">
      <div className={cn("p-2 rounded-lg bg-opacity-10", `bg-${color}`)}>
        <Icon className={cn(`text-${color}`)} size={20} />
      </div>
      {trend && (
        <span className={cn("text-xs font-mono", trend > 0 ? "text-emerald-400" : "text-rose-400")}>
          {trend > 0 ? "+" : ""}{trend}%
        </span>
      )}
    </div>
    <div className="mt-2">
      <p className="text-xs text-industrial-muted uppercase tracking-wider font-semibold">{title}</p>
      <div className="flex items-baseline gap-1">
        <h3 className="text-2xl stat-value">{value}</h3>
        <span className="text-xs text-industrial-muted font-mono">{unit}</span>
      </div>
    </div>
  </div>
);

function App0() {
  const [activeTab, setActiveTab] = useState('overview');
  const [aiInsights, setAiInsights] = useState<string>('正在分析系统数据...');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      const insights = await getIndustrialInsights({
        production: PRODUCTION_DATA[PRODUCTION_DATA.length - 1],
        roi: ROI_MODEL[ROI_MODEL.length - 1],
        esg: ESG_DISTRIBUTION
      });
      setAiInsights(insights || "暂无可用建议。");
    };
    fetchInsights();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-industrial-bg text-industrial-text">
      {/* Sidebar */}
      <aside className={cn(
        "border-r border-industrial-border bg-industrial-card transition-all duration-300 flex flex-col",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center gap-3 border-b border-industrial-border">
          <div className="w-8 h-8 bg-industrial-accent rounded flex items-center justify-center shrink-0">
            <Factory className="text-black" size={20} />
          </div>
          {isSidebarOpen && (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="font-bold text-sm tracking-tight">君昌智科技</h1>
              <p className="text-[10px] text-industrial-muted uppercase tracking-widest">数字孪生 v2.4</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="全景概览" 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')} 
          />
          <SidebarItem 
            icon={Box} 
            label="数字孪生" 
            active={activeTab === 'twin'} 
            onClick={() => setActiveTab('twin')} 
          />
          <SidebarItem 
            icon={TrendingUp} 
            label="极致算账" 
            active={activeTab === 'finance'} 
            onClick={() => setActiveTab('finance')} 
          />
          <SidebarItem 
            icon={Leaf} 
            label="ESG 绿色指标" 
            active={activeTab === 'esg'} 
            onClick={() => setActiveTab('esg')} 
          />
          <SidebarItem 
            icon={BrainCircuit} 
            label="智能锻造" 
            active={activeTab === 'ai'} 
            onClick={() => setActiveTab('ai')} 
          />
        </nav>

        <div className="p-4 border-t border-industrial-border">
          <SidebarItem icon={Settings} label="系统设置" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-industrial-border flex items-center justify-between px-8 bg-industrial-card/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold tracking-tight">
              {activeTab === 'overview' && "15万吨级不锈钢全产业链绿色工艺系统"}
              {activeTab === 'twin' && "实时数字孪生监控"}
              {activeTab === 'finance' && "14个月极速回本模型分析"}
              {activeTab === 'esg' && "碳足迹与能源效率追踪"}
              {activeTab === 'ai' && "AI 智能工艺优化建议"}
            </h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-wider">系统在线</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-industrial-muted uppercase font-bold tracking-widest">当前班次</span>
              <span className="text-xs font-mono">B区 / 08:00 - 20:00</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-industrial-border flex items-center justify-center border border-white/5">
              <Activity size={18} className="text-industrial-accent" />
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Top Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard title="实时产能" value="492.5" unit="T/H" trend={12.4} icon={Zap} />
                  <StatCard title="综合能耗" value="1,240" unit="kWh/T" trend={-4.2} icon={Activity} color="emerald-400" />
                  <StatCard title="碳排放强度" value="0.85" unit="tCO2e/T" trend={-8.1} icon={Leaf} color="emerald-400" />
                  <StatCard title="累计收益" value="¥14.2M" unit="CNY" trend={15.2} icon={TrendingUp} color="blue-400" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Chart */}
                  <div className="lg:col-span-2 glass-panel p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider">生产效率趋势</h3>
                        <p className="text-xs text-industrial-muted">过去 12 小时实时输出与能耗对比</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm bg-industrial-accent" />
                          <span className="text-[10px] font-mono uppercase">产量</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm bg-blue-400" />
                          <span className="text-[10px] font-mono uppercase">能耗</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={PRODUCTION_DATA}>
                          <defs>
                            <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                          <XAxis 
                            dataKey="name" 
                            stroke="#71717a" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                          />
                          <YAxis 
                            stroke="#71717a" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#141417', border: '1px solid #27272a', borderRadius: '8px' }}
                            itemStyle={{ fontSize: '12px' }}
                          />
                          <Area type="monotone" dataKey="output" stroke="#10b981" fillOpacity={1} fill="url(#colorOutput)" strokeWidth={2} />
                          <Area type="monotone" dataKey="energy" stroke="#60a5fa" fillOpacity={1} fill="url(#colorEnergy)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* AI Insights Panel */}
                  <div className="glass-panel p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                      <BrainCircuit className="text-industrial-accent" size={20} />
                      <h3 className="text-sm font-bold uppercase tracking-wider">君昌智 AI 决策建议</h3>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="p-4 bg-white/5 rounded-lg border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-industrial-accent" />
                        <p className="text-xs leading-relaxed text-industrial-text/90 whitespace-pre-line">
                          {aiInsights}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">
                          <p className="text-[10px] text-industrial-muted uppercase font-bold">优化潜力</p>
                          <p className="text-lg font-mono text-emerald-400">+18.5%</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">
                          <p className="text-[10px] text-industrial-muted uppercase font-bold">风险等级</p>
                          <p className="text-lg font-mono text-blue-400">低</p>
                        </div>
                      </div>
                    </div>
                    <button className="mt-6 w-full py-3 bg-industrial-accent text-black font-bold rounded-lg text-xs uppercase tracking-widest hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2">
                      执行工艺优化策略
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* ROI Breakeven Chart */}
                  <div className="glass-panel p-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-6">14个月回本模型 (15万吨基准)</h3>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ROI_MODEL}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                          <XAxis dataKey="month" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#141417', border: '1px solid #27272a', borderRadius: '8px' }}
                          />
                          <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                            {ROI_MODEL.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.cost >= 0 ? '#10b981' : '#f43f5e'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="mt-4 text-[10px] text-industrial-muted text-center uppercase tracking-widest">
                      当前进度: 第 9 个月 / 预计回本剩余: 5 个月
                    </p>
                  </div>

                  {/* ESG Pie */}
                  <div className="glass-panel p-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-6">绿色原料占比 (ESG)</h3>
                    <div className="h-[200px] w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={ESG_DISTRIBUTION}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {ESG_DISTRIBUTION.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-mono font-bold">65%</span>
                        <span className="text-[10px] text-industrial-muted uppercase">再生</span>
                      </div>
                    </div>
                  </div>

                  {/* System Health */}
                  <div className="glass-panel p-6 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-2">核心设备状态</h3>
                    {[
                      { name: "电弧炉 A1", status: "运行中", health: 98, load: 85 },
                      { name: "精炼炉 B2", status: "运行中", health: 94, load: 72 },
                      { name: "连铸机 C1", status: "警告", health: 76, load: 90 },
                    ].map((device, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium">{device.name}</span>
                          <span className={cn("font-mono", device.health < 80 ? "text-rose-400" : "text-emerald-400")}>
                            {device.health}% 健康度
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${device.load}%` }}
                            className={cn("h-full", device.health < 80 ? "bg-rose-500" : "bg-industrial-accent")} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'twin' && (
              <motion.div 
                key="twin"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col gap-6"
              >
                <div className="flex-1 glass-panel relative overflow-hidden flex items-center justify-center bg-black/40 border-dashed border-2 border-industrial-border">
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#27272a 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                  </div>
                  
                  <div className="relative z-10 text-center space-y-6">
                    <div className="w-64 h-64 mx-auto border-4 border-industrial-accent/20 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                       <div className="w-48 h-48 border-4 border-blue-400/20 rounded-full flex items-center justify-center animate-[spin_6s_linear_infinite_reverse]">
                          <Box size={80} className="text-industrial-accent animate-pulse" />
                       </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold uppercase tracking-widest">数字孪生已激活</h3>
                      <p className="text-industrial-muted text-sm">3D 实时渲染引擎已就绪，正在同步 1,420 个传感器节点</p>
                    </div>
                    <div className="flex justify-center gap-4">
                      <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                        切换视角
                      </button>
                      <button className="px-6 py-2 bg-industrial-accent text-black rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-emerald-400 transition-all">
                        进入交互模式
                      </button>
                    </div>
                  </div>

                  {/* Floating Data Nodes */}
                  <div className="absolute top-10 left-10 p-4 glass-panel bg-black/60 backdrop-blur-xl border-industrial-accent/30">
                    <p className="text-[10px] text-industrial-muted uppercase font-bold mb-2">节点: 熔炼炉_01</p>
                    <div className="space-y-1">
                      <div className="flex justify-between gap-8 text-xs font-mono">
                        <span>温度:</span>
                        <span className="text-rose-400">1,642°C</span>
                      </div>
                      <div className="flex justify-between gap-8 text-xs font-mono">
                        <span>压力:</span>
                        <span className="text-emerald-400">1.2 MPa</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-10 right-10 p-4 glass-panel bg-black/60 backdrop-blur-xl border-blue-400/30">
                    <p className="text-[10px] text-industrial-muted uppercase font-bold mb-2">节点: 冷却线_04</p>
                    <div className="space-y-1">
                      <div className="flex justify-between gap-8 text-xs font-mono">
                        <span>流量:</span>
                        <span className="text-blue-400">420 L/min</span>
                      </div>
                      <div className="flex justify-between gap-8 text-xs font-mono">
                        <span>振动:</span>
                        <span className="text-emerald-400">0.02 mm/s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Placeholder for other tabs */}
            {['finance', 'esg', 'ai'].includes(activeTab) && (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center glass-panel"
              >
                <div className="text-center space-y-4">
                  <AlertCircle size={48} className="mx-auto text-industrial-muted" />
                  <h3 className="text-xl font-bold uppercase tracking-widest">模块正在加载</h3>
                  <p className="text-industrial-muted">该功能模块正在与 15万吨级基准数据库进行深度同步...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}

// [1] 生产诊断看板
const STAGES = [
  {
    id: 'rolling',
    title: '冷轧段',
    subtitle: '常温冷轧段',
    icon: <Factory className="w-6 h-6" />,
    painPoint: '工艺盲区化',
    details: '压下道次稳定性不足，版型与厚度头尾波动大，高度依赖人工经验微调，前端良率难以收敛。',
    highlight: null,
    color: 'text-blue-400',
    glow: 'shadow-blue-500/20'
  },
  {
    id: 'entry',
    title: '入炉接带段',
    subtitle: '衔接：入炉接带段',
    icon: <Zap className="w-6 h-6" />,
    painPoint: '降速引发灾难性“热冲击”',
    details: '接带效率低下导致产线被迫大幅降速或停机等待。中间段钢带在 1080℃ 炉膛内停留超时，引发双重失效：表面过度氧化（黑带、色差）与过度软化（重启拉拽极易产生物理变形及断带）。',
    highlight: '变形发黄',
    color: 'text-amber-400',
    glow: 'shadow-amber-500/20'
  },
  {
    id: 'furnace',
    title: '退火炉膛段',
    subtitle: '核心：退火炉膛段',
    icon: <Flame className="w-6 h-6" />,
    painPoint: '能源辅材“刚性高企”',
    details: '炉内天然气均耗高达 29立方/吨（大幅偏离 25立方的行业极值）；同时，采用液氨分解制氢作为保护气，叠加无效燃烧，成本每天都在“流血”。',
    highlight: '29立方/吨',
    color: 'text-red-400',
    glow: 'shadow-red-500/20'
  },
  {
    id: 'inspection',
    title: '下线质检段',
    subtitle: '终点：下线质检段',
    icon: <Search className="w-6 h-6" />,
    painPoint: '滞后引发“库存资金黑洞”',
    details: '产线末端缺乏在线无损感知。传统破坏性剪样送检流程长达 24-28小时。材料损耗叠加巨量待检成品滞留仓库，严重拖延交付，极大恶化企业流动资金周转率，甚至面临混料流出的退货索赔。',
    highlight: '24小时死库存',
    color: 'text-cyan-400',
    glow: 'shadow-cyan-500/20'
  }
];

function App1() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      {/* Background Tech Grid */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-blue-900/10 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-12 border-b border-white/5">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400">系统诊断核心</span>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-blue-400"
            >
              全景诊断 —— 顺延产线链路的四大“利润漏斗”
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 max-w-2xl text-xl font-light leading-relaxed"
            >
              深度剖析钢铁生产全流程中的效率瓶颈与成本流失点，识别核心利润增长机会。
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <Activity className="w-8 h-8 text-cyan-400 animate-pulse" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">实时运行状态</div>
              <div className="text-sm font-mono text-cyan-400">正在分析生产流_V2.4</div>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: Visual Timeline */}
        <div className="lg:col-span-4 space-y-12">
          <div className="sticky top-12">
            <div className="flex items-center gap-3 mb-10">
              <Cpu className="w-4 h-4 text-blue-500" />
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">生产链路拓扑结构</h2>
            </div>
            
            <div className="relative">
              {/* Vertical Line with Gradient */}
              <div className="absolute left-7 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-600 via-cyan-400 to-transparent opacity-30" />
              
              <div className="space-y-16">
                {STAGES.map((stage, index) => (
                  <motion.div 
                    key={stage.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="relative flex items-center gap-8 group"
                  >
                    <div className={`z-10 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border backdrop-blur-xl ${
                      index === 0 
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                      : 'bg-white/5 border-white/10 text-slate-500 group-hover:border-blue-400 group-hover:text-blue-400 group-hover:bg-blue-400/10'
                    }`}>
                      {stage.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-white group-hover:text-blue-400 transition-colors">{stage.title}</h3>
                      <p className="text-[10px] text-slate-500 font-mono tracking-widest mt-1">生产节点_0{index + 1}</p>
                    </div>
                    {index < STAGES.length - 1 && (
                      <div className="absolute left-7 top-14 h-16 flex items-center justify-center">
                        <div className="w-px h-full bg-gradient-to-b from-blue-500/50 to-transparent" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Summary Stats - Tech Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-20 p-8 rounded-[2rem] bg-gradient-to-br from-slate-900 to-blue-950 border border-white/10 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BarChart3 className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-red-400">核心损耗预警</span>
                </div>
                <div className="space-y-8">
                  <div className="group/stat">
                    <div className="text-4xl font-black text-white mb-1 group-hover/stat:text-red-400 transition-colors">29 m³/t</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">天然气均耗 (标准上限: 25)</div>
                    <div className="mt-2 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        transition={{ delay: 1, duration: 1.5 }}
                        className="h-full bg-red-500" 
                      />
                    </div>
                  </div>
                  <div className="group/stat">
                    <div className="text-4xl font-black text-white mb-1 group-hover/stat:text-red-400 transition-colors">24-28 h</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">质检滞后周期</div>
                    <div className="mt-2 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '95%' }}
                        transition={{ delay: 1.2, duration: 1.5 }}
                        className="h-full bg-red-500" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right: Detailed Pain Points */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center gap-3 mb-10">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">核心脆弱性分析</h2>
          </div>
          
          {STAGES.map((stage, index) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              className="relative bg-white/5 border border-white/10 rounded-[2.5rem] p-10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 group overflow-hidden"
            >
              {/* Decorative Glow */}
              <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${stage.id === 'furnace' ? 'bg-red-500' : 'bg-blue-500'}`} />

              <div className="flex flex-col md:flex-row md:items-start gap-10 relative z-10">
                <div className={`flex-shrink-0 w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:border-blue-400/50 ${stage.color}`}>
                  {stage.icon}
                </div>
                <div className="flex-grow">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                      {stage.subtitle}
                    </span>
                    {stage.highlight && (
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20 animate-pulse">
                        {stage.highlight}
                      </span>
                    )}
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    {stage.painPoint}
                    <AlertCircle className="w-6 h-6 text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0" />
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-xl font-light">
                    {stage.details.split('：').map((part, i) => (
                      <React.Fragment key={i}>
                        {i === 0 ? <span className="font-bold text-slate-200">{part}：</span> : part}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer Decoration */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/5 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">D</div>
            <div>
              <div className="text-lg font-bold text-white tracking-tight">诊断核心 <span className="text-blue-500">v1.0</span></div>
              <div className="text-xs text-slate-500 font-mono uppercase tracking-widest mt-1">工业智能协议</div>
            </div>
          </div>
          <div className="flex gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
            <span className="hover:text-cyan-400 cursor-pointer transition-colors">效率同步</span>
            <span className="hover:text-cyan-400 cursor-pointer transition-colors">质量审计</span>
            <span className="hover:text-cyan-400 cursor-pointer transition-colors">利润最大化</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// [2] 智控系统架构
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ArchitectureLayerProps {
  title: string;
  subtitle: string;
  items: string[];
  icon: any;
  color: string;
  isActive: boolean;
  onClick: () => void;
  index: number;
}

const ArchitectureLayer: React.FC<ArchitectureLayerProps> = ({ 
  title, 
  subtitle, 
  items, 
  icon: Icon, 
  color, 
  isActive, 
  onClick,
  index
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isActive ? 1.02 : 1,
      }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={onClick}
      className={cn(
        "relative w-full p-6 rounded-xl cursor-pointer transition-all duration-300",
        "border border-scg-border group overflow-hidden",
        isActive ? "bg-scg-accent/5 border-scg-accent shadow-[0_0_30px_rgba(0,242,255,0.1)]" : "bg-slate-900/40 hover:bg-slate-800/60"
      )}
      style={{ 
        boxShadow: isActive ? `0 0 40px ${color}11` : 'none'
      }}
    >
      {/* Decorative Corner */}
      <div className={cn(
        "absolute top-0 right-0 w-8 h-8 transition-opacity duration-300",
        isActive ? "opacity-100" : "opacity-0"
      )}>
        <div className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-scg-accent/40" />
      </div>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={cn("p-3 rounded-lg", isActive ? "bg-scg-accent text-black" : "bg-white/10 text-white")}>
            <Icon size={24} />
          </div>
          <div>
            <h3 className={cn("text-xl font-bold tracking-tight", isActive ? "text-scg-accent" : "text-white")}>
              {title}
            </h3>
            <p className="text-sm text-white/50 font-mono mt-1">{subtitle}</p>
          </div>
        </div>
        <div className={cn("text-[10px] font-mono px-2 py-1 rounded border", isActive ? "border-scg-accent text-scg-accent" : "border-white/20 text-white/40")}>
          LAYER_0{3 - index}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-white/70">
            <div className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-scg-accent" : "bg-white/30")} />
            {item}
          </div>
        ))}
      </div>

      {/* Connection Lines */}
      {index < 2 && (
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50">
          <ArrowDown size={16} className="text-scg-accent animate-bounce" />
        </div>
      )}
    </motion.div>
  );
};

const ProductionLineFlow = () => {
  const stages = [
    { id: 'weld', label: '极速激光拼焊', icon: Zap, color: 'text-blue-400', detail: '停机压缩至极值' },
    { id: 'temp', label: '温控冗余感知', icon: Activity, color: 'text-scg-accent', detail: '3点冗余/氢气探头' },
    { id: 'libs', label: 'LIBS元素快筛', icon: Eye, color: 'text-yellow-400', detail: '打穿化验黑洞' },
    { id: 'brain', label: '大脑全盘接管', icon: Cpu, color: 'text-emerald-400', detail: '杜绝发黄变形' },
  ];

  return (
    <div className="scg-glass p-8 rounded-2xl border-scg-border relative overflow-hidden mb-12">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold flex items-center gap-2 text-white">
          <Activity size={18} className="text-scg-accent animate-pulse" />
          实时产线动态仿真 (Digital Twin)
        </h3>
        <div className="flex items-center gap-4 text-[10px] font-mono text-white/30">
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-scg-accent animate-ping" /> SENSOR_ACTIVE</span>
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> PLC_CONNECTED</span>
        </div>
      </div>

      <div className="relative flex items-center justify-between px-4 py-12">
        {/* Connecting Line */}
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-scg-border to-transparent top-1/2 -translate-y-1/2" />
        
        {/* Animated Pulses */}
        <motion.div 
          animate={{ x: ['0%', '100%'], opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -translate-y-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-scg-accent to-transparent z-0"
        />

        {stages.map((stage, idx) => (
          <div key={stage.id} className="relative z-10 flex flex-col items-center gap-4 group">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className={cn(
                "w-14 h-14 rounded-xl border border-scg-border bg-slate-900/80 flex items-center justify-center transition-all duration-300",
                "group-hover:border-scg-accent group-hover:shadow-[0_0_20px_rgba(0,242,255,0.2)]"
              )}
            >
              <stage.icon size={24} className={stage.color} />
              
              {/* Scanning Effect */}
              <motion.div 
                animate={{ top: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-b from-transparent via-scg-accent/10 to-transparent pointer-events-none"
              />
            </motion.div>
            
            <div className="text-center">
              <div className="text-[10px] font-mono text-white/40 uppercase mb-1">Stage 0{idx + 1}</div>
              <div className="text-xs font-bold text-white/80">{stage.label}</div>
              <div className="text-[9px] text-scg-accent/60 mt-1 font-medium">{stage.detail}</div>
            </div>

            {/* Data Uplink Animation */}
            <motion.div 
              animate={{ y: [0, -20], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.4 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
            >
              <div className="w-px h-6 bg-gradient-to-t from-scg-accent to-transparent" />
              <span className="text-[8px] font-mono text-scg-accent">DATA_UP</span>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Bottom Status Bar */}
      <div className="mt-6 pt-4 border-t border-scg-border grid grid-cols-4 gap-4">
        {['TEMP: 24.5°C', 'LOAD: 82%', 'OEE: 94.2%', 'CYCLE: 12s'].map((stat, i) => (
          <div key={i} className="text-[9px] font-mono text-white/30 flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-scg-accent/50" />
            {stat}
          </div>
        ))}
      </div>
    </div>
  );
};

function App2() {
  const [activeLayer, setActiveLayer] = useState<number | null>(0);

  const layers = [
    {
      title: "控制层：SCG 孪生大脑",
      subtitle: "算力接管 · 核心控盘",
      icon: Cpu,
      color: "#00f2ff",
      items: [
        "SCG 算法中枢全盘接管底层 PLC",
        "非线性动态调节（前馈掐火/拉升补热）",
        "越过人工经验，杜绝发黄变形"
      ],
      description: "大脑根据预测降速信号，越过人工经验，全盘接管底层 PLC，实现比例电磁阀的非线性动态调节，彻底杜绝发黄变形。"
    },
    {
      title: "执行层：微秒级物理反控",
      subtitle: "指令下达 · 衔接突围",
      icon: Zap,
      color: "#3b82f6",
      items: [
        "调度高频极速激光拼焊机",
        "压缩接带停机时间至绝对极值",
        "从源头切断“热冲击”"
      ],
      description: "调度高频极速激光拼焊机，把接带停机时间压缩至绝对极值，从源头切断“热冲击”，将孤立的物理节点重塑为高效率的智能网络。"
    },
    {
      title: "感知层：全域毫秒级感知",
      subtitle: "数据上行 · 极值捕捉",
      icon: Eye,
      color: "#00f2ff",
      items: [
        "30万级轻量化 LIBS 元素快筛",
        "电磁涡流（硬度无损检测）",
        "关键温区 3 点冗余热电偶",
        "氢气露点高频探头"
      ],
      description: "通过 LIBS 与电磁涡流技术打穿 24 小时化验黑洞。配合冗余热电偶与氢气探头，提供高信噪比底层环境数据，直通 SCG 大屏。"
    }
  ];

  return (
    <div className="min-h-screen scg-grid relative overflow-hidden selection:bg-scg-accent selection:text-black">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-scg-accent/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-scg-secondary/5 blur-[120px] rounded-full" />
        <div className="scanline absolute inset-0 pointer-events-none opacity-20" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-8 border-b border-scg-border bg-scg-bg/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-scg-accent font-mono text-xs tracking-widest uppercase">
              <Layers size={14} />
              SCG_CORE_INFRASTRUCTURE_V2
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
              破局架构 —— <span className="text-transparent bg-clip-text bg-gradient-to-r from-scg-accent to-scg-secondary">SCG 孪生大脑的“全域接管矩阵”</span>
            </h1>
            <p className="text-white/40 max-w-2xl text-sm font-medium">
              软硬解耦，算力接管。将孤立的物理节点重塑为高效率的智能网络。
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <div className="text-[10px] text-white/30 font-mono uppercase">System Status</div>
              <div className="text-scg-accent font-mono text-sm flex items-center gap-2 justify-end">
                <div className="w-2 h-2 bg-scg-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(0,242,255,0.8)]" />
                ACTIVE_LINK
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border border-scg-border flex items-center justify-center bg-white/5">
              <Settings className="text-white/40 animate-spin-slow" />
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-8 py-12 space-y-12">
        {/* Dynamic Production Line Flow */}
        <ProductionLineFlow />

        {/* Core Concept Section */}
        <section className="scg-glass p-8 rounded-2xl space-y-6 relative overflow-hidden border-scg-border">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ShieldCheck size={120} />
          </div>
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-scg-accent/40" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-scg-accent/40" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-scg-accent">
                <Activity size={24} />
                核心理念：软硬解耦，算力接管
              </h2>
              <p className="text-white/70 leading-relaxed">
                摒弃“重资产盲目堆砌硬件”的传统技改路径。依托君昌智 <span className="text-white font-bold">SCG 算法中枢</span>，链接苏州顶尖精密硬件生态，重塑智能网络。
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:justify-end">
              {["软硬解耦", "数据贯通", "数字孪生", "开放接口"].map((tag) => (
                <span key={tag} className="px-4 py-1.5 bg-scg-accent/5 border border-scg-accent/20 rounded-sm text-[10px] font-mono text-scg-accent/80 uppercase tracking-tighter">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Architecture Layers Vertical Stack */}
        <div className="space-y-6 relative">
          {/* Vertical Flow Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-scg-accent via-scg-secondary to-transparent opacity-20 hidden md:block" />

          <div className="grid grid-cols-1 gap-6 relative">
            {layers.map((layer, index) => (
              <ArchitectureLayer
                key={index}
                index={index}
                title={layer.title}
                subtitle={layer.subtitle}
                items={layer.items}
                icon={layer.icon}
                color={layer.color}
                isActive={activeLayer === index}
                onClick={() => setActiveLayer(index)}
              />
            ))}
          </div>
        </div>

        {/* Selected Layer Details */}
        <AnimatePresence mode="wait">
          {activeLayer !== null && (
            <motion.div
              key={activeLayer}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="scg-glass p-8 rounded-2xl border-l-4 border-l-scg-accent border-scg-border"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-scg-accent/10 rounded text-scg-accent shadow-[0_0_15px_rgba(0,242,255,0.2)]">
                  {React.createElement(layers[activeLayer].icon, { size: 20 })}
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">{layers[activeLayer].title}</h3>
              </div>
              <p className="text-white/70 leading-relaxed text-sm">
                {layers[activeLayer].description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Stats */}
      <footer className="relative z-10 max-w-7xl mx-auto px-8 py-6 border-t border-scg-border flex flex-wrap items-center justify-between gap-8 bg-scg-bg/60">
        <div className="flex items-center gap-8">
          {[
            { label: "Response Time", value: "< 1ms", color: "text-scg-accent" },
            { label: "Data Nodes", value: "1,240+", color: "text-scg-secondary" },
            { label: "Efficiency Gain", value: "+32%", color: "text-scg-accent" }
          ].map((stat) => (
            <div key={stat.label} className="group cursor-default">
              <div className="text-[10px] text-white/30 font-mono uppercase tracking-widest group-hover:text-scg-accent transition-colors">{stat.label}</div>
              <div className={cn("text-lg font-bold font-mono", stat.color)}>{stat.value}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 text-white/20 text-[10px] font-mono">
          <span className="hover:text-white/40 transition-colors">© 2026 JUNCHANGZHI TECH</span>
          <div className="w-1 h-1 bg-white/20 rounded-full" />
          <span className="hover:text-white/40 transition-colors">SCG_SYSTEM_V2.4.0</span>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .writing-vertical {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reverse-spin-slow {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-reverse-spin-slow {
          animation: reverse-spin-slow 12s linear infinite;
        }
      `}} />
    </div>
  );
}

// [3] 能源管理系统
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MOCK_HISTORY: HistoricalRecord[] = [
  { id: '1', timestamp: '2026-03-17 10:00', reduction: 1.2, tension: 450, thickness: 2.5, tolerance: 0.012 },
  { id: '2', timestamp: '2026-03-17 10:15', reduction: 1.1, tension: 460, thickness: 2.5, tolerance: 0.008 },
  { id: '3', timestamp: '2026-03-17 10:30', reduction: 1.3, tension: 440, thickness: 2.5, tolerance: 0.015 },
];

function App3() {
  const [formData, setFormData] = useState<RollingData>({
    reduction: 1.2,
    tension: 450,
    targetThickness: 2.5,
    materialType: 'SUS304'
  });
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [history] = useState<HistoricalRecord[]>(MOCK_HISTORY);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const result = await getRollingRecommendation(formData);
      setRecommendation(result);
    } catch (error) {
      console.error('获取建议失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen selection:bg-cyan-500/30">
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 neon-glow">
              <Cpu size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">SCG 冷轧工艺优化器</h1>
              <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-[0.2em]">AI Algorithm • Industrial 4.0</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 text-cyan-400 rounded-full text-[10px] font-bold border border-cyan-500/20 uppercase tracking-wider">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span>系统实时监控中</span>
            </div>
            <button className="p-2 text-slate-400 hover:text-cyan-400 transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <section className="glass-card rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-800 bg-slate-900/50">
                <h2 className="font-semibold flex items-center gap-2 text-cyan-400">
                  <Settings size={18} />
                  工艺参数输入
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">材质类型</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all appearance-none cursor-pointer"
                    value={formData.materialType}
                    onChange={(e) => setFormData({...formData, materialType: e.target.value})}
                  >
                    <option value="SUS201">201 不锈钢 (高硬度/高锰)</option>
                    <option value="SUS304">304 不锈钢 (标准/通用)</option>
                    <option value="SUS316">316 不锈钢 (高韧性/含钼)</option>
                    <option value="Q235B">Q235B 普碳钢 (对比参考)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">目标厚度 (mm)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.1"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all"
                      value={formData.targetThickness}
                      onChange={(e) => setFormData({...formData, targetThickness: parseFloat(e.target.value)})}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-600">MM</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">压下量 (mm)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all"
                      value={formData.reduction}
                      onChange={(e) => setFormData({...formData, reduction: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">张力 (kN)</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all"
                      value={formData.tension}
                      onChange={(e) => setFormData({...formData, tension: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                <button 
                  onClick={handleCalculate}
                  disabled={loading}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl py-3.5 font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-cyan-900/20"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Zap size={18} className="fill-current" />
                      生成 AI 优化建议
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Tech Info Card */}
            <section className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-6 border border-slate-800 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BarChart3 size={80} className="text-cyan-500" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="text-cyan-500" size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500/70">算法核心</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">动态补偿模型</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  基于历史轧制压下量、张力与最终厚度公差数据，利用 AI 建立动态补偿曲线，有效收敛头尾厚度波动。
                </p>
              </div>
            </section>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              {!recommendation && !loading ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl h-[450px] flex flex-col items-center justify-center text-slate-500 p-8 text-center border-dashed border-2 border-slate-800"
                >
                  <div className="w-20 h-20 bg-slate-950 rounded-full flex items-center justify-center mb-6 border border-slate-800 shadow-inner">
                    <Activity size={40} className="text-slate-700" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-400 mb-2">等待数据输入</h3>
                  <p className="max-w-xs text-xs leading-relaxed">请在左侧输入当前冷轧工艺参数，AI 将为您计算最优的动态补偿方案。</p>
                </motion.div>
              ) : loading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card rounded-2xl h-[450px] flex flex-col items-center justify-center p-8"
                >
                  <div className="relative w-28 h-28 mb-8">
                    <div className="absolute inset-0 border-4 border-cyan-500/10 rounded-full" />
                    <div className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Cpu size={40} className="text-cyan-500 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-cyan-500 font-bold text-sm tracking-widest animate-pulse">正在运行深度学习模型分析...</p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: '优化压下量', value: recommendation?.optimizedReduction, unit: 'mm', icon: ArrowDownToLine },
                      { label: '优化张力', value: recommendation?.optimizedTension, unit: 'kN', icon: Activity },
                      { label: '预测公差', value: `±${recommendation?.predictedTolerance}`, unit: 'mm', icon: ShieldCheck, highlight: true }
                    ].map((stat, i) => (
                      <div key={i} className="glass-card p-5 rounded-2xl relative overflow-hidden group">
                        <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">
                          <stat.icon size={60} />
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{stat.label}</p>
                        <div className="flex items-baseline gap-2">
                          <span className={cn("text-3xl font-black tracking-tighter", stat.highlight ? "text-cyan-400" : "text-white")}>
                            {stat.value}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">{stat.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chart Section */}
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="font-bold text-white flex items-center gap-2">
                          <BarChart3 size={18} className="text-cyan-500" />
                          动态补偿曲线
                        </h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">AI-Predicted Compensation Values</p>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-cyan-500 neon-glow" />
                          <span className="text-cyan-500">补偿值 (μm)</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-[320px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={recommendation?.compensationCurve}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                          <XAxis 
                            dataKey="point" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}}
                            label={{ value: '钢卷位置 (%)', position: 'insideBottom', offset: -10, fontSize: 10, fill: '#475569', fontWeight: 'bold' }}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                            itemStyle={{ color: '#22d3ee', fontSize: '12px', fontWeight: 'bold' }}
                            labelStyle={{ color: '#94a3b8', fontSize: '10px', marginBottom: '4px' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#22d3ee" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorValue)" 
                            animationDuration={1500}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center shrink-0">
                        <AlertCircle className="text-cyan-500" size={24} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-cyan-500 uppercase tracking-[0.2em] mb-2">AI 智能分析报告</h4>
                        <p className="text-sm text-slate-300 leading-relaxed font-medium">
                          {recommendation?.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* History Table */}
            <section className="glass-card rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/30">
                <h2 className="font-semibold flex items-center gap-2 text-slate-300">
                  <History className="text-slate-500" size={18} />
                  最近轧制记录
                </h2>
                <button className="text-[10px] font-bold text-cyan-500 hover:text-cyan-400 uppercase tracking-widest transition-colors">查看完整日志</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-950/50 text-slate-500 uppercase text-[10px] font-bold tracking-[0.15em]">
                      <th className="px-6 py-4">时间戳</th>
                      <th className="px-6 py-4">材质</th>
                      <th className="px-6 py-4">压下量</th>
                      <th className="px-6 py-4">张力</th>
                      <th className="px-6 py-4">公差</th>
                      <th className="px-6 py-4">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {history.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-800/30 transition-colors group">
                        <td className="px-6 py-4 text-slate-500 font-mono text-[10px]">{record.timestamp}</td>
                        <td className="px-6 py-4 font-bold text-slate-300">SUS304</td>
                        <td className="px-6 py-4 font-medium text-slate-400">{record.reduction} mm</td>
                        <td className="px-6 py-4 font-medium text-slate-400">{record.tension} kN</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded-md text-[10px] font-bold border",
                            record.tolerance <= 0.01 
                              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" 
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          )}>
                            ±{record.tolerance}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-900 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck size={16} className="text-cyan-500/50" />
            <span>工业级 AI 安全协议已激活 • 实时加密传输</span>
          </div>
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">© 2026 SCG 工业解决方案。保留所有权利。</p>
        </div>
      </footer>
    </div>
  );
}

// [4] 热工数字孪生
// Mock data for the "Error Paradox" visualization
const errorParadoxData = [
  { time: '0s', target: 1080, traditional: 1078, scg: 1080 },
  { time: '10s', target: 1080, traditional: 1082, scg: 1080 },
  { time: '20s', target: 1080, traditional: 1075, scg: 1079 },
  { time: '30s', target: 1080, traditional: 1085, scg: 1081 },
  { time: '40s', target: 1080, traditional: 1077, scg: 1080 },
  { time: '50s', target: 1080, traditional: 1083, scg: 1080 },
  { time: '60s', target: 1080, traditional: 1079, scg: 1080 },
];

const hardwareFoundation = {
  title: "硬件筑底：三点冗余测温",
  subtitle: "高信噪比数据基座",
  description: "关键温控点强制加装至 3支热电偶（三点冗余），剔除单一设备异常，保障底层数据高信噪比。",
  icon: <Database className="w-6 h-6" />,
  points: [
    "关键温控点强制加装至 3支热电偶",
    "三点冗余架构，剔除单一设备异常",
    "保障底层数据高信噪比"
  ]
};

const phases = [
  {
    id: 1,
    title: "阶段 1: SCG 导航仪模式",
    subtitle: "AI预测与人工辅助",
    icon: <Navigation className="w-6 h-6" />,
    description: "深度融合历史生产参数与实时接带速度。系统前馈预测温度变化，毫秒级弹窗预警，精准提示操作员“调节具体温区及阀门开度目标值”，消除经验盲调。",
    color: "bg-blue-50 border-blue-200",
    accent: "text-blue-600",
    points: [
      "深度融合历史生产参数与实时接带速度",
      "系统前馈预测温度变化",
      "毫秒级弹窗预警",
      "精准提示操作员调节目标值",
      "消除经验盲调"
    ]
  },
  {
    id: 2,
    title: "阶段 2: SCG 自动驾驶模式",
    subtitle: "闭环反控",
    icon: <Zap className="w-6 h-6" />,
    description: "全面接入底层硬件。系统依据车速与工艺模型，全自动下发指令接管比例电磁阀，实现车速与炉温的非线性动态耦合。",
    color: "bg-emerald-50 border-emerald-200",
    accent: "text-emerald-600",
    points: [
      "全面接入底层硬件",
      "依据车速与工艺模型全自动下发指令",
      "全自动接管比例电磁阀",
      "实现车速与炉温的非线性动态耦合"
    ]
  }
];

function App4() {
  const [activePhase, setActivePhase] = useState(1);

  return (
    <div className="min-h-screen bg-[#050B18] text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Grid Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: `radial-gradient(#1E293B 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-blue-600/5 via-transparent to-transparent" />

      {/* Top Navigation / Header */}
      <header className="sticky top-0 z-50 bg-[#050B18]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">SCG 智能化锻造系统</h1>
            <p className="text-xs text-blue-400 font-mono uppercase tracking-widest">退火工艺寻优 v4.0</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] text-slate-500 font-mono uppercase">系统状态</span>
            <span className="text-sm font-semibold text-cyan-400 flex items-center gap-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              AI 核心已上线
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 lg:p-10 space-y-16 relative z-10">
        {/* Hero Section */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <Flame className="w-3 h-3" /> 核心工艺：退火极值寻优
            </div>
            <h2 className="text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              唤醒 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">14温区</span><br />
              实现智能化锻造
            </h2>
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              通过 SCG 智能化路径，打破传统控制误差悖论，将 14-16 米主炉胆的硬件潜能发挥至极致。
            </p>
            <div className="flex gap-8 pt-4">
              <div className="flex flex-col">
                <span className="text-4xl font-bold text-white">14</span>
                <span className="text-xs text-blue-400 uppercase font-mono mt-1">精细温区</span>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-4xl font-bold text-white">±5℃</span>
                <span className="text-xs text-blue-400 uppercase font-mono mt-1">工艺公差</span>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-4xl font-bold text-cyan-400">25m³</span>
                <span className="text-xs text-blue-400 uppercase font-mono mt-1">吨均气耗</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl shadow-blue-900/20 p-8 overflow-hidden relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 p-4">
              <div className="bg-blue-500/10 rounded-full p-2 border border-blue-500/20">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <h3 className="text-sm font-bold text-blue-400/60 uppercase tracking-widest mb-8">实时热场模拟</h3>
            <div className="grid grid-cols-14 gap-1 h-48 items-end">
              {[...Array(14)].map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.random() * 60 + 40}%` }}
                  transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2 + Math.random(), ease: "easeInOut" }}
                  className={`rounded-t-sm w-full relative group/bar`}
                >
                  <div className={`absolute inset-0 rounded-t-sm blur-[2px] opacity-50 ${i < 7 ? 'bg-orange-500' : 'bg-blue-500'}`} />
                  <div className={`relative h-full rounded-t-sm border-t border-white/30 ${i < 7 ? 'bg-gradient-to-t from-orange-600/20 to-orange-400' : 'bg-gradient-to-t from-blue-600/20 to-blue-400'}`} />
                </motion.div>
              ))}
            </div>
            <div className="mt-6 flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
              <span>01 温区 (上部)</span>
              <div className="flex gap-4">
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-orange-500 rounded-full" /> 加热</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full" /> 冷却</span>
              </div>
              <span>14 温区 (下部)</span>
            </div>
          </motion.div>
        </section>

        {/* Status Analysis: Error Paradox */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-white">现状剖析：控制论层面的“误差悖论”</h3>
              <p className="text-slate-400 max-w-2xl">
                14-16米主炉胆已具备14个精细物理温区（上双下单），硬件基础优良，但受限于传统测温逻辑。
              </p>
            </div>
            <div className="flex items-center gap-2 text-red-400 font-semibold text-sm bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
              <AlertTriangle className="w-4 h-4" /> 核心死穴：测温滞后与精度错位
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 space-y-8">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-white">测温逻辑对比：传统 vs SCG 前馈</h4>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full" /> 传统单点 (滞后)</span>
                  <span className="flex items-center gap-1"><div className="w-3 h-3 bg-cyan-400 rounded-full" /> SCG 前馈 (精准)</span>
                </div>
              </div>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={errorParadoxData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
                    <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis domain={[1060, 1100]} stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#F8FAFC' }}
                      itemStyle={{ color: '#F8FAFC' }}
                    />
                    <ReferenceLine y={1085} stroke="#EF4444" strokeDasharray="3 3" label={{ position: 'right', value: '+5℃', fill: '#EF4444', fontSize: 10 }} />
                    <ReferenceLine y={1075} stroke="#EF4444" strokeDasharray="3 3" label={{ position: 'right', value: '-5℃', fill: '#EF4444', fontSize: 10 }} />
                    <ReferenceLine y={1080} stroke="#475569" label={{ position: 'insideTopLeft', value: '目标值: 1080℃', fill: '#475569', fontSize: 10 }} />
                    <Line name="传统单点" type="monotone" dataKey="traditional" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444', r: 3 }} />
                    <Line name="SCG 前馈" type="monotone" dataKey="scg" stroke="#22D3EE" strokeWidth={3} dot={{ fill: '#22D3EE', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="p-5 bg-red-500/5 rounded-xl border border-red-500/10">
                <p className="text-sm text-slate-300 leading-relaxed">
                  <span className="font-bold text-white">死穴：</span> 工艺目标要求 1080±5℃，但单支热电偶固有误差即达 ±5℃。单一反馈机制存在严重滞后，接带降速时，热堆积无法被及时察觉并干预，必然导致过烧与变形。
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-8 border border-white/10 relative overflow-hidden h-full">
                <div className="absolute -right-10 -bottom-10 opacity-5">
                  <Thermometer className="w-48 h-48" />
                </div>
                <h4 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <Layers className="w-6 h-6 text-blue-400" /> 硬件基础优良
                </h4>
                <div className="space-y-5 relative z-10">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 group hover:bg-white/10 transition-colors">
                    <span className="text-sm text-slate-400">主炉胆长度</span>
                    <span className="font-mono font-bold text-blue-400">14-16 m</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 group hover:bg-white/10 transition-colors">
                    <span className="text-sm text-slate-400">物理温区</span>
                    <span className="font-mono font-bold text-blue-400">14 温区</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 group hover:bg-white/10 transition-colors">
                    <span className="text-sm text-slate-400">布局方式</span>
                    <span className="font-mono font-bold text-blue-400">上双下单</span>
                  </div>
                </div>
                <div className="mt-10 p-5 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-xs text-red-300 leading-relaxed">
                    传统模式下，单点测温滞后导致在车速波动时无法及时响应，造成能源浪费与质量风险。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SCG Evolution Roadmap */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-4xl font-bold text-white">SCG 智能化锻造路径</h3>
            <p className="text-blue-400 uppercase tracking-[0.3em] text-[10px] font-mono font-bold">智能化演进两步走路线图</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2 z-0" />
            
            {/* Hardware Foundation Card */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="relative z-10 p-8 rounded-3xl border backdrop-blur-md transition-all duration-500 bg-slate-900/40 border-slate-700/50 group"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-slate-800 text-slate-400 group-hover:text-blue-400 transition-colors">
                {hardwareFoundation.icon}
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-white text-xl leading-tight">{hardwareFoundation.title}</h4>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{hardwareFoundation.subtitle}</p>
              </div>
              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-sm text-slate-400 leading-relaxed">
                  {hardwareFoundation.description}
                </p>
              </div>
            </motion.div>

            {phases.map((phase, idx) => (
              <motion.div 
                key={phase.id}
                whileHover={{ y: -10 }}
                className={`relative z-10 p-8 rounded-3xl border backdrop-blur-md transition-all duration-500 cursor-pointer group
                  ${activePhase === phase.id 
                    ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.2)]' 
                    : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                onClick={() => setActivePhase(phase.id)}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-lg transition-transform duration-500 group-hover:scale-110
                  ${activePhase === phase.id ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-400'}`}>
                  {phase.icon}
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-white text-xl leading-tight">{phase.title}</h4>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${activePhase === phase.id ? 'text-blue-400' : 'text-slate-500'}`}>{phase.subtitle}</p>
                </div>
                <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-200 transition-colors">
                    {phase.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detailed View */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activePhase}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-gradient-to-br from-blue-900/20 to-slate-900/40 rounded-3xl border border-white/10 p-10 lg:p-16 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -mr-32 -mt-32" />
              <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20">
                      策略执行
                    </div>
                  </div>
                  <h4 className="text-4xl font-bold text-white">{phases.find(p => p.id === activePhase)?.title}</h4>
                  <p className="text-xl text-slate-400 leading-relaxed">
                    {phases.find(p => p.id === activePhase)?.description}
                  </p>
                  <ul className="space-y-4">
                    {phases.find(p => p.id === activePhase)?.points.map((item, i) => (
                      <li key={i} className="flex items-start gap-4 text-slate-300">
                        <div className="mt-1.5">
                          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                        </div>
                        <span className="text-base">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white/5 rounded-3xl p-12 border border-white/10 flex flex-col items-center justify-center text-center space-y-8 backdrop-blur-xl shadow-inner">
                  {activePhase === 1 && (
                    <>
                      <div className="relative">
                        <Navigation className="w-32 h-32 text-blue-400/20" />
                        <motion.div 
                          animate={{ y: [0, -15, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.6)]"
                        >
                          AI 预测
                        </motion.div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-xl font-bold text-white">毫秒级智能预警</p>
                        <p className="text-sm text-slate-500 font-mono">消除经验盲调</p>
                      </div>
                    </>
                  )}
                  {activePhase === 2 && (
                    <>
                      <div className="relative">
                        <Zap className="w-32 h-32 text-cyan-400/20" />
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                          className="absolute inset-0 border-2 border-dashed border-cyan-400/30 rounded-full"
                        />
                        <motion.div 
                          animate={{ scale: [0.8, 1.2, 0.8] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,1)]" />
                        </motion.div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-2xl font-bold text-cyan-400">闭环自主控制</p>
                        <p className="text-sm text-slate-500 font-mono">非线性动态耦合</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Energy Consumption Section */}
        <section className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-3xl border border-white/10 p-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Flame className="w-48 h-48" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-4 max-w-xl">
              <h3 className="text-3xl font-bold text-white">能耗攻坚：精准“超前掐火”</h3>
              <p className="text-slate-300 leading-relaxed">
                通过接带期精准“超前掐火”与动态空燃比寻优，实现能源利用率的跨越式提升。
              </p>
            </div>
            <div className="flex gap-12">
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase font-mono mb-2">原始均耗</p>
                <p className="text-5xl font-bold text-slate-400 line-through">29<span className="text-xl">m³/t</span></p>
              </div>
              <div className="flex items-center">
                <ChevronRight className="w-8 h-8 text-blue-500 animate-pulse" />
              </div>
              <div className="text-center">
                <p className="text-xs text-cyan-400 uppercase font-mono mb-2">目标均耗</p>
                <p className="text-5xl font-bold text-white shadow-cyan-500/50 drop-shadow-lg">25<span className="text-xl">m³/t</span></p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Stats */}
        <section className="grid md:grid-cols-4 gap-6">
          {[
            { label: "主炉胆长度", value: "14-16m", icon: <Layers className="w-4 h-4" /> },
            { label: "温区数量", value: "14 温区", icon: <Thermometer className="w-4 h-4" /> },
            { label: "控制精度", value: "±5℃", icon: <Gauge className="w-4 h-4" /> },
            { label: "目标能耗", value: "25m³/t", icon: <Flame className="w-4 h-4" /> },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 flex items-center gap-5 group hover:bg-white/10 transition-all">
              <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 text-blue-400 group-hover:text-cyan-400 transition-colors">
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-mono tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#050B18] px-6 py-12 mt-24 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-xl tracking-tight">SCG 智能化锻造</span>
          </div>
          <p className="text-sm text-slate-500">© 2026 SCG 工业解决方案。版权所有。</p>
          <div className="flex gap-6">
            <span className="text-[10px] font-mono text-blue-400/60 uppercase tracking-widest">状态：AI 核心运行中</span>
            <span className="text-[10px] font-mono text-blue-400/60 uppercase tracking-widest">区域：全球网络</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// [5] 供应链协同
const FeatureCard = ({ icon: Icon, title, description, detail, colorClass }: { 
  icon: any, 
  title: string, 
  description: string, 
  detail: string,
  colorClass: string 
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="glass-panel p-6 hover:bg-white/10 transition-all duration-300 group"
  >
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClass} bg-opacity-20 border border-current`}>
      <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
    </div>
    <h3 className="text-xl font-bold mb-2 group-hover:text-neon-cyan transition-colors">{title}</h3>
    <p className="text-gray-400 text-sm mb-4 leading-relaxed">{description}</p>
    <div className="text-xs font-mono text-gray-500 border-t border-white/5 pt-4">
      {detail}
    </div>
  </motion.div>
);

const FlowLine = ({ d, delay = 0 }: { d: string, delay?: number }) => (
  <path
    d={d}
    fill="none"
    stroke="url(#gradient-flow)"
    strokeWidth="2"
    strokeDasharray="4 4"
    className="animate-flow"
    style={{ animationDelay: `${delay}s` }}
  />
);

function App5() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617]/50 selection:bg-neon-cyan/30">
      {/* Header Section */}
      <header className="relative h-[40vh] flex flex-col items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#020617]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px]" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-mono mb-6">
            <ShieldCheck className="w-3 h-3" />
            QUALITY CONTROL PRE-POSITIONING
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 italic">
            秒级无损快筛
            <span className="block text-2xl md:text-3xl font-light tracking-widest mt-2 text-gray-400 not-italic">
              释放“24小时死库存”
            </span>
          </h1>
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-24 space-y-24">
        
        {/* Flowchart Section */}
        <section className="relative">
          <div className="text-center mb-12">
            <h2 className="text-sm font-mono text-neon-cyan tracking-[0.3em] uppercase mb-2">Real-time Data Architecture</h2>
            <p className="text-2xl font-bold italic">即产即发：SCG 大脑实时联动流程</p>
          </div>

          <div className="glass-panel p-8 md:p-12 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* SVG Background for lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" style={{ zIndex: 0 }}>
                <defs>
                  <linearGradient id="gradient-flow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(0, 245, 255, 0)" />
                    <stop offset="50%" stopColor="rgba(0, 245, 255, 0.5)" />
                    <stop offset="100%" stopColor="rgba(0, 245, 255, 0)" />
                  </linearGradient>
                </defs>
                <FlowLine d="M 25% 50% L 75% 50%" />
                <FlowLine d="M 50% 50% L 50% 85% L 85% 85%" delay={0.5} />
              </svg>

              {[
                { icon: Cpu, label: "生产线在线检测", sub: "LIBS / 涡流 / 气氛", active: activeStep === 0 },
                { icon: Activity, label: "实时数据并网", sub: "秒级数据流向大脑", active: activeStep === 1 },
                { icon: Database, label: "SCG 大脑决策", sub: "自动判定放行", active: activeStep === 2 },
                { icon: TrendingUp, label: "即产即发物流", sub: "零等待周转", active: activeStep === 3 },
              ].map((step, i) => (
                <motion.div 
                  key={i}
                  animate={{ 
                    scale: step.active ? 1.05 : 1,
                    backgroundColor: step.active ? 'rgba(0, 245, 255, 0.1)' : 'rgba(255, 255, 255, 0.02)'
                  }}
                  className={`relative z-10 p-6 rounded-xl border border-white/10 flex flex-col items-center text-center transition-all duration-500`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${step.active ? 'bg-neon-cyan text-black shadow-[0_0_20px_rgba(0,245,255,0.4)]' : 'bg-white/5 text-gray-500'}`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-sm font-bold mb-1 ${step.active ? 'text-neon-cyan' : 'text-gray-300'}`}>{step.label}</span>
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{step.sub}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Triple Matrix Section */}
        <section>
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-black italic mb-2">三重防呆矩阵</h2>
              <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">Reshaping Quality Delivery Standards</p>
            </div>
            <div className="h-px flex-1 bg-white/10 mx-8 hidden md:block" />
            <div className="text-right">
              <span className="text-neon-cyan font-mono text-4xl font-black">01</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Zap}
              title="在线 LIBS 元素快筛"
              description="告别物理剪样。利用脉冲激光诱导击穿光谱，在高速运行中秒级锁定 Ni、Cr、C 等核心元素。"
              detail="杜绝混料与脱碳 | 激光诱导击穿光谱技术"
              colorClass="bg-neon-cyan"
            />
            <FeatureCard 
              icon={Layers}
              title="电磁涡流硬度监测"
              description="无接触式扫描晶粒应力，实时输出硬度连续流数据，确保下游制管冲压“零开裂”。"
              detail="阻断退货索赔风险 | 晶粒应力无损扫描"
              colorClass="bg-neon-orange"
            />
            <FeatureCard 
              icon={Wind}
              title="炉内气氛实时监控"
              description="高频监控甲醇制氢露点与水氧含量，构筑最后一道防氧化屏障。"
              detail="水氧含量精准控制 | 防氧化屏障"
              colorClass="bg-emerald-400"
            />
          </div>
        </section>

        {/* Financial Value Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-black italic text-neon-cyan">财务级核心价值</h2>
              <p className="text-xl text-gray-400 font-light">质检数据全域并网大屏，实现产品“下线即放行”</p>
            </div>

            <div className="space-y-6">
              {[
                { label: "消除化验等待期", value: "24-28h", icon: Clock },
                { label: "物理损耗降低", value: "≈0%", icon: CheckCircle2 },
                { label: "库存周转效率", value: "+300%", icon: TrendingUp },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-6 group">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-neon-cyan/50 transition-colors">
                    <stat.icon className="w-5 h-5 text-gray-400 group-hover:text-neon-cyan" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-3xl font-black italic group-hover:text-neon-cyan transition-colors">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-neon-cyan/10 blur-3xl rounded-full" />
            <div className="glass-panel p-8 relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-mono text-gray-400">LIVE: SCG BRAIN LINKAGE</span>
                </div>
                <div className="text-xs font-mono text-neon-cyan">SYSTEM_STABLE_0.99</div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex justify-between text-[10px] font-mono text-gray-500 mb-2">
                    <span>CASH FLOW STATUS</span>
                    <span>OPTIMIZED</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '85%' }}
                      className="h-full bg-neon-cyan"
                    />
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 leading-relaxed italic">
                  将海量<span className="text-white font-bold">“静止死库存”</span>瞬间转化为高速周转的<span className="text-neon-cyan font-bold">“高活现金流”</span>！
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-3 bg-neon-cyan/5 border border-neon-cyan/20 rounded-lg">
                  <p className="text-[10px] font-mono text-neon-cyan mb-1 uppercase">Efficiency</p>
                  <p className="text-xl font-black italic">MAX</p>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                  <p className="text-[10px] font-mono text-gray-500 mb-1 uppercase">Risk Level</p>
                  <p className="text-xl font-black italic">MIN</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Decoration */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-neon-cyan flex items-center justify-center text-black font-black italic">SCG</div>
            <div className="text-xs font-mono text-gray-500">
              <p>© 2026 SCG INDUSTRIAL INTELLIGENCE</p>
              <p>QUALITY CONTROL SYSTEM V5.2</p>
            </div>
          </div>
          <div className="flex gap-8 text-[10px] font-mono text-gray-600 tracking-widest uppercase">
            <span>Precision</span>
            <span>Speed</span>
            <span>Reliability</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// [6] 排产优化
const ROI_DATA = [
  {
    category: "天然气极限压降",
    current: "29 立方/吨",
    solution: "目标降至 25 立方/吨",
    savingPerTon: "约 15 元",
    annualProfit: "约 225 万元",
    icon: <Zap className="w-5 h-5 text-cyan-400" />
  },
  {
    category: "保护气低成本平替",
    current: "液氨分解制氢",
    solution: "甲醇制氢撬装替代",
    savingPerTon: "极值差价约 30 元",
    annualProfit: "约 450 万元",
    icon: <ShieldCheck className="w-5 h-5 text-cyan-400" />
  },
  {
    category: "终极防呆与库存释放(提升运营周转率)",
    current: "换卷废品损耗，积压巨量资金与退货风险",
    solution: "部署 30万轻量级 LIBS/涡流模块+ AI热速耦合极速接带",
    savingPerTon: "深度排雷/释放资金综合折算约 70 元",
    annualProfit: "约 1050 万元",
    icon: <BarChart3 className="w-5 h-5 text-cyan-400" />,
    isHighLeverage: true
  },
  {
    category: "接带效率与产能提升",
    current: "接带效率低导致被迫降速",
    solution: "高频极速激光秒级过流产线提速",
    savingPerTon: "综合折算",
    annualProfit: "约 160 万元",
    icon: <TrendingUp className="w-5 h-5 text-cyan-400" />
  }
];

function App6() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Tech Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Header Section */}
      <header className="relative z-10 bg-slate-950/60 backdrop-blur-xl border-b border-slate-800 sticky top-0 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400/20">
              <Factory className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white uppercase">君昌智 SCG 总包赋能方案</h1>
              <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Page 06: ROI Financial Model</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">测算基准</p>
              <p className="text-sm font-black text-cyan-300">15万吨/年 实际有效产能 测算</p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Hero Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center md:text-left"
        >
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight leading-tight">
            投资回报核算 —— <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 animate-gradient-x">14个月极速回本</span>财务模型
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl font-medium">
            通过全流程智能化改造，实现从能源压降到产能提升的全维度利润挖掘。
          </p>
        </motion.div>

        {/* ROI Table */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800 overflow-hidden mb-10"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 border-b border-slate-700">
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">利润挖掘点</th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">传统产线现状</th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">SCG 总包赋能方案</th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">单吨降本增效估算</th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">预计年化新增净利</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {ROI_DATA.map((item, index) => (
                  <motion.tr 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className={`hover:bg-blue-500/5 transition-colors group ${item.isHighLeverage ? 'bg-cyan-500/5' : ''}`}
                  >
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors border border-slate-700 shadow-inner">
                            {item.icon}
                          </div>
                          <span className="font-black text-slate-200">{item.category}</span>
                        </div>
                        {item.isHighLeverage && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 animate-pulse ml-11 w-fit shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                            【提升运营周转率】
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-slate-400 text-sm font-medium leading-relaxed">
                      {item.current}
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 text-blue-400 font-black text-sm">
                        <ArrowRight className="w-4 h-4 text-cyan-500" />
                        {item.solution}
                      </div>
                    </td>
                    <td className="px-6 py-6 font-mono text-sm text-slate-500 font-bold">
                      {item.savingPerTon}
                    </td>
                    <td className="px-6 py-6 text-right">
                      <span className="text-xl font-black text-white tabular-nums drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                        {item.annualProfit}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl p-8 text-white flex flex-col justify-between relative overflow-hidden group shadow-2xl border border-slate-800"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <DollarSign className="w-32 h-32 text-blue-400" />
            </div>
            <div className="relative z-10">
              <p className="text-blue-400 text-sm font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                全案 ROI 测算汇总
              </p>
              <h3 className="text-2xl font-black mb-6">预计年化新增净利</h3>
            </div>
            <div className="relative z-10 flex items-baseline gap-2">
              <span className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">约 1885</span>
              <span className="text-3xl font-black text-blue-300">万元</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-slate-900 to-cyan-950 rounded-2xl p-8 text-white flex flex-col justify-between relative overflow-hidden group shadow-2xl border border-slate-800"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <Clock className="w-32 h-32 text-cyan-400" />
            </div>
            <div className="relative z-10">
              <p className="text-cyan-400 text-sm font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                核心财务指标
              </p>
              <h3 className="text-2xl font-black mb-6">回本周期估算</h3>
            </div>
            <div className="relative z-10 flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-black uppercase tracking-widest mr-2 text-slate-400">严格锚定</span>
                <span className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">14</span>
                <span className="text-3xl font-black text-cyan-300">个月</span>
              </div>
              <p className="text-[10px] font-black mt-2 text-slate-500 uppercase tracking-widest">
                基于 2200 万总包投入测算
              </p>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-600 via-blue-400 to-cyan-600" />
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <div className="inline-block px-12 py-8 bg-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-800 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <p className="text-white font-black text-2xl relative z-10 tracking-tight">
              以轻量级硬件为躯干，以 AI 算法为灵魂。
            </p>
            <p className="text-cyan-400/80 font-bold mt-3 relative z-10 italic tracking-wide">
              严格兑现框架协议，重塑不锈钢产业盈利绝对边界！
            </p>
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// App7: 君昌智 SCG 软硬解耦十字矩阵架构图
function App7() {
  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Grid Effect */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <main className="relative max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12">

        {/* Header Section */}
        <header className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono tracking-widest uppercase"
          >
            <Activity size={14} /> SCG Cross-Matrix (No PLC Reconstruction)
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent"
          >
            君昌智 SCG 软硬解耦十字矩阵架构图
          </motion.h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-medium">
            彻底告别 L0 级人工盲调 · 全栈智能控制层级
          </p>
        </header>

        {/* The Matrix Container */}
        <div className="relative flex flex-col gap-12">

          {/* TOP LAYER: SCG Twin Brain & Process Kernel */}
          <section className="relative z-30">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="max-w-5xl mx-auto p-1 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-700 shadow-[0_0_60px_-15px_rgba(59,130,246,0.6)]"
            >
              <div className="bg-[#0a0f1a] rounded-[14px] p-8 flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-blue-500/20">
                <div className="flex-1 p-6 text-center space-y-4">
                  <div className="flex justify-center mb-2">
                    <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                      <Cpu size={40} />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white leading-tight">君昌智 SCG 全局 AI 调度中枢</h2>
                  <p className="text-[10px] font-mono text-blue-400/70 uppercase tracking-[0.2em]">Global AI Dispatch Center</p>
                </div>

                <div className="flex-1 p-6 text-center space-y-4">
                  <div className="flex justify-center mb-2">
                    <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                      <ShieldCheck size={40} />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white leading-tight">联合苏大王教授：先进冶金热力学内核</h2>
                  <p className="text-[10px] font-mono text-indigo-400/70 uppercase tracking-[0.2em]">Metallurgical Thermodynamics Kernel</p>
                </div>
              </div>

              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg">
                SCG 孪生大脑与工艺内核 (绝对视觉中心)
              </div>
            </motion.div>

            {/* Top Layer Annotations */}
            <div className="mt-10 flex justify-between max-w-5xl mx-auto px-16">
              <motion.div
                animate={{ x: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-3 text-amber-400 text-sm font-bold bg-amber-400/5 px-4 py-2 rounded-lg border border-amber-400/20"
              >
                <Zap size={18} className="fill-current" /> 微秒级动态补偿与物理反控 (下指令)
              </motion.div>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-3 text-blue-400 text-sm font-bold bg-blue-400/5 px-4 py-2 rounded-lg border border-blue-400/20"
              >
                <Database size={18} /> 毫秒级全域生产数据感知 (抽数据)
              </motion.div>
            </div>
          </section>

          {/* MIDDLE LAYER (Hardware Ecosystem) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative px-4">

            {/* Vertical Flow Arrows */}
            <div className="absolute inset-0 pointer-events-none">
              {[0, 1, 2, 3].map(i => (
                <React.Fragment key={`arrows-${i}`}>
                  <div className="absolute top-[-120px]" style={{ left: `${(i * 25) + 12.5}%` }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: [0, 1, 0],
                        y: [0, -100],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: "linear"
                      }}
                      className="absolute left-1/2 -translate-x-1/2 text-blue-400/40 z-10"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-px h-12 bg-blue-400/20 border-l border-dashed border-blue-400/40" />
                        <ArrowUp size={16} strokeWidth={3} />
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        scaleY: [0, 1, 1, 0.5],
                        y: [-100, 0, 100, 200]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.6,
                        ease: "easeIn"
                      }}
                      className="absolute left-1/2 -translate-x-1/2 text-amber-400 z-20 origin-top"
                    >
                      <div className="flex flex-col items-center">
                        <Zap size={24} fill="currentColor" />
                        <div className="w-1 h-24 bg-gradient-to-b from-amber-400 to-transparent" />
                      </div>
                    </motion.div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {[
              { id: 1, title: "常温冷轧段", painPoint: "厚度波动大，依赖人工手感", middleLayer: "全视智能（动态轨迹纠偏）" },
              { id: 2, title: "入炉接带段", painPoint: "停机换卷慢，引发炉内热冲击", middleLayer: "极速激光拼焊机" },
              { id: 3, title: "退火炉膛段", painPoint: "29方高气耗、发黄变形风险", middleLayer: "苏大王晓南教授团队（先进物理保温与余热改造）", middleLayerExtra: "甲醇制氢撬装" },
              { id: 4, title: "下线质检段", painPoint: "24小时盲长等待，死库存积压", middleLayer: "30 万轻量级 LIBS（元素）与涡流（硬度）探头" }
            ].map((node, idx) => (
              <div key={node.id} className="flex flex-col gap-8 group">

                {/* MIDDLE LAYER: Hardware Ecosystem */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 group-hover:bg-blue-500/10 group-hover:border-blue-500/40 transition-all flex flex-col items-center text-center gap-4 min-h-[180px] justify-center shadow-lg"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#05070a] border border-blue-500/30 text-[9px] text-blue-400 font-black uppercase tracking-widest">
                    中层：精锐硬件生态躯干
                  </div>
                  <Layers className="text-blue-400/40" size={24} />
                  <p className="text-sm font-bold text-blue-50/90 leading-relaxed">
                    {node.middleLayer}
                  </p>
                  {node.middleLayerExtra && (
                    <div className="mt-1 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                      + {node.middleLayerExtra}
                    </div>
                  )}
                </motion.div>

                {/* X-AXIS: Physical Process */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  className="p-6 rounded-2xl border-2 border-slate-800 bg-slate-900/80 shadow-2xl group-hover:border-slate-600 transition-all relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Box size={40} />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white font-black text-base border border-slate-700">
                      {node.id}
                    </div>
                    <h3 className="font-black text-lg text-white tracking-tight">{node.title}</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em]">核心痛点</p>
                    <p className="text-sm text-red-400/90 font-bold leading-snug">
                      {node.painPoint}
                    </p>
                  </div>
                </motion.div>

              </div>
            ))}
          </div>

          {/* BOTTOM LAYER: L1 Base */}
          <section className="relative mt-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto"
            >
              <div className="relative p-1 rounded-3xl bg-gradient-to-b from-slate-700 to-slate-900 shadow-2xl">
                <div className="bg-slate-900/90 rounded-[22px] p-10 flex flex-col md:flex-row items-center gap-10">
                  <div className="flex-shrink-0 p-6 rounded-3xl bg-slate-800 border border-slate-700 shadow-inner">
                    <Network size={48} className="text-slate-400" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-slate-800 rounded-lg text-slate-300 text-xs font-black uppercase tracking-widest border border-slate-700">
                        L1 级基础自动化基座
                      </span>
                      <span className="text-red-500 text-xs font-black animate-pulse">
                        彻底告别 L0 级人工盲调
                      </span>
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">君昌智 L1 级重构核心基座</h2>
                    <p className="text-slate-400 text-lg leading-relaxed font-medium">
                      由君昌智统一部署全新 <span className="text-blue-400">边缘控制柜 (Smart PLC)</span>、
                      <span className="text-blue-400">高敏比例电磁阀</span> 与
                      <span className="text-blue-400">全域数字传感器网络</span>。
                    </p>
                  </div>
                  <div className="hidden lg:grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 flex flex-col items-center gap-2">
                      <Settings size={20} className="text-slate-500" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">边缘控制柜</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 flex flex-col items-center gap-2">
                      <Gauge size={20} className="text-slate-500" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">比例电磁阀</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Label */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-8 py-2 bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-slate-700 shadow-xl">
                  底层：君昌智 L1 级基础自动化基座 (重构核心点)
                </div>
              </div>
            </motion.div>
          </section>

        </div>

        {/* Footer Info */}
        <footer className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 text-sm">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse" />
              <span className="font-bold">毫秒级数据感知</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse" />
              <span className="font-bold">微秒级物理反控</span>
            </div>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] font-black opacity-50">
            SCG Cross-Matrix Architecture · No PLC Reconstruction · v2.0
          </div>
        </footer>
      </main>

      {/* Side Legend (Vertical Axis Label) */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 hidden 2xl:flex flex-col items-center gap-6 opacity-20 hover:opacity-100 transition-opacity">
        <div className="h-40 w-px bg-gradient-to-b from-transparent via-slate-500 to-transparent" />
        <span className="[writing-mode:vertical-lr] rotate-180 text-[11px] font-black tracking-[0.8em] uppercase text-slate-400">
          纵轴 (Y轴)：全栈智能控制层级
        </span>
        <div className="h-40 w-px bg-gradient-to-b from-transparent via-slate-500 to-transparent" />
      </div>

      {/* Bottom Legend (Horizontal Axis Label) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 hidden 2xl:flex items-center gap-6 opacity-20 hover:opacity-100 transition-opacity">
        <div className="w-40 h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent" />
        <span className="text-[11px] font-black tracking-[0.8em] uppercase text-slate-400">
          横轴 (X轴)：物理工艺流
        </span>
        <div className="w-40 h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent" />
      </div>
    </div>
  );
}

export default function App() {
  const [i, setI] = React.useState(0);
  const slides = [App0, App1, App2, App3, App4, App5, App6, App7];
  const names = ['君昌智·数字孪生', '生产诊断看板', '智控系统架构', '能源管理系统', '热工数字孪生', '供应链协同', '排产优化', '十字矩阵架构'];
  const Slide = slides[i];
  return (
    <div style={{ background: '#0a0e1a', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', background: '#111827', color: '#94a3b8', fontSize: 14 }}>
        <button onClick={() => setI(j => Math.max(0, j-1))} disabled={i===0} style={{ background: 'none', border: '1px solid #334155', color: '#94a3b8', padding: '4px 14px', borderRadius: 6, cursor: 'pointer' }}>‹ 上一页</button>
        <span>{i+1} / {slides.length} — {names[i]}</span>
        <button onClick={() => setI(j => Math.min(slides.length-1, j+1))} disabled={i===slides.length-1} style={{ background: 'none', border: '1px solid #334155', color: '#94a3b8', padding: '4px 14px', borderRadius: 6, cursor: 'pointer' }}>下一页 ›</button>
      </div>
      <Slide />
    </div>
  );
}