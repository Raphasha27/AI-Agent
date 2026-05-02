import React from 'react';

const ServicePillars = () => {
  const services = [
    {
      title: "Call Handling & Routing",
      desc: "Smart inbound/outbound flows that handle calls with human-like precision.",
      icon: "📞"
    },
    {
      title: "Lead Qualification",
      desc: "Automated screening to ensure your clients only talk to ready-to-buy prospects.",
      icon: "🎯"
    },
    {
      title: "Appointment Booking",
      desc: "Direct integration with Calendly, GCal, and Outlook for seamless scheduling.",
      icon: "📅"
    },
    {
      title: "CRM & Workflow Sync",
      desc: "Native push/pull with HubSpot, Salesforce, GoHighLevel, and Zapier.",
      icon: "🔄"
    },
    {
      title: "Prompt Engineering",
      desc: "Highly optimized, persona-driven prompts that sound natural and close deals.",
      icon: "🧠"
    },
    {
      title: "Backend White-Label",
      desc: "I handle the build, you handle the client. Reliable, scalable, and discrete.",
      icon: "🛡️"
    },
    {
      title: "n8n Workflow Engineering",
      desc: "Custom automations built to solve REAL problems, not just for the sake of it.",
      icon: "⚙️"
    },
    {
      title: "Intelligent LinkedIn Outreach",
      desc: "Find and engage founders & decision-makers with Claude-powered personalization.",
      icon: "🤝"
    },
    {
      title: "SOP & Action Plan Engineering",
      desc: "Turn complex PDFs and transcripts into automated action plans and team SOPs.",
      icon: "📋"
    }
  ];

  return (
    <section id="services" className="py-24 bg-slate-950">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <div 
              key={i} 
              className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800/50 hover:border-orange-500/30 transition-all hover:translate-y-[-4px] group"
            >
              <div className="text-4xl mb-6">{s.icon}</div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors">
                {s.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicePillars;
