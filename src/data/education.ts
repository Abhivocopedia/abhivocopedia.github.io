export interface EducationStation {
  id: string
  label: string
  institution: string
  details: string[]
  period: string
  color: string
  isCurrent?: boolean
}

export const education: EducationStation[] = [
  {
    id: 'sslc',
    label: 'SSLC',
    institution: 'Government High School, Siddapura',
    details: ['91.03%'],
    period: 'Completed',
    color: '#72784E'
  },
  {
    id: 'puc',
    label: 'PUC',
    institution: 'Excellent P U College, Sunnari, Kundapura',
    details: ['76%'],
    period: 'Completed',
    color: '#A9493E'
  },
  {
    id: 'ece',
    label: 'ECE ENGINEERING',
    institution: 'SMVITM, Bantakal, Udupi — VTU',
    details: ['Electronics & Communication Engineering', '2025–2026'],
    period: '2025–2026',
    color: '#2C7C7A'
  },
  {
    id: 'cse',
    label: 'CSE ENGINEERING',
    institution: 'Jain Institute of Technology, Davangere — VTU',
    details: [
      'Computer Science and Engineering',
      '2026–Present',
      '3rd Semester',
      'Expected Graduation: 2029'
    ],
    period: '2026–Present',
    color: '#274D3A',
    isCurrent: true
  }
]