export const projectsData = [
  {
    id: 'ica',
    title: 'ICA Cheerleading Indonesia',
    year: '2024-2026',
    colorClass: 'text-blue-400',
    borderHover: 'group-hover:bg-blue-400/50',
    textHover: 'group-hover:text-blue-400',
    shortTech: 'Next.js • Supabase • Cloudflare R2 • Vercel',
    shortDesc: 'National cheerleading organization platform (indonesiancheer.org). Member registration, KTP/KK document management, admin dashboard with storage management, and monthly backup system.',
    link: 'https://indonesiancheer.org',
    image: null, 
    techStack: ['Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Cloudflare R2', 'Tailwind CSS', 'Vercel'],
    fullDescription: [
      'A comprehensive national-scale portal for the Indonesian Cheerleading Association (ICA). Designed to handle member registration across all provinces in Indonesia.',
      'The system features a robust admin dashboard for managing thousands of athlete profiles, secure storage for sensitive documents (KTP/KK) using Cloudflare R2, and automated monthly database backups.',
      'Built with Next.js and Supabase to ensure high performance and scalable data management for the growing cheerleading community in Indonesia.'
    ]
  },
  {
    id: 'dupoin',
    title: 'Dupoin HR & Finance Dashboard',
    year: '2025-2026',
    colorClass: 'text-emerald-400',
    borderHover: 'group-hover:bg-emerald-400/50',
    textHover: 'group-hover:text-emerald-400',
    shortTech: 'React • PostgreSQL • Docker • Lark API • Xero API • Prisma',
    shortDesc: 'Enterprise internal dashboard for financial tracking — Income, Expense, P&L, Deposit/Withdrawal, Sales Funnel, IPO datasets, and Multilateral trading.',
    link: null,
    image: null,
    techStack: ['React', 'Next.js App Router', 'PostgreSQL', 'Prisma ORM', 'Docker', 'Lark Suite API', 'Xero Accounting API', 'amCharts 5', 'Tailwind CSS'],
    fullDescription: [
      'An enterprise-grade internal dashboard built for financial and HR operations. This platform serves as a central hub connecting multiple enterprise tools.',
      'Features complex financial visualizations including amCharts Sankey diagrams for cash flow, funnel charts for sales tracking, and dual-axis charts for multilateral trading volume.',
      'Deeply integrated with Lark Suite for HR data (syncing employee profiles, recruitment, and onboarding) and Xero for real-time accounting data sync. Includes bulk CSV import tools and automated ZIP/PDF report generation.'
    ]
  },
  {
    id: 'crown-ai',
    title: 'Crown Sponsorship AI',
    year: '2026',
    colorClass: 'text-pink-400',
    borderHover: 'group-hover:bg-pink-400/50',
    textHover: 'group-hover:text-pink-400',
    shortTech: 'Node.js • DeepSeek V3 AI • Puppeteer • Express',
    shortDesc: 'AI-powered sponsorship proposal generator for Crown Allstar. Custom LLM prompts generate brand-specific content per industry. PDF generation via Puppeteer.',
    link: null,
    image: null,
    techStack: ['Node.js', 'Express', 'DeepSeek V3 LLM', 'Puppeteer', 'Tailwind CSS', 'JSON DB'],
    fullDescription: [
      'A cutting-edge generative AI tool built to automate sponsorship proposal creation for a 15x National Champion cheerleading team.',
      'By leveraging DeepSeek V3 AI, the system takes a brand name and industry, then generates highly customized pitch copy — outlining specific partnership angles, tailored equipment requests, and sponsorship tier adjustments.',
      'The generated content is then rendered into a pixel-perfect HTML template and converted to a high-quality PDF using headless Chromium via Puppeteer, saving hours of manual proposal drafting.'
    ]
  },
  {
    id: 'crownhub',
    title: 'CrownHub (Crown Allstar App)',
    year: '2024-2026',
    colorClass: 'text-amber-400',
    borderHover: 'group-hover:bg-amber-400/50',
    textHover: 'group-hover:text-amber-400',
    shortTech: 'Next.js • Firebase/Firestore • Vercel • Google Auth',
    shortDesc: 'Team management platform for Crown Allstar cheerleading. Weight tracking, training schedule management, attendance system with GPS check-in.',
    link: 'https://crownallstar.com',
    image: null,
    techStack: ['Next.js', 'React', 'Firebase', 'Cloud Firestore', 'Google Authentication', 'Tailwind CSS', 'Vercel'],
    fullDescription: [
      'The central nervous system for Crown Allstar athletes and management. A mobile-first web application designed for daily team operations.',
      'Key features include rigorous weight tracking (crucial for cheerleading stunting safety), a GPS-enabled attendance system for training sessions, and comprehensive athlete profiles.',
      'Currently actively used by 35+ national-level athletes weekly to track their progress and coordinate training schedules ahead of major championships.'
    ]
  },
  {
    id: 'mbg',
    title: 'MBG Registration Dashboard',
    year: '2025',
    colorClass: 'text-violet-400',
    borderHover: 'group-hover:bg-violet-400/50',
    textHover: 'group-hover:text-violet-400',
    shortTech: 'Next.js • PostgreSQL • Docker',
    shortDesc: '2-step event registration system with payment modal, bank account management, bukti bayar upload, ticket quota with race-condition safe locking.',
    link: null,
    image: null,
    techStack: ['Next.js', 'PostgreSQL', 'Raw SQL', 'Docker', 'Tailwind CSS'],
    fullDescription: [
      'A high-concurrency event registration platform designed to handle sudden spikes in traffic during ticket sales.',
      'Features a secure 2-step registration flow with integrated payment proof uploading. The backend utilizes raw PostgreSQL queries with FOR UPDATE row-level locking to completely prevent ticket overselling.',
      'Includes a comprehensive admin panel for manual payment verification and real-time statistics tracking for event Persons In Charge (PIC).'
    ]
  },
  {
    id: 'launchpad',
    title: 'Launchpad (Deploy Dashboard)',
    year: '2026',
    colorClass: 'text-cyan-400',
    borderHover: 'group-hover:bg-cyan-400/50',
    textHover: 'group-hover:text-cyan-400',
    shortTech: 'Next.js • PM2 • SSE • Tailwind',
    shortDesc: 'Custom deployment dashboard for managing multiple VPS applications. One-click restart/rebuild with real-time SSE build logs.',
    link: 'https://launchpad.gorillaworkout.id',
    image: null,
    techStack: ['Next.js', 'Node.js', 'PM2 API', 'Server-Sent Events (SSE)', 'Bash Scripting', 'Tailwind CSS'],
    fullDescription: [
      'A custom-built DevOps control panel designed to replace complex terminal commands for managing multiple applications on a single VPS.',
      'Interfaces directly with the PM2 API to monitor, restart, and stop Node.js processes. Features real-time log streaming using Server-Sent Events (SSE) directly to the browser during application rebuilds.',
      'Significantly streamlines the deployment workflow for all personal and client projects hosted on the Oracle Cloud infrastructure.'
    ]
  },
  {
    id: 'undangan',
    title: 'Undangan Nikah SaaS',
    year: '2025',
    colorClass: 'text-rose-400',
    borderHover: 'group-hover:bg-rose-400/50',
    textHover: 'group-hover:text-rose-400',
    shortTech: 'Next.js • GitHub',
    shortDesc: 'Wedding invitation SaaS platform with customizable templates, RSVP management, and guest tracking system.',
    link: null,
    image: null,
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion'],
    fullDescription: [
      'A modern Software-as-a-Service platform for creating digital wedding invitations.',
      'Users can select from multiple premium templates, customize their event details, and manage digital RSVPs in real-time.',
      'Features smooth page transitions, interactive galleries, and a mobile-optimized viewing experience for guests.'
    ]
  }
]
