export interface SkillCategory {
  number: string
  category: string
  technologies: string[]
  description: string
  color: string
}

export const skills: SkillCategory[] = [
  {
    number: '01',
    category: 'LANGUAGES',
    technologies: ['Python', 'Java', 'JavaScript', 'TypeScript', 'HTML', 'CSS'],
    description: 'Core programming languages used across web, systems, and AI projects.',
    color: '#E0AE3E'
  },
  {
    number: '02',
    category: 'FRONTEND',
    technologies: ['React'],
    description: 'Modern component-driven UI development with TypeScript.',
    color: '#2C7C7A'
  },
  {
    number: '03',
    category: 'BACKEND',
    technologies: ['Node.js', 'Express', 'Django', 'FastAPI'],
    description: 'API design, server-side logic, and microservice architectures.',
    color: '#C85C38'
  },
  {
    number: '04',
    category: 'DATA',
    technologies: ['MongoDB', 'Supabase'],
    description: 'Document and relational data modeling, realtime subscriptions.',
    color: '#72784E'
  },
  {
    number: '05',
    category: 'INFRASTRUCTURE',
    technologies: ['Docker', 'Nginx', 'PM2', 'AWS', 'Cloud Deployment'],
    description: 'Containerization, reverse proxy, process management, cloud hosting.',
    color: '#A9493E'
  },
  {
    number: '06',
    category: 'AI / COMPUTER VISION',
    technologies: ['OpenCV', 'PyTorch', 'Machine Learning'],
    description: 'Computer vision pipelines, model training, inference optimization.',
    color: '#274D3A'
  },
  {
    number: '07',
    category: 'DEVELOPER TOOLS',
    technologies: ['Git', 'GitHub', 'REST APIs', 'Authentication'],
    description: 'Version control, API design, auth systems, CI/CD workflows.',
    color: '#E0AE3E'
  }
]