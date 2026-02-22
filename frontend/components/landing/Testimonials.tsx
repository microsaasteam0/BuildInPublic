'use client'

import { motion } from 'framer-motion'
import { Quote, Star, User } from 'lucide-react'

const testimonials = [
    {
        name: "Alex Rivera",
        role: "SaaS Founder",
        content: "BuildInPublic has completely changed how I share my journey. I just dump my notes, and it gives me a week's worth of content.",
        initials: "AR",
        color: "indigo"
    },
    {
        name: "Sarah Chen",
        role: "Indie Hacker",
        content: "The smart writing engine is scary good. It captures my tone perfectly every time. It's like having a social media manager.",
        initials: "SC",
        color: "purple"
    },
    {
        name: "David Park",
        role: "Frontend Dev",
        content: "I used to spend hours struggling with what to tweet. Now it takes me 2 minutes. The Twitter thread output is elite.",
        initials: "DP",
        color: "blue"
    },
    {
        name: "Elena Rodriguez",
        role: "Content Creator",
        content: "The way it handles daily reflections is amazing. It finds insights I didn't even realize I'd written. Highly recommended for every builder.",
        initials: "ER",
        color: "emerald"
    },
    {
        name: "Marcus Thorne",
        role: "Solopreneur",
        content: "Consistency was my biggest weakness. With BuildInPublic, I haven't missed a day of posting in three months. My following is up 400%.",
        initials: "MT",
        color: "amber"
    },
    {
        name: "James Wilson",
        role: "Tech Lead",
        content: "The automation is seamless. I love that I can focus purely on building while my distribution channel grows in the background.",
        initials: "JW",
        color: "rose"
    }
]

export default function Testimonials() {
    return (
        <section className="py-24 relative overflow-hidden bg-white dark:bg-black" id="testimonials">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 bg-grid-blueprint-light opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest mb-4"
                    >
                        <Star className="w-3 h-3 fill-current" />
                        Social Proof
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-display font-black text-slate-900 dark:text-white tracking-tighter mb-4"
                    >
                        Loved by <span className="text-indigo-600 dark:text-indigo-400">Founders</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto"
                    >
                        Join hundreds of builders who are growing their audience automatically.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-8 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm group hover:border-indigo-500/30 transition-all shadow-xl dark:shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                            <Quote className="absolute top-6 right-8 w-8 h-8 text-indigo-500/10 group-hover:text-indigo-500/20 transition-colors" />

                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-12 h-12 rounded-2xl bg-${t.color}-500/10 border border-${t.color}-500/20 flex items-center justify-center text-${t.color}-500 font-black text-sm shadow-inner`}>
                                    {t.initials}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white leading-none">{t.name}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest font-black">{t.role}</p>
                                </div>
                            </div>

                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 text-amber-500 fill-current" />
                                ))}
                            </div>

                            <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed text-sm lg:text-base">
                                "{t.content}"
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
