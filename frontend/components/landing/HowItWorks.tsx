import { motion } from 'framer-motion'
import { FileText, Cpu, Share2 } from 'lucide-react'

export default function HowItWorks() {
    const steps = [
        {
            icon: FileText,
            title: "Log Your Build",
            description: "Input your Morning Plan & Evening Reflection daily.",
            bgClass: "bg-blue-500/10",
            textClass: "text-blue-500"
        },
        {
            icon: Cpu,
            title: "AI Generation",
            description: "Our AI turns your daily logs into high-quality social media posts.",
            bgClass: "bg-indigo-500/10",
            textClass: "text-indigo-500"
        },
        {
            icon: Share2,
            title: "Share it",
            description: "Get ready-to-post Twitter threads in seconds.",
            bgClass: "bg-purple-500/10",
            textClass: "text-purple-500"
        }
    ]

    return (
        <section className="py-16 relative overflow-hidden" id="how-it-works">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-slate-50/50 dark:bg-black/20 pointer-events-none" />
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight"
                    >
                        How it <span className="text-indigo-500">works</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg font-medium"
                    >
                        Three steps to turn raw inputs into audience growth.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[60px] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 dark:from-blue-900/50 dark:via-indigo-900/50 dark:to-purple-900/50 z-0" />

                    {steps.map((step, index) => {
                        const Icon = step.icon
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="relative group"
                            >
                                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 relative z-10 hover:translate-y-[-5px] transition-transform duration-300 h-full flex flex-col items-center">
                                    <div className={`w-16 h-16 rounded-2xl ${step.bgClass} flex items-center justify-center mb-6 list-none group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className={`w-8 h-8 ${step.textClass}`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 text-center">{step.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-center leading-relaxed text-sm">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
