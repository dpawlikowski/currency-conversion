import CurrencyConverter from './components/CurrencyConverter'

const App = () => (
  <main className="mx-auto max-w-xl px-4 py-12">
    <h1 className="mb-6 text-2xl font-medium">Currency Converter</h1>
    <CurrencyConverter />
    <p className="mt-4 text-xs text-muted-foreground">
      Rates provided by{' '}
      <a href="https://currencybeacon.com" className="underline">
        CurrencyBeacon
      </a>
    </p>
  </main>
)

export default App
