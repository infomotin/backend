import type { Schema, Struct } from '@strapi/strapi';

export interface FinanceJournalItem extends Struct.ComponentSchema {
  collectionName: 'components_finance_journal_items';
  info: {
    description: 'Individual line item for a journal entry';
    displayName: 'Journal Item';
  };
  attributes: {
    account: Schema.Attribute.Relation<
      'oneToOne',
      'api::chart-of-account.chart-of-account'
    >;
    credit: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    debit: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    description: Schema.Attribute.String;
  };
}

export interface SalesSalesItem extends Struct.ComponentSchema {
  collectionName: 'components_sales_sales_items';
  info: {
    displayName: 'Sales Item';
    icon: 'shopping-basket';
  };
  attributes: {
    discount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    product: Schema.Attribute.Relation<'oneToOne', 'api::product.product'>;
    quantity: Schema.Attribute.Decimal & Schema.Attribute.Required;
    total: Schema.Attribute.Decimal & Schema.Attribute.Required;
    unitPrice: Schema.Attribute.Decimal & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'finance.journal-item': FinanceJournalItem;
      'sales.sales-item': SalesSalesItem;
    }
  }
}
