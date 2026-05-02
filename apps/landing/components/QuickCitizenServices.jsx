import React from 'react';
import { 
  GraduationCap, 
  HandCoins, 
  ShieldCheck, 
  HeartPulse, 
  Lightbulb, 
  Briefcase, 
  Home, 
  Suitcase, 
  Scale, 
  BrainCircuit, 
  BookOpen, 
  CreditCard 
} from 'lucide-react';

const services = [
  { name: 'APPLY NSFAS', icon: GraduationCap, color: 'text-emerald-400', url: 'https://www.nsfas.org.za/' },
  { name: 'SASSA GRANTS', icon: HandCoins, color: 'text-amber-400', url: 'https://srd.sassa.gov.za/' },
  { name: 'VERIFY INSTITUTION', icon: ShieldCheck, color: 'text-blue-400', url: 'https://www.dhet.gov.za/' },
  { name: 'FIND A CLINIC', icon: HeartPulse, color: 'text-rose-400', url: 'https://www.health.gov.za/' },
  { name: 'SKILLS & COURSES', icon: Lightbulb, color: 'text-yellow-400', url: 'https://www.dhet.gov.za/' },
  { name: 'JOB OPPORTUNITIES', icon: Briefcase, color: 'text-purple-400', url: 'https://www.gov.za/services/services-residents/employment' },
  { name: 'RDP HOUSING', icon: Home, color: 'text-orange-400', url: 'https://www.dhs.gov.za/' },
  { name: 'UIF BENEFITS', icon: Suitcase, color: 'text-cyan-400', url: 'https://www.ufiling.co.za/' },
  { name: 'LEGAL AID', icon: Scale, color: 'text-indigo-400', url: 'https://legal-aid.co.za/' },
  { name: 'MENTAL HEALTH', icon: BrainCircuit, color: 'text-pink-400', url: 'https://www.sadag.org/' },
  { name: 'BURSARIES', icon: BookOpen, color: 'text-teal-400', url: 'https://www.bursaries-southafrica.co.za/' },
  { name: 'ID & PASSPORT', icon: CreditCard, color: 'text-lime-400', url: 'https://www.dha.gov.za/' },
];

export default function QuickCitizenServices() {
  return (
    <section className="py-12 px-4 bg-[#0a0f18]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-8">
          QUICK CITIZEN SERVICES
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {services.map((service) => (
            <a
              key={service.name}
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-6 bg-[#161d29] border border-gray-800 rounded-xl hover:border-gray-600 transition-all group"
            >
              <div className={`p-3 rounded-lg bg-[#1c2636] mb-4 group-hover:scale-110 transition-transform ${service.color}`}>
                <service.icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-gray-300 text-center tracking-tight">
                {service.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
