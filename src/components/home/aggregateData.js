const aggregateDataByCategory = () => {
    const data = {
      totalSpent: 0,
      transactionCount: {},
      averageSpent: {}
    };
  
    transactions.forEach(transaction => {
      const category = getCategoryName(transaction.category);
      const amount = parseFloat(transaction.amount);
      data.totalSpent += amount;
  
      if (!data.transactionCount[category]) {
        data.transactionCount[category] = 0;
      }
      data.transactionCount[category]++;
  
      if (!data.averageSpent[category]) {
        data.averageSpent[category] = 0;
      }
      data.averageSpent[category] += amount;
    });
  
    // Calculate average spent per category
    Object.keys(data.averageSpent).forEach(category => {
      data.averageSpent[category] /= data.transactionCount[category];
    });
  
    return data;
  };
  export default aggregateDataByCategory;