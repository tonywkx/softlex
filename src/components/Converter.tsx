import React, { useState, useEffect } from "react";
import { API_KEY } from "../constants/constants";

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState("");
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "USD"
  );
  const [rate, setRate] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoadingConversion, setIsLoadingConversion] = useState(false);

  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency");
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        setIsLoadingConversion(true);
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${currency}`
        );
        const data = await response.json();
        if (response.ok) {
          setRate(data.conversion_rates.RUB);
          const availableCurrencies = Object.keys(data.conversion_rates);
          setCurrencies(availableCurrencies);
          setIsLoadingConversion(false);
          setIsLoading(false);
        } else {
          setError("Не удалось загрузить обменные курсы.");
        }
      } catch (error) {
        setError("Ошибка при загрузке обменных курсов.");
      }
    };

    fetchExchangeRate();
  }, [currency]);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleCurrencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedCurrency = event.target.value;
    setCurrency(selectedCurrency);
    localStorage.setItem("currency", selectedCurrency);
  };

  const convertCurrency = (): string => {
    if (!amount || isNaN(parseFloat(amount))) {
      return "0.00";
    }
    return (parseFloat(amount) * rate).toFixed(2);
  };

  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-1/2 w-1/2 bg-slate-300 rounded-md">
      <h1 className="text-3xl font-bold mb-6">Конвертер валют</h1>
      <div className="mb-4">
        <label htmlFor="amount" className="block mb-2">
          Сумма:
        </label>
        <input
          type="text"
          id="amount"
          className="border border-gray-300 rounded p-2"
          value={amount}
          onChange={handleAmountChange}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="currency" className=" mb-2 mr-2">
          Валюта:
        </label>
        <select
          id="currency"
          className="border border-gray-300 rounded p-2 w-32"
          value={currency}
          onChange={handleCurrencyChange}
        >
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
      </div>
      <span className="text-lg">Результат:</span>
      <div>
        <p className="text-2xl font-bold bg-white p-4 rounded-md">
          {isLoadingConversion ? "Loading..." : convertCurrency()} RUB
        </p>
      </div>
      {error && (
        <div className="text-center mt-8 text-red-500">Error: {error}</div>
      )}
    </div>
  );
};

export default CurrencyConverter;
