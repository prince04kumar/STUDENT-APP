import React, { useEffect, useState } from 'react'
import { MdAdd, MdDelete } from 'react-icons/md'
import { FaXmark } from 'react-icons/fa6'
// import s from '../Utils/toast_message'
import showToastMessage from '../Utils/toast_message';
import Nev from '../Components/Nev';
import { FaCalendar } from 'react-icons/fa';


export default function Borrow() {
  const [borrowRemark, setBorrowRemark] = useState("");
  const [borrowAmount, setBorrowAmount] = useState(0);
  const [data, setData] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [date, setDate] = useState(0);
  // const [index, setIndex] = useState(0);
  const userID = JSON.parse(localStorage.getItem('user')).userID; // Assuming 'user' is the key for user data in localStorage

  useEffect(() => {
    const date_now = new Date();
    setYear(date_now.getFullYear());
    setMonth(date_now.getMonth() + 1);
    setDate(date_now.getDate());
    getBorrowData(date_now.getFullYear(), date_now.getMonth() + 1, date_now.getDate());
  }, []);

  const addBorrow = async () => {
    const borrow_data = {
      "userID": userID,
      "amount": borrowAmount,
      "remark": borrowRemark
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
      // Optionally, update the list of items
      getBorrowData(year, month, date);
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
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        showToastMessage("error", 'There was a problem deleting the borrow: ' + error.message);
      }
    }
  };

  return (
    <>
      <div className="bg-gray-100 font-family-karla flex sm:flex-row flex-col">
        <Nev />

        <div className="w-full overflow-x-hidden border-t flex flex-col h-[100vh]">
          <main className="w-full flex-grow p-6">
            <h1 className="text-3xl text-black pb-6">Employee Manager</h1>
            <div className='flex w-full items-center justify-center bg-green-400 p-3 rounded text-2xl text-green-950 cursor-pointer hover:bg-green-500' onClick={() => {
              setAddMode(!addMode);
            }}>
              <MdAdd /> &nbsp; Add Borrow
            </div><br />
            <div className='flex w-full items-center justify-center bg-gray-900 p-3 rounded text-2xl text-gray-200 cursor-pointer hover:bg-gray-900'>
              <input type="date" className="outline-none bg-transparent border-none" value={`${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`} onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                setYear(selectedDate.getFullYear());
                setMonth(selectedDate.getMonth()+1);
                setDate(selectedDate.getDate());
                getBorrowData(selectedDate.getFullYear(), selectedDate.getMonth()+1, selectedDate.getDate());
              }} />
            </div>

            <div className="flex flex-wrap mt-6">
              <div className="w-full lg:w-1/2 pr-0 lg:pr-2">
                <p className="text-xl pb-3 flex items-center">
                  <i className="fas fa-plus mr-3"></i> Monthly Reports
                </p>
                <div className="p-6 bg-white">
                  <b>Total Employee </b> :
                </div>
              </div>
              <div className="w-full lg:w-1/2 pl-0 lg:pl-2 mt-12 lg:mt-0">
                <p className="text-xl pb-3 flex items-center">
                  <i className="fas fa-check mr-3"></i> Resolved Reports
                </p>
                <div className="p-6 bg-white">
                  <canvas id="chartTwo" width="400" height="200"></canvas>
                </div>
              </div>
            </div>

            <div className="w-full mt-12">
              <p className="text-xl pb-3 flex items-center">
                <i className="fas fa-list mr-3"></i> Added Item
              </p>
              <div className="bg-white overflow-auto p-5">
                {data.borrowEntries && data.borrowEntries.map((data_point, index_) => {
                  return <div className='w-full bg-slate-700 my-5 rounded-md flex' key={index_}>
                    <div className='flex items-center justify-center p-3'>
                      {data_point[0]}
                    </div>
                    <div className='w-full border-x-2 p-3'>
                      {data_point[1]}
                    </div>
                    <div className='flex items-center justify-center p-3 text-2xl'>
                      <MdDelete onClick={()=>{
                        // setIndex(index_)
                        console.log(index_)
                        delBorrow(index_);
                      }}/>
                    </div>
                  </div>
                })}
                {/* {JSON.stringify(data.borrowEntries)} */}
              </div>
            </div>
          </main>
        </div>


        <div className={`w-full h-[100vh] fixed transition-all duration-500 bg-gray-200 ${addMode ? "" : "top-[100vh]"}`}>
          <div className=' p-4 text-2xl absolute text-right w-full'>
            <FaXmark onClick={() => {
              setAddMode(!addMode);
            }} className='cursor-pointer float-right' />
          </div>

          <div className='p-4 h-full flex justify-center items-center flex-col'>
            <div className='p-2 text-2xl'>ADD</div>
            <form className="max-w-md mx-auto rounded border border-black p-5 container overflow-x-scroll">
              <div className="relative z-0 w-full mb-5 group">
                <input type="number" id="borrowAmount" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required value={borrowAmount} onChange={(e) => setBorrowAmount(e.target.value)} />
                <label htmlFor="borrowAmount" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Amount</label>
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input type="text" id='borrowRemark' className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={borrowRemark} required onChange={(e) => setBorrowRemark(e.target.value)} />
                <label htmlFor="borrowRemark" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Remark</label>
              </div>
              <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => {
                addBorrow();
              }}>ADD</button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
