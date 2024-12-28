import React, { useState, useEffect} from 'react';
import { useTranslation } from 'react-i18next';

const CurrencyPanel = () => {
  const [exchangeRates, setExchangeRates] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch('https://api.monobank.ua/bank/currency');
        if (!response.ok) {
          throw new Error('Failed to fetch currency data');
        }
        const data = await response.json();
        
        const filteredRates = data.filter((rate) => rate.rateBuy || rate.rateSell);
        setExchangeRates(filteredRates);
        if (filteredRates.length > 0) {
            setLastUpdate(new Date(filteredRates[0].date * 1000));
        }
      } catch (error) {
        console.error('Error fetching currency data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, []);

  if (loading) return <p>Loading...</p>;

  const getCurrencyName = (code) => {
    switch (code) {
      case 980:
        return 'UAH';
      case 840:
        return 'USD';
      case 978:
        return 'EUR';
      case 985:
        return 'PLN';
      case 826:
        return 'GBP';
      case 756:
        return 'CHF';
      case 392:
        return 'JPY';
      default:
        return `Currency ${code}`;
    }
  };
  const calculateExchangeRates = () => {
    const allRelations = [];
    exchangeRates.forEach((rate) => {
      const currencyA = getCurrencyName(rate.currencyCodeA);
      const currencyB = getCurrencyName(rate.currencyCodeB);

      if (rate.rateBuy) {
        allRelations.push({
          pair: `${currencyA}/${currencyB}`,
          buy: rate.rateBuy.toFixed(4),
          sell: rate.rateSell ? rate.rateSell.toFixed(4) : 'N/A',
        });
      }
    });
    return allRelations;
  };

  const relations = calculateExchangeRates();

  return (
    <div>
        {lastUpdate && (
        <p style={{textAlign:"right"}}>{t('currency.time')}: {lastUpdate.toLocaleString()}</p>
      )}
      <table className='tableStyle'>
        <thead>
          <tr style={{backgroundColor:'rgba(3, 111, 226, 0.1)' , textAlign:'center'}}>
            <th style={{border:'1px solid #ddd', padding:'3px'}}>{t('currency.currency')}</th>
            <th style={{border:'1px solid #ddd'}}>{t('currency.buy')}</th>
            <th style={{border:'1px solid #ddd'}}>{t('currency.sell')}</th>
          </tr>
        </thead>
        <tbody>
          {relations.map((relation, index) => (
            <tr key={index} style={{backgroundColor:'rgba(0, 0, 0, 0.1)', textAlign:'center'}}>
              <td style={{border:'1px solid #ddd', padding:'3px'}}>{relation.pair}</td>
              <td style={{border:'1px solid #ddd'}}>{relation.buy}</td>
              <td style={{border:'1px solid #ddd'}}>{relation.sell}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CurrencyPanel;
