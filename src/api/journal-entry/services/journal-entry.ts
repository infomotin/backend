/**
 * journal-entry service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::journal-entry.journal-entry' as any, ({ strapi }) => ({
  // Custom method to calculate trial balance
  async getTrialBalance(startDate?: string, endDate?: string) {
    const filters: any = {};
    if (startDate) filters.entryDate = { $gte: startDate };
    if (endDate) filters.entryDate = { $lte: endDate };

    const entries = await strapi.entityService.findMany('api::journal-entry.journal-entry', {
      filters,
      populate: ['details', 'details.account'],
    });

    const balances: any = {};

    entries.forEach((entry: any) => {
      entry.details?.forEach((detail: any) => {
        const accountId = detail.account?.documentId || detail.account?.id;
        const accountName = detail.account?.name || 'Unknown';
        const accountCode = detail.account?.code || '';

        if (!balances[accountId]) {
          balances[accountId] = {
            code: accountCode,
            name: accountName,
            debit: 0,
            credit: 0,
          };
        }

        balances[accountId].debit += parseFloat(detail.debit || 0);
        balances[accountId].credit += parseFloat(detail.credit || 0);
      });
    });

    return Object.values(balances);
  },

  // Custom method to generate balance sheet
  async getBalanceSheet(asOfDate?: string) {
    const accounts = await strapi.entityService.findMany('api::chart-of-account.chart-of-account', {
      filters: {},
    });

    const trialBalance = await this.getTrialBalance(undefined, asOfDate);
    const balanceMap = new Map();
    
    trialBalance.forEach((item: any) => {
      balanceMap.set(item.code, item);
    });

    const assets: any[] = [];
    const liabilities: any[] = [];
    const equity: any[] = [];

    accounts.forEach((account: any) => {
      const balance = balanceMap.get(account.code) || { debit: 0, credit: 0 };
      const netBalance = balance.debit - balance.credit;

      const item = {
        code: account.code,
        name: account.name,
        balance: Math.abs(netBalance),
      };

      if (account.type === 'Asset') {
        assets.push(item);
      } else if (account.type === 'Liability') {
        liabilities.push(item);
      } else if (account.type === 'Equity') {
        equity.push(item);
      }
    });

    const totalAssets = assets.reduce((sum, a) => sum + a.balance, 0);
    const totalLiabilities = liabilities.reduce((sum, l) => sum + l.balance, 0);
    const totalEquity = equity.reduce((sum, e) => sum + e.balance, 0);

    return {
      assets,
      liabilities,
      equity,
      totalAssets,
      totalLiabilities,
      totalEquity,
    };
  },
}));
