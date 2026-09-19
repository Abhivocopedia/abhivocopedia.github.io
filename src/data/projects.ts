export interface Project {
  id: string
  number: string
  category: string
  title: string
  description: string
  tech: string[]
  liveUrl?: string
  githubUrl?: string
  color: string
  featured?: boolean
  contribution?: string
  team?: string
  award?: string
}

export const projects: Project[] = [
  {
    id: 'genesis',
    number: '01',
    category: 'EXPERIMENTAL',
    title: 'Genesis',
    description: 'Experimental engineering project focused on building and exploring a modern digital product.',
    tech: ['React', 'TypeScript', 'Node.js', 'Docker'],
    liveUrl: 'https://genesis-lab.vercel.app',
    githubUrl: 'ADD LINK',
    color: '#274D3A',
    featured: true
  },
  {
    id: 'janani-stores',
    number: '02',
    category: 'FULL-STACK',
    title: 'Janani Stores',
    description: 'Online ordering and self-pickup platform with product availability, ordering, payments, and admin workflows.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Supabase'],
    liveUrl: 'https://janani-stores.vercel.app',
    githubUrl: 'ADD LINK',
    color: '#E0AE3E',
    featured: true
  },
  {
    id: 'nritya-vidyanilaya',
    number: '03',
    category: 'FULL-STACK',
    title: 'Nritya Vidyanilaya',
    description: 'Dance-school management web application for administration and student workflows.',
    tech: ['React', 'Django', 'PostgreSQL', 'AWS'],
    liveUrl: 'https://nrityadvg.vercel.app',
    githubUrl: 'ADD LINK',
    color: '#2C7C7A',
    featured: true
  },
  {
    id: 'nova-assistant',
    number: '04',
    category: 'AI / SYSTEMS',
    title: 'Nova Assistant',
    description: 'Personal AI assistant concept for PC interaction, speech, memory, and automation.',
    tech: ['Python', 'FastAPI', 'PyTorch', 'OpenCV', 'WebSockets'],
    liveUrl: undefined,
    githubUrl: 'ADD LINK',
    color: '#171717',
    featured: true
  },
  {
    id: 'weighnix',
    number: '05',
    category: 'HARDWARE + CLOUD',
    title: 'Weighnix',
    description: 'Smart Home Cylinder Management System — DSU DevHack 2.0 Vultr Best Build.',
    tech: ['C++', 'Python', 'AWS', 'Docker', 'MQTT', 'React'],
    liveUrl: 'ADD LINK',
    githubUrl: 'ADD LINK',
    color: '#C85C38',
    featured: true,
    contribution: 'Hardware Development + Cloud Assistance',
    team: 'TheAPIcalypse',
    award: 'DSU DevHack 2.0 — Vultr Best Build'
  }
]