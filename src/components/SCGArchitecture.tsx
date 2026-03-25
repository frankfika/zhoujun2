import React from 'react';
import { 
  Cpu, 
  Layers, 
  Zap, 
  Activity, 
  Wind, 
  ShieldCheck, 
  ArrowUp, 
  ArrowDown,
  Database,
  Settings,
  Microscope,
  Flame,
  Maximize2,
  Box
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

const processBlocks = [
  { 
    id: 'rolling', 
    title: '常温冷轧段', 
    pain: '厚度波动大，依赖人工手感',
    hardware: '全视智能（动态轨迹纠偏）'
  },
  { 
    id: 'joint', 
    title: '入炉接带段', 
    pain: '停机换卷慢，引发炉内热冲击',
    hardware: '极速激光拼焊机'
  },
  { 
    id: 'furnace', 
    title: '退火炉膛段', 
    pain: '29方高气耗、发黄变形风险',
    hardware: '苏大王晓南教授团队（先进物理保温与余热改造） + 甲醇制氢撬装'
  },
  { 
    id: 'quality', 
    title: '下线质检段', 
    pain: '24小时盲长等待，死库存积压',
    hardware: '30 万轻量级 LIBS（元素）与涡流（硬度）探头'
  }
];

export default function SCGArchitecture() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">全案矩阵与双剑合璧</h1>
        <p className="text-slate-400 text-sm mt-1">君昌智 SCG 软硬解耦十字矩阵架构图</p>
      </div>

      <div className="relative min-h-[700px] glass-panel p-12 overflow-hidden border-white/10">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-5 data-grid-line" />

        {/* Top Layer: SCG Brain */}
        <div className="relative z-20 flex justify-center mb-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl bg-gradient-to-r from-blue-900 to-indigo-900 border border-blue-400/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(59,130,246,0.2)] relative"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-[10px] font-bold text-white uppercase tracking-widest rounded-full">
              SCG 孪生大脑与工艺内核 (绝对视觉中心)
            </div>
            <div className="flex items-center justify-between gap-12">
              <div className="flex-1 border-r border-white/10 pr-12 text-center">
                <div className="p-3 bg-blue-500/10 rounded-xl inline-block mb-4">
                  <Cpu className="text-blue-400" size={32} />
                </div>
                <h3 className="text-xl font-black text-white tracking-tighter mb-2">君昌智 SCG 全局 AI 调度中枢</h3>
                <p className="text-[10px] text-blue-400 font-mono uppercase tracking-widest">GLOBAL AI DISPATCH CENTER</p>
              </div>
              <div className="flex-1 text-center">
                <div className="p-3 bg-blue-500/10 rounded-xl inline-block mb-4">
                  <ShieldCheck className="text-blue-400" size={32} />
                </div>
                <h3 className="text-xl font-black text-white tracking-tighter mb-2">联合苏大王教授：先进冶金热力学内核</h3>
                <p className="text-[10px] text-blue-400 font-mono uppercase tracking-widest">METALLURGICAL THERMODYNAMICS KERNEL</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Arrow Labels - between brain and hardware cards */}
        <div className="relative z-20 flex justify-center items-center gap-6 mb-8">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <ArrowDown size={12} className="text-amber-500" />
            <span className="text-[10px] font-bold text-amber-500 uppercase">微秒级动态补偿与物理反控 (下指令)</span>
          </div>
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-3 h-3 rounded-full bg-amber-500"
          />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <ArrowUp size={12} className="text-accent-blue" />
            <span className="text-[10px] font-bold text-accent-blue uppercase">毫秒级全域生产数据感知 (抽数据)</span>
          </div>
        </div>

        {/* Middle Layer: Hardware Ecosystem */}
        <div className="relative z-10 grid grid-cols-4 gap-6 mb-8">
          {processBlocks.map((block, idx) => (
            <div key={block.id} className="flex flex-col items-center">
              {/* Hardware Block */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="w-full aspect-[4/3] glass-panel p-4 flex flex-col items-center justify-center text-center border-white/10 hover:border-accent-blue/30 transition-all group relative"
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-800 text-[8px] font-bold text-slate-500 uppercase tracking-widest rounded border border-white/5">
                  中层：精锐硬件生态躯干
                </div>
                <div className="p-2 bg-white/5 rounded-full mb-3 group-hover:bg-accent-blue/10 transition-colors">
                  {idx === 0 && <Maximize2 className="text-accent-blue" size={20} />}
                  {idx === 1 && <Zap className="text-accent-orange" size={20} />}
                  {idx === 2 && <Flame className="text-accent-green" size={20} />}
                  {idx === 3 && <Microscope className="text-purple-400" size={20} />}
                </div>
                <p className="text-[10px] font-bold text-slate-300 leading-tight">
                  {block.hardware}
                </p>
                {idx === 2 && (
                  <div className="mt-2 px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded text-[8px] text-blue-300 font-bold">
                    + 甲醇制氢撬装
                  </div>
                )}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Process Blocks (X-axis) */}
        <div className="relative z-10 grid grid-cols-4 gap-6 mb-16">
          {processBlocks.map((block, idx) => (
            <div key={`process-${block.id}`} className="glass-panel p-4 border-white/5 bg-industrial-900/40 relative group overflow-hidden">
              <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Box size={32} />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                  {idx + 1}
                </div>
                <h4 className="text-xs font-bold text-white">{block.title}</h4>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">核心痛点</p>
                <p className="text-[10px] text-red-400 leading-tight">{block.pain}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Layer: L1 Base */}
        <div className="relative z-10 flex justify-center mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-slate-900/60 border border-white/10 rounded-2xl p-8 relative flex items-center gap-12"
          >
            <div className="absolute -top-3 left-8 px-3 py-1 bg-slate-800 text-[10px] font-bold text-blue-400 uppercase tracking-widest rounded border border-blue-400/20">
              L1 级基础自动化基座 <span className="text-red-400 ml-2">彻底告别 L0 级人工盲调</span>
            </div>
            
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
              <Layers className="text-slate-400" size={40} />
            </div>

            <div className="flex-1">
              <h4 className="text-2xl font-black text-white mb-2 tracking-tighter">君昌智 L1 级重构核心基座</h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                由君昌智统一部署全新 <span className="text-blue-400 font-bold">边缘控制柜 (Smart PLC)</span>、<span className="text-blue-400 font-bold">高敏比例电磁阀</span> 与 <span className="text-blue-400 font-bold">全域数字传感器网络</span>。
              </p>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Settings size={20} className="text-slate-500" />
                </div>
                <span className="text-[8px] text-slate-500 uppercase font-bold">边缘控制柜</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Activity size={20} className="text-slate-500" />
                </div>
                <span className="text-[8px] text-slate-500 uppercase font-bold">比例电磁阀</span>
              </div>
            </div>

            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-slate-800 text-[9px] font-bold text-slate-500 uppercase tracking-widest rounded-full border border-white/5">
              底层：君昌智 L1 级基础自动化基座 (重构核心点)
            </div>
          </motion.div>
        </div>

        {/* Footer info */}
        <div className="absolute bottom-4 w-full px-12 flex justify-between items-center text-[8px] text-slate-600 font-mono uppercase tracking-[0.2em]">
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-blue" />
              <span>毫秒级数据感知</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span>微秒级物理反控</span>
            </div>
          </div>
          <div>SCG CROSS-MATRIX ARCHITECTURE • NO PLC RECONSTRUCTION • V2.0</div>
        </div>
      </div>
    </div>
  );
}
