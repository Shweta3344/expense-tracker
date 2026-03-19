import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import ExpenseList from './pages/ExpenseList';
import EditExpense from './pages/EditExpense';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="add" element={<AddExpense />} />
        <Route path="expenses" element={<ExpenseList />} />
        <Route path="expenses/edit/:id" element={<EditExpense />} />
      </Route>
    </Routes>
  );
}

export default App;