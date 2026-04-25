import { motion } from 'framer-motion'
import { FileText, Cpu, Share2, Play } from 'lucide-react'

export default function HowItWorks() {
    const steps = [
        {
            icon: FileText,
            title: "Step 1: Write",
            description: "Just write down what you did today.",
            bgClass: "bg-blue-500/10",
            textClass: "text-blue-500",
            status: "ready"
        },
        {
            icon: Cpu,
            title: "Step 2: AI Magic",
            description: "Our AI turns your notes into perfect social media posts.",
            bgClass: "bg-indigo-500/10",
            textClass: "text-indigo-600 dark:text-indigo-400",
            status: "active"
        },
        {
            icon: Share2,
            title: "Step 3: Post",
            description: "Review and post high-impact threads to grow your audience.",
            bgClass: "bg-purple-500/10",
            textClass: "text-purple-600 dark:text-purple-400",
            status: "ready"
        }
    ]

    return (
        <section className="py-24 sm:py-32 relative overflow-hidden" id="how-it-works">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-grid-blueprint-light opacity-[0.4] dark:opacity-[0.1]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-50/50 dark:to-black/50" />
            </div>
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 sm:mb-24">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/5 text-indigo-500 text-[10px] font-black tracking-[0.4em] uppercase border border-indigo-500/10 mb-6"
                    >
                        Process_Workflow
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-slate-900 dark:text-white mb-6 tracking-tighter"
                    >
                        From Notes To <span className="text-indigo-500">Publicity</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed"
                    >
                        Our platform streamlines the bridge between development and distribution.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                    {steps.map((step, index) => {
                        const Icon = step.icon
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative group h-full"
                            >
                                <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl rounded-[2.5rem] p-8 sm:p-10 border border-slate-200 dark:border-slate-800/50 shadow-sm relative z-10 hover:border-indigo-500/30 transition-all duration-500 h-full flex flex-col group/card overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/card:opacity-30 transition-opacity">
                                        <span className="text-4xl font-display font-black">0{index + 1}</span>
                                    </div>
                                    
                                    <div className={`w-14 h-14 rounded-2xl ${step.bgClass} flex items-center justify-center mb-8 group-hover/card:scale-110 group-hover/card:rotate-3 transition-transform duration-500 shadow-inner`}>
                                        <Icon className={`w-7 h-7 ${step.textClass}`} />
                                    </div>
                                    
                                    <h3 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase">{step.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs sm:text-sm font-medium">
                                        {step.description}
                                    </p>
                                    
                                    <div className="mt-auto pt-8 flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${step.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`} />
                                        <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">{step.status}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Video Tutorial Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-32 max-w-5xl mx-auto"
                >
                    <div className="relative group">
                        {/* Decorative background glow */}
                        <div className="absolute -inset-10 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-[3rem] blur-3xl group-hover:opacity-100 opacity-50 transition duration-700" />
                        
                        <div className="relative bg-zinc-100/50 dark:bg-slate-900/50 backdrop-blur-2xl rounded-[3rem] p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/50 shadow-3xl overflow-hidden">
                            <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500/10 rounded-xl">
                                            <Play className="w-5 h-5 text-indigo-500 fill-indigo-500/20" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest text-indigo-500 font-mono">Walkthrough_Module</span>
                                    </div>
                                    <h3 className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">
                                        Observe the <br /> <span className="text-indigo-500">Architecture</span>
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                                        Witness the complete transformation cycle from raw terminal input to high-fidelity social assets. No complexity, just pure synthesis.
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {['High-Fidelity', 'No-Latency', 'Neural-Ready'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-[1.5]">
                                    <div className="aspect-video rounded-3xl overflow-hidden bg-slate-950 border-4 border-white dark:border-slate-800 shadow-2xl relative group/video">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src="https://www.youtube.com/embed/h4TbpIRWrp8?rel=0&modestbranding=1"
                                            title="App Tutorial"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="w-full h-full relative z-10"
                                        ></iframe>
                                        <div className="absolute inset-0 bg-indigo-500/10 group-hover/video:opacity-0 transition-opacity z-20 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
