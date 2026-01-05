/**
 * journal-entry router
 */

export default {
  routes: [
    // Custom routes MUST come first
    {
      method: 'GET',
      path: '/journal-entries/trial-balance',
      handler: 'api::journal-entry.journal-entry.trialBalance',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/journal-entries/balance-sheet',
      handler: 'api::journal-entry.journal-entry.balanceSheet',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    // Default CRUD routes
    {
      method: 'GET',
      path: '/journal-entries',
      handler: 'api::journal-entry.journal-entry.find',
    },
    {
      method: 'GET',
      path: '/journal-entries/:id',
      handler: 'api::journal-entry.journal-entry.findOne',
    },
    {
      method: 'POST',
      path: '/journal-entries',
      handler: 'api::journal-entry.journal-entry.create',
    },
    {
      method: 'PUT',
      path: '/journal-entries/:id',
      handler: 'api::journal-entry.journal-entry.update',
    },
    {
      method: 'DELETE',
      path: '/journal-entries/:id',
      handler: 'api::journal-entry.journal-entry.delete',
    },
  ],
};
