import React, { useEffect, useState } from 'react'
import { MdAdd, MdDelete } from 'react-icons/md'
import { FaXmark } from 'react-icons/fa6'
import showToastMessage from '../Utils/toast_message';
import Nev from '../Components/Nev';
import { PieChart } from '@mui/x-charts/PieChart';

export default function Borrow() {
  const [borrowRemark, setBorrowRemark] = useState("");
  const [borrowAmount, setBorrowAmount] = useState(0);
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
    getBorrowData(date_now.getFullYear(), date_now.getMonth() + 1, date_now.getDate());
    getBorrowDataSummary(date_now.getFullYear(), date_now.getMonth() + 1, date_now.getDate());
  }, []);

  const addBorrow = async () => {
    const borrow_data = {
      userID: userID,
      amount: borrowAmount,
      remark: borrowRemark
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/borrow/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(borrow_data)
      });

      if (!response.ok) {
        showToastMessage("error", response.statusText);
        throw new Error(`Error: ${response.statusText}`);
      }

      showToastMessage('success', 'Borrow Added Successfully');
      getBorrowData(year, month, date);
      getBorrowDataSummary(year, month, date);
      setAddMode(!addMode)
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      showToastMessage("error", 'There was a problem adding the borrow: ' + error.message);
    }
  };

  const getBorrowData = async (year, month, date) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/borrow/get-by-date/${userID}/${year}/${month}/${date}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      showToastMessage("error", 'There was a problem retrieving the borrow data: ' + error.message);
    }
  };

  const getBorrowDataSummary = async (year, month, date) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/borrow/summary/${userID}/${year}/${month}/${date}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const summary = await response.json();
      setSummaryData(summary);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      showToastMessage("error", 'There was a problem retrieving the borrow summary: ' + error.message);
    }
  };

  const delBorrow = async (index) => {
    const confirmation = window.confirm("Are you sure you want to delete?");

    if (confirmation) {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/borrow/delete/${userID}/${year}/${month}/${date}/${index}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          showToastMessage("error", response.statusText);
          throw new Error(`Error: ${response.statusText}`);
        }

        showToastMessage('success', 'Borrow Deleted Successfully');
        getBorrowData(year, month, date);
        getBorrowDataSummary(year, month, date);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        showToastMessage("error", 'There was a problem deleting the borrow: ' + error.message);
      }
    }
  };

  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-900 font-family-karla flex sm:flex-row flex-col">
        <Nev />

        <div className="w-full overflow-x-hidden border-t flex flex-col h-[100vh] dark:border-gray-700">
          <main className="w-full flex-grow p-6">
            <h1 className="text-3xl text-black dark:text-white pb-6">Borrow Manager</h1>
            <div className='flex w-full items-center justify-center bg-green-400 dark:bg-green-600 p-3 rounded text-2xl text-green-950 dark:text-green-200 cursor-pointer hover:bg-green-500 dark:hover:bg-green-700' onClick={() => {
              setAddMode(!addMode);
            }}>
              <MdAdd /> &nbsp; Add Borrow
            </div><br />
            <div className='flex w-full items-center justify-center bg-gray-400 dark:bg-gray-700 p-3 rounded text-2xl text-gray-200 cursor-pointer hover:bg-gray-800'>
              <input type="date" className="outline-none bg-transparent border-none text-black dark:text-white" value={`${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`} onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                setYear(selectedDate.getFullYear());
                setMonth(selectedDate.getMonth() + 1);
                setDate(selectedDate.getDate());
                getBorrowData(selectedDate.getFullYear(), selectedDate.getMonth() + 1, selectedDate.getDate());
                getBorrowDataSummary(selectedDate.getFullYear(), selectedDate.getMonth() + 1, selectedDate.getDate());
              }} />
            </div>

            <div className="flex flex-wrap mt-6">
              <div className="w-full lg:w-1/2 pr-0 lg:pr-2">
                <p className="text-xl text-black dark:text-white pb-3 flex items-center">
                  <i className="fas fa-plus mr-3"></i> Reports
                </p>
                <div className="p-6 bg-white dark:bg-gray-800 dark:text-gray-300">
                  <b>Total Borrow (Month)</b> : {summaryData.month?.total} ₹<br />
                  <b>Total Borrow (Date: {year}-{month}-{date})</b> : {summaryData.date?.total} ₹<br />
                  <b>Overall Total Borrow</b> : {summaryData.overallTotal} ₹
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
                          { id: 0, value: summaryData.month?.total, label: 'Total Borrow (Month)', color: '#FF5733' },
                          { id: 1, value: summaryData.date?.total, label: `Total Borrow (Date)`, color: '#0096FF' },
                          { id: 2, value: summaryData.overallTotal, label: "Overall Total Borrow", color: '#00ff33' }
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
                {data.borrowEntries && data.borrowEntries.map((data_point, index_) => {
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
                        delBorrow(index_);
                      }} />
                    </div>
                  </div>
                })}
              </div>
            </div>
          </main>
        </div>

        <div className={`w-full h-[100vh] fixed transition-all duration-500 bg-gray-200 dark:bg-gray-800 ${addMode ? "" : "top-[100vh]"}`}>
          <div className=' p-4 text-2xl absolute text-right w-full'>
            <FaXmark onClick={() => {
              setAddMode(!addMode);
            }} className='cursor-pointer float-right dark:text-white' />
          </div>

          <div className='p-4 h-full flex justify-center items-center flex-col'>
            <div className='p-2 text-2xl dark:text-white'>ADD</div>
            <form className="max-w-md mx-auto rounded border border-black dark:border-gray-600 p-5 container overflow-x-scroll">
              <div className="relative z-0 w-full mb-5 group">
                <input type="number" id="borrowAmount" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required value={borrowAmount} onChange={(e) => setBorrowAmount(e.target.value)} />
                <label htmlFor="borrowAmount" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Amount</label>
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input type="text" id='borrowRemark' className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={borrowRemark} required onChange={(e) => setBorrowRemark(e.target.value)} />
                <label htmlFor="borrowRemark" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Remark</label>
              </div>
              <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={addBorrow}>ADD</button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
