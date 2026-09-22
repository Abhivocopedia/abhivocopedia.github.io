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
    liveUrl: 'https://genesis-lab-nu.vercel.app',
    githubUrl: 'ADD LINK',
    color: '#274D3A',
    featured: true
  },
  {
    id: 'feelsafe',
    number: '02',
    category: 'WEB APPLICATION',
    title: 'FeelSafe',
    description: 'Anonymous feedback platform designed to let people share honest feedback without revealing their identity.',
    tech: ['Next.js', 'TypeScript', 'Supabase', 'SQL', 'Vercel'],
    liveUrl: 'https://feelsafe-sigma.vercel.app',
    githubUrl: 'ADD LINK',
    color: '#6B2C2C',
    featured: true
  },
  {
    id: 'janani-stores',
    number: '03',
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
    number: '04',
    category: 'FULL-STACK',
    title: 'Nritya Vidyanilaya',
    description: 'Dance-school management web application for administration and student workflows.',
    tech: ['React', 'Django', 'PostgreSQL', 'AWS'],
    liveUrl: 'https://nrityadvg.vercel.app',
    githubUrl: 'ADD LINK',
    color: '#2C7C7A',
    featured: true
  }
]
