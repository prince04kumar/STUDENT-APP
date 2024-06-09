import React, { useEffect, useState } from 'react'
import { MdAdd, MdDelete } from 'react-icons/md'
import { FaXmark } from 'react-icons/fa6'
import showToastMessage from '../Utils/toast_message';
import Nev from '../Components/Nev';
import { PieChart } from '@mui/x-charts/PieChart';

export default function Expense() {
  const [expenseRemark, setExpenseRemark] = useState("");
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [data, setData] = useState([]);
  const [summaryData, setSummaryData] = useState({});
  const [addMode, setAddMode] = useState(false);
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [date, setDate] = useState(0);
  const userID = JSON.parse(localStorage.getItem('user')).userID;

  useEffect(() => {
    const date_now = new Date();
    setYear(date_now.getFullYear());
    setMonth(date_now.getMonth() + 1);
    setDate(date_now.getDate());
    fetchExpenseData(date_now.getFullYear(), date_now.getMonth() + 1, date_now.getDate());
    fetchExpenseSummary(date_now.getFullYear(), date_now.getMonth() + 1, date_now.getDate());
  }, []);

  const addExpense = async () => {
    const expense_data = {
      userID: userID,
      amount: expenseAmount,
      remark: expenseRemark
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/expenses/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(expense_data)
      });

      if (!response.ok) {
        showToastMessage("error", response.statusText);
        throw new Error(`Error: ${response.statusText}`);
      }

      showToastMessage('success', 'Expense Added Successfully');
      fetchExpenseData(year, month, date);
      fetchExpenseSummary(year, month, date);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      showToastMessage("error", 'There was a problem adding the expense: ' + error.message);
    }
  };

  const fetchExpenseData = async (year, month, date) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/expenses/get-by-date/${userID}/${year}/${month}/${date}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      showToastMessage("error", 'There was a problem retrieving the expense data: ' + error.message);
    }
  };

  const fetchExpenseSummary = async (year, month, date) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/expenses/summary/${userID}/${year}/${month}/${date}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const summary = await response.json();
      setSummaryData(summary);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      showToastMessage("error", 'There was a problem retrieving the expense summary: ' + error.message);
    }
  };

  const deleteExpense = async (index) => {
    const confirmation = window.confirm("Are you sure you want to delete?");

    if (confirmation) {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/expenses/delete/${userID}/${year}/${month}/${date}/${index}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          showToastMessage("error", response.statusText);
          throw new Error(`Error: ${response.statusText}`);
        }

        showToastMessage('success', 'Expense Deleted Successfully');
        fetchExpenseData(year, month, date);
        fetchExpenseSummary(year, month, date);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        showToastMessage("error", 'There was a problem deleting the expense: ' + error.message);
      }
    }
  };

  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-900 font-family-karla flex sm:flex-row flex-col">
        <Nev />

        <div className="w-full overflow-x-hidden border-t flex flex-col h-[100vh] dark:border-gray-700">
          <main className="w-full flex-grow p-6">
            <h1 className="text-3xl text-black dark:text-white pb-6">Expense Manager</h1>
            <div className='flex w-full items-center justify-center bg-green-400 dark:bg-green-600 p-3 rounded text-2xl text-green-950 dark:text-green-200 cursor-pointer hover:bg-green-500 dark:hover:bg-green-700' onClick={() => {
              setAddMode(!addMode);
            }}>
              <MdAdd /> &nbsp; Add Expense
            </div><br />
            <div className='flex w-full items-center justify-center bg-gray-400 dark:bg-gray-700 p-3 rounded text-2xl text-gray-200 cursor-pointer hover:bg-gray-800'>
              <input type="date" className="outline-none bg-transparent border-none text-black dark:text-white" value={`${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`} onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                setYear(selectedDate.getFullYear());
                setMonth(selectedDate.getMonth() + 1);
                setDate(selectedDate.getDate());
                fetchExpenseData(selectedDate.getFullYear(), selectedDate.getMonth() + 1, selectedDate.getDate());
                fetchExpenseSummary(selectedDate.getFullYear(), selectedDate.getMonth() + 1, selectedDate.getDate());
              }} />
            </div>

            <div className="flex flex-wrap mt-6">
              <div className="w-full lg:w-1/2 pr-0 lg:pr-2">
                <p className="text-xl text-black dark:text-white pb-3 flex items-center">
                  <i className="fas fa-plus mr-3"></i> Reports
                </p>
                <div className="p-6 bg-white dark:bg-gray-800 dark:text-gray-300">
                  <b>Total Expense (Month)</b> : {summaryData.month?.total} ₹<br />
                  <b>Total Expense (Date: {year}-{month}-{date})</b> : {summaryData.date?.total} ₹<br />
                  <b>Overall Total Expense</b> : {summaryData.overallTotal} ₹
                </div>
              </div>
              <div className="w-full lg:w-1/2 pl-0 lg:pl-2 mt-12 lg:mt-0">
                <p className="text-xl text-black dark:text-white pb-3 flex items-center">
                  <i className="fas fa-check mr-3"></i> Representation
                </p>
                <div className="p-6 bg-white dark:bg-gray-800 flex items-center justify-center">
                  <PieChart
                    series={[
                      {
                        data: [
                          { id: 0, value: summaryData.month?.total, label: 'Total Expense (Month)', color: '#FF5733' },
                          { id: 1, value: summaryData.date?.total, label: `Total Expense (Date)`, color: '#0096FF' },
                          { id: 2, value: summaryData.overallTotal, label: "Overall Total Expense", color: '#00ff33' }
                        ],
                      },
                    ]}
                    width={500}
                    height={200}
                  />
                </div>
              </div>
            </div>

            <div className="w-full mt-12">
              <p className="text-xl text-black dark:text-white pb-3 flex items-center">
                <i className="fas fa-list mr-3"></i> Added Item
              </p>
              <div className="bg-white dark:bg-gray-800 overflow-auto p-5 dark:text-gray-300">
                {data.spendEntries && data.spendEntries.map((data_point, index_) => {
                  return <div className='w-full my-5 rounded-md flex shadow-md dark:shadow-lg dark:bg-gray-700' key={index_}>
                    <div className='flex items-center justify-center p-3 text-black dark:text-white'>
                      {data_point[0]}
                    </div>
                    <div className='w-full border-x-2 dark:border-gray-600 p-3 text-black dark:text-white'>
                      {data_point[1]}
                    </div>
                    <div className='flex items-center justify-center p-3 text-2xl text-red-600'>
                      <MdDelete onClick={() => {
                        console.log(index_)
                        deleteExpense(index_);
                      }} />
                    </div>
                  </div>
                })}
              </div>
            </div>
          </main>
        </div>
      </div>

      {addMode && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setAddMode(false)}></div>
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg z-10">
            <div className="flex justify-end">
              <FaXmark
                className="text-gray-900 dark:text-gray-200 cursor-pointer"
                onClick={() => setAddMode(false)}
              />
            </div>
            <h2 className="text-2xl text-black dark:text-white mb-4">Add Expense</h2>
            <input
              type="text"
              placeholder="Expense Remark"
              value={expenseRemark}
              onChange={(e) => setExpenseRemark(e.target.value)}
              className="w-full p-2 mb-4 border-2 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300 border-gray-300 rounded"
            />
            <input
              type="number"
              placeholder="Expense Amount"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              className="w-full p-2 mb-4 border-2 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300 border-gray-300 rounded"
            />
            <button
              onClick={() => {
                setAddMode(false);
                addExpense();
              }}
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Add Expense
            </button>
          </div>
        </div>
      )}
    </>
  )
}
