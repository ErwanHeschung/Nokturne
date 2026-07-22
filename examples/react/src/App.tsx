import { useTheme } from 'nokturne/react';

export default function App() {
  const { theme, resolvedTheme, systemTheme, setTheme, toggle } = useTheme();

  return (
    <main>
      <h1>Nokturne + React</h1>
      <p>choice: <strong>{theme}</strong></p>
      <p>resolved: <strong>{resolvedTheme}</strong></p>
      <p>system: <strong>{systemTheme}</strong></p>
      <div className="row">
        <button onClick={() => setTheme('light')}>Light</button>
        <button onClick={() => setTheme('dark')}>Dark</button>
        <button onClick={() => setTheme('system')}>System</button>
        <button onClick={toggle}>Toggle</button>
      </div>
    </main>
  );
}
