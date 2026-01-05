/**
 * journal-entry controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::journal-entry.journal-entry' as any, ({ strapi }) => ({
  // Custom route for trial balance
  async trialBalance(ctx) {
    try {
      const { startDate, endDate } = ctx.query;
      const data = await strapi.service('api::journal-entry.journal-entry').getTrialBalance(startDate, endDate);
      
      return ctx.send({
        data,
        meta: {
          totalDebit: data.reduce((sum: number, item: any) => sum + item.debit, 0),
          totalCredit: data.reduce((sum: number, item: any) => sum + item.credit, 0),
        },
      });
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  // Custom route for balance sheet
  async balanceSheet(ctx) {
    try {
      const { asOfDate } = ctx.query;
      const data = await strapi.service('api::journal-entry.journal-entry').getBalanceSheet(asOfDate);
      
      return ctx.send({ data });
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  // Override create to validate double entry
  async create(ctx) {
    const { data } = ctx.request.body;

    // Validate double entry: total debits must equal total credits
    if (data.details && Array.isArray(data.details)) {
      const totalDebit = data.details.reduce((sum: number, item: any) => sum + parseFloat(item.debit || 0), 0);
      const totalCredit = data.details.reduce((sum: number, item: any) => sum + parseFloat(item.credit || 0), 0);

      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        return ctx.badRequest('Double entry validation failed: Debits must equal Credits');
      }

      // Add totals to the entry
      data.totalDebit = totalDebit;
      data.totalCredit = totalCredit;
    }

    const response = await super.create(ctx);
    return response;
  },
}));
