import React, { useEffect, useState } from 'react'
import { MdAdd } from 'react-icons/md'
import { FaXmark } from 'react-icons/fa6'
// import showToastMessage from '../../utils/toast_message';
// import showToastMessage from '../Utils/toast_message';
import Nev from '../Components/Nev';
import showToastMessage from '../Utils/toast_message'
import { LineChart } from '@mui/x-charts/LineChart';

export default function Monthely() {
  const [monthelyData, setMonthelyData] = useState([]);

  const getEmployeData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/normals/get-sum-summary-month/${JSON.parse(localStorage.getItem("user")).userID}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      // console.log(data.months);
      setMonthelyData(data.months);
      console.log(data.months)
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      alert('There was a problem retrieving the items: ' + error.message);
    }
  };



  useEffect(() => {
    getEmployeData();
  }, []);
  return (
    <>
      <div className="bg-gray-100 font-family-karla flex sm:flex-row flex-col">
        <Nev />

        <div className="w-full overflow-x-hidden border-t flex flex-col h-[100vh]">
          <main className="w-full flex-grow p-6">
            <h1 className="text-3xl text-black pb-6">Monthaly Report</h1>

            <div className="flex flex-wrap mt-6">
              <div className="w-full pr-0 lg:pr-2">
                <p className="text-xl pb-3 flex items-center">
                  <i className="fas fa-plus mr-3"></i> Stats
                </p>
                <div className="p-6 bg-white">
                  {Object.keys(monthelyData).length > 0 && (
                    <LineChart
                      width={1000}
                      height={300}
                      series={[
                        { data: Object.keys(monthelyData).map(month => parseInt(monthelyData[month].borrowSum)), label: 'Borrow Sum' },
                        { data: Object.keys(monthelyData).map(month => parseInt(monthelyData[month].receivedSum)), label: 'Received Sum' },
                        { data: Object.keys(monthelyData).map(month => parseInt(monthelyData[month].spendSum)), label: 'Spend Sum' },
                        { data: Object.keys(monthelyData).map(month => parseInt(monthelyData[month].earnedSum)), label: 'Earned Sum' }
                      ]}
                      xAxis={[{ data: Object.keys(monthelyData).map(month => parseInt(month.split('-')[1]))}]}
                    />
                  )}

                </div>
              </div>

            </div>

            <div className="w-full mt-12">

              <div className="bg-white overflow-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="text-left py-3 px-4 uppercase font-semibold text-sm whitespace-nowrap w-auto">Month</th>
                      <th className="text-left py-3 px-4 uppercase font-semibold text-sm whitespace-nowrap w-auto">Gain</th>
                      <th className="text-left py-3 px-4 uppercase font-semibold text-sm whitespace-nowrap w-auto">Spent</th>
                      <th className="text-left py-3 px-4 uppercase font-semibold text-sm whitespace-nowrap w-auto">Borrow</th>
                      <th className="text-left py-3 px-4 uppercase font-semibold text-sm whitespace-nowrap w-auto">Net Gain</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {monthelyData && Object.keys(monthelyData).map((month, index) => (
                      <tr key={index}>

                        <td className="text-left py-3 px-4 whitespace-nowrap w-auto">{month}</td>
                        <td className="w-1/3 text-left py-3 px-4">{monthelyData[month].borrowSum}</td>
                        <td className="text-left py-3 px-4 whitespace-nowrap w-auto">{monthelyData[month].receivedSum}</td>
                        <td className="text-left py-3 px-4 whitespace-nowrap w-auto">{monthelyData[month].spendSum}</td>
                        <td className="text-left py-3 px-4 whitespace-nowrap w-auto">{monthelyData[month].earnedSum}</td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
