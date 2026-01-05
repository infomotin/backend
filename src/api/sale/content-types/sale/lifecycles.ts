
export default {
  async afterCreate(event) {
    const { result, params } = event;

    // Only process if it's a sale for a customer
    if (result.customer && result.status === 'Completed') {
      try {
        // Fetch customer with their category and wallet
        const customer = await strapi.documents('api::customer.customer').findOne({
          documentId: result.customer.documentId,
          populate: ['customerCategory', 'coinWallet'],
        });

        // Check if customer category allows coins
        if (customer?.customerCategory?.eligibleForCoins) {
          const coinAmount = Math.floor(result.grandTotal / 100); // 1 coin per 100 currency units

          if (coinAmount > 0) {
            if (customer.coinWallet) {
              // Update existing wallet
              await strapi.documents('api::coin-wallet.coin-wallet').update({
                documentId: customer.coinWallet.documentId,
                data: {
                  balance: (customer.coinWallet.balance || 0) + coinAmount,
                },
              });
            } else {
              // Create new wallet
              await strapi.documents('api::coin-wallet.coin-wallet').create({
                data: {
                  balance: coinAmount,
                  customer: customer.documentId,
                },
              });
            }
            console.log(`Added ${coinAmount} coins to customer ${customer.name}`);
          }
        }
      } catch (err) {
        console.error('Error adding coins to customer:', err);
      }
    }
  },

  async afterUpdate(event) {
    const { result, params } = event;

    // Re-check if status just changed to 'Completed'
    if (result.customer && result.status === 'Completed') {
        // We might need to check previous state if we want to avoid double adding, 
        // but for a simple implementation, we'll assume the user manages status carefully.
        // In a real app, you'd check if coins were already awarded for this invoiceNo.
    }
  }
};
