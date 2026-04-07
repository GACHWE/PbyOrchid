import React from 'react';
import { motion } from 'motion/react';

export default function AnalyticsCard({ title, value, icon: Icon, trend, color = 'purple' }) {
  const colorClasses = {
    purple: 'text-primary-accent bg-primary-accent/10 border-primary-accent/20',
    pink: 'text-secondary-accent bg-secondary-accent/10 border-secondary-accent/20',
    green: 'text-tertiary-accent bg-tertiary-accent/10 border-tertiary-accent/20',
    orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-app-card border border-app-border p-6 rounded-2xl flex items-center justify-between"
      data-aos="fade-up"
    >
      <div>
        <p className="text-app-text-muted text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black tracking-tighter">{value}</h3>
        {trend && (
          <p className={`text-xs font-bold mt-2 ${trend.startsWith('+') ? 'text-tertiary-accent' : 'text-secondary-accent'}`}>
            {trend} <span className="text-app-text-muted">vs last month</span>
          </p>
        )}
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${colorClasses[color]}`}>
        <Icon size={28} />
      </div>
    </motion.div>
  );
}
