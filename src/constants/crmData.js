export const dealStages = [
  { id: 'lead', name: 'Lead', color: 'bg-gray-100 text-gray-700' },
  { id: 'qualified', name: 'Qualified', color: 'bg-blue-100 text-blue-700' },
  { id: 'proposal', name: 'Proposal', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-100 text-orange-700' },
  { id: 'closed-won', name: 'Closed Won', color: 'bg-green-100 text-green-700' },
  { id: 'closed-lost', name: 'Closed Lost', color: 'bg-red-100 text-red-700' }
];

export const activityTypes = [
  { id: 'call', name: 'Phone Call', icon: 'Phone' },
  { id: 'email', name: 'Email', icon: 'Mail' },
  { id: 'meeting', name: 'Meeting', icon: 'Calendar' },
  { id: 'task', name: 'Task', icon: 'CheckSquare' },
  { id: 'note', name: 'Note', icon: 'FileText' }
];

export const contactSources = [
  'Website',
  'Social Media',
  'Email Campaign',
  'Referral',
  'Cold Call',
  'Trade Show',
  'Partner',
  'Other'
];

export const crmInitialState = {
  contacts: [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      company: 'Acme Corp',
      position: 'Marketing Director',
      source: 'Website',
      tags: ['prospect', 'enterprise'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@techflow.com',
      phone: '+1 (555) 987-6543',
      company: 'TechFlow Solutions',
      position: 'CEO',
      source: 'Referral',
      tags: ['hot-lead', 'decision-maker'],
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-22')
    },
    {
      id: '3',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'mchen@innovate.co',
      phone: '+1 (555) 456-7890',
      company: 'Innovate Co',
      position: 'CTO',
      source: 'Social Media',
      tags: ['technical', 'enterprise'],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-25')
    }
  ],
  deals: [
    {
      id: '1',
      title: 'Acme Corp - Enterprise Package',
      value: 85000,
      stage: 'proposal',
      probability: 75,
      contactId: '1',
      expectedCloseDate: new Date('2024-03-15'),
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-28')
    },
    {
      id: '2',
      title: 'TechFlow - Premium Solution',
      value: 120000,
      stage: 'negotiation',
      probability: 90,
      contactId: '2',
      expectedCloseDate: new Date('2024-02-28'),
      createdAt: new Date('2024-01-22'),
      updatedAt: new Date('2024-01-30')
    },
    {
      id: '3',
      title: 'Innovate Co - Custom Integration',
      value: 200000,
      stage: 'qualified',
      probability: 60,
      contactId: '3',
      expectedCloseDate: new Date('2024-04-30'),
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-02-01')
    }
  ],
  activities: [
    {
      id: '1',
      type: 'call',
      title: 'Discovery Call with John',
      description: 'Initial discovery call to understand requirements',
      contactId: '1',
      dealId: '1',
      dueDate: new Date('2024-02-05'),
      completed: true,
      createdAt: new Date('2024-01-20')
    },
    {
      id: '2',
      type: 'meeting',
      title: 'Product Demo for TechFlow',
      description: 'Demonstrate key features and capabilities',
      contactId: '2',
      dealId: '2',
      dueDate: new Date('2024-02-08'),
      completed: false,
      createdAt: new Date('2024-01-22')
    },
    {
      id: '3',
      type: 'email',
      title: 'Follow-up Email to Michael',
      description: 'Send technical documentation and pricing details',
      contactId: '3',
      dealId: '3',
      dueDate: new Date('2024-02-10'),
      completed: false,
      createdAt: new Date('2024-01-25')
    }
  ],
  companies: [
    {
      id: '1',
      name: 'Acme Corp',
      industry: 'Manufacturing',
      size: '500-1000',
      website: 'https://acmecorp.com',
      address: {
        street: '123 Business Ave',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA'
      },
      createdAt: new Date('2024-01-15')
    }
  ]
};