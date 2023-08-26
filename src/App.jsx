import { useEffect, useState } from "react";


const App = () => {
  const [amount, setAmount]               = useState('1');
  const [fromCurrency, setFromCurrency]   = useState('EUR');
  const [toCurrency, setToCurrency]       = useState('USD');
  const [convertedAmt, setConvertedAmt]   = useState('');
  const [isLoading, setIsLoading]         = useState(false);
  const [isError, setIsError]             = useState('');

  useEffect(() => {
    const controller    = new AbortController();

    const getConverter  = async () => {
      try {
        setIsLoading(true);
        setIsError('');
        const response  = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`, {
          signal: controller.signal
        });

        if(!response.ok) throw new Error("Something went wrong calculating exchange! Please try again!");

        const data      = await response.json();
        setConvertedAmt(data.rates[toCurrency]);
      } catch(error) {
        if(error.name !== "AbortError") {
          setIsError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if(fromCurrency === toCurrency) return setConvertedAmt(amount);
    getConverter();
  
    return () => {
      controller.abort();
    }
  }, [amount, fromCurrency, toCurrency])

  return (
    <>
      <div className="mx-auto mt-4 w-[500px] rounded-md border-[1px] border-blue-300 bg-[#FFF] px-4">
        <h2 className="py-4 text-center text-[22px] font-normal text-[#245b9a]">Currency Converter</h2>

        <div className="grid w-[100%] grid-cols-3 py-2 text-sm">
          <div className="px-5 py-1.5 text-right">From :</div>
          <div className="col-span-2">
            <select 
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-[80%] rounded border-[1px] border-[#e6e6e6] bg-white py-2 text-center"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="CAD">CAD</option>
              <option value="INR">INR</option>
              <option value="SGD">SGD</option>
              <option value="GBP">GBP</option>
              <option value="PHP">PHP</option>
              <option value="THB">THB</option>
            </select>
          </div>
        </div>

        <div className="grid w-[100%] grid-cols-3 py-2 text-sm">
          <div className="px-5 py-1.5 text-right">To :</div>
          <div className="col-span-2">
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-[80%] rounded border-[1px] border-[#e6e6e6] bg-white py-2 text-center"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="CAD">CAD</option>
              <option value="INR">INR</option>
              <option value="SGD">SGD</option>
              <option value="GBP">GBP</option>
              <option value="PHP">PHP</option>
              <option value="THB">THB</option>
            </select>
          </div>
        </div>

        <div className="grid w-[100%] grid-cols-3 py-2 text-sm">
          <div className="px-5 py-1.5 text-right">Amount :</div>
          <div className="col-span-2">
            <input 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="text" 
              className="w-[80%] rounded border-[1px] border-[#e6e6e6] bg-white py-2 text-center"
            />
          </div>
        </div>

        {isLoading && <p className="text-center py-5 text-xl font-semibold text-gray-600">Loading...</p>}
        
        {!isLoading && !isError && 
          <h1 className="py-5 text-center text-3xl font-semibold text-blue-600">
          {convertedAmt} {toCurrency}
          </h1>
        }

        {isError && <p className="text-center py-5 text-xl font-semibold text-red-500">{isError}</p>}
      </div>
    </>
  );
}

export default App