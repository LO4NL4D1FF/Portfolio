/**
 * The bank role, described in general terms only: no bank name, no system
 * names, no client or internal data.
 */
export const dayJob = {
  title: 'By day, I build software for a bank.',
  intro:
    'I work on internal software at a commercial bank in Monrovia. It is where I learned that quiet, reliable systems are the hardest ones to get right: nobody notices them until they stop working.',
  roles: [
    {
      name: 'Back-office tools',
      detail: 'Screens staff use to prepare, check and track loan documents, replacing paper forms and scattered spreadsheets.',
    },
    {
      name: 'Backend services and APIs',
      detail: 'The services behind those tools, including an API that lets customers subscribe to SMS alerts.',
    },
    {
      name: 'Automation',
      detail: 'Scripts that take repetitive document and cheque-processing work off people’s desks.',
    },
    {
      name: 'Training and support',
      detail: 'Written guides and hands-on sessions that help colleagues move onto new systems with confidence.',
    },
  ],
  note: 'Client data, internal names and anything confidential stay at the bank. What is here is described in general terms on purpose.',
};
