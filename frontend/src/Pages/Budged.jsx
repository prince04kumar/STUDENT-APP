import React, { useEffect, useState } from 'react';
import Nev from '../Components/Nev';

export default function Managedata() {
    const [monthlyData, setMonthlyData] = useState({});
    const id = JSON.parse(localStorage.getItem('user')).userID; // Assuming 'user' is the key for user data in localStorage

    useEffect(() => {
        getMonthlyData();
    }, []);

    const getMonthlyData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/normals/get-sum-summary-month/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setMonthlyData(data.months);
        } catch (error) {
            console.error('Error fetching monthly data:', error);
            // Handle error, e.g., show a message to the user
        }
    };

    return (
        <>
            <div className="bg-gray-100 font-family-karla flex sm:flex-row flex-col">
                <Nev />
                <div className="w-full overflow-x-hidden border-t flex flex-col h-[100vh]">
                    <main className="w-full flex-grow p-6">
                        <h1 className="text-3xl text-black pb-6">Overview</h1>
                        <div className="flex flex-wrap mt-6">
                            <div className="w-full lg:w-1/2 pr-0 lg:pr-2">
                                <p className="text-xl pb-3 flex items-center">
                                    <i className="fas fa-plus mr-3"></i> Monthly Reports
                                </p>
                                <div className="p-6 bg-white">
                                    <b>Total Report </b> : {/* You can add total report here */}
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
                                <i className="fas fa-list mr-3"></i> Monthly Report
                            </p>
                            <div className="bg-white overflow-auto">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-800 text-white">
                                        <tr>
                                            <th className="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">MONTH</th>
                                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm whitespace-nowrap w-auto">INCOME</th>
                                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm whitespace-nowrap w-auto">EXPENSES</th>
                                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm whitespace-nowrap w-auto">BORROW</th>
                                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm whitespace-nowrap w-auto">EARNED</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-700">
                                        {monthlyData && Object.keys(monthlyData).map(monthKey => (
                                            <tr key={monthKey}>
                                                <td className="text-left py-3 px-4 whitespace-nowrap w-auto">{monthKey}</td>
                                                <td className="text-left py-3 px-4 whitespace-nowrap w-auto">{monthlyData[monthKey].borrowSum}</td>
                                                <td className="text-left py-3 px-4 whitespace-nowrap w-auto">{monthlyData[monthKey].receivedSum}</td>
                                                <td className="text-left py-3 px-4 whitespace-nowrap w-auto">{monthlyData[monthKey].spendSum}</td>
                                                <td className="text-left py-3 px-4 whitespace-nowrap w-auto">{monthlyData[monthKey].earnedSum}</td>
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
    );
}
