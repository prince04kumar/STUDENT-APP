import React, { useEffect, useState } from 'react'
import { FaBars, FaBookmark, FaCalendar, FaDatabase, FaDollarSign, FaHome, FaLightbulb, FaMoneyBill, FaReceipt, FaUtensils, FaWindowClose } from 'react-icons/fa';
import { FaArrowDown, FaBagShopping, FaMoneyBill1, FaPeopleGroup, FaPlateWheat } from 'react-icons/fa6';
import { MdAdd, MdArtTrack, MdAutoGraph, MdDashboard, MdEmojiPeople, MdLogout } from 'react-icons/md';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Nev() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    let location = useLocation();

    return (
        <>
            <ToastContainer className='w-1/5 mx-auto' />
            <aside className="relative bg-blue-700 dark:bg-gray-900 h-screen w-64 sm:block shadow-xl hidden">
                <div className="p-6">
                    <Link to="/" className="text-white text-3xl font-semibold uppercase hover:text-gray-300">Panel</Link>
                </div>
                <nav className="text-white text-base font-semibold pt-3">
                    <Link to="/" className={`${location.pathname === '/admin' ? 'bg-blue-900 dark:bg-blue-700' : 'opacity-75 hover:opacity-100'} flex items-center text-white py-4 pl-6`}>
                        <FaHome /> &nbsp; Home
                    </Link>
                    <Link to="/budget-planner" className={`${location.pathname === '/budget-planner' ? 'bg-blue-900 dark:bg-blue-700' : 'opacity-75 hover:opacity-100'} flex items-center text-white py-4 pl-6`}>
                        <FaDollarSign /> &nbsp; Budget Planner
                    </Link>
                    <Link to="/monthaly-report" className={`${location.pathname === '/monthaly-report' ? 'bg-blue-900 dark:bg-blue-700' : 'opacity-75 hover:opacity-100'} flex items-center text-white py-4 pl-6`}>
                        <FaCalendar /> &nbsp; Monthaly report
                    </Link>

                    <Link to="/borrow" className={`${location.pathname === '/borrow' ? 'bg-blue-900 dark:bg-blue-700' : 'opacity-75 hover:opacity-100'} flex items-center text-white py-4 pl-6`}>
                        <FaBagShopping /> &nbsp; Borrow
                    </Link>
                    <Link to="/gain" className={`${location.pathname === '/gain' ? 'bg-blue-900 dark:bg-blue-700' : 'opacity-75 hover:opacity-100'} flex items-center text-white py-4 pl-6`}>
                        <MdAutoGraph /> &nbsp; Gain
                    </Link>

                    <Link to="/expense-tracker" className={`${location.pathname === '/expense-tracker' ? 'bg-blue-900 dark:bg-blue-700' : 'opacity-75 hover:opacity-100'} flex items-center text-white py-4 pl-6`}>
                        <MdArtTrack /> &nbsp; Expense Tracker
                    </Link>
                    <Link to="/financial-tip" className={`${location.pathname === '/financial-tip' ? 'bg-blue-900 dark:bg-blue-700' : 'opacity-75 hover:opacity-100'} flex items-center text-white py-4 pl-6`}>
                        <FaLightbulb /> &nbsp; Financial Tip
                    </Link>
                </nav>
            </aside>

            <header className="w-full bg-blue-700 dark:bg-gray-900 py-5 px-6 sm:hidden block sticky top-0">
                <div className="flex items-center justify-between">
                    <Link to="/" className="text-white text-3xl font-semibold uppercase hover:text-gray-300">Panel</Link>
                    <button className="text-white text-3xl focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
                        {!isOpen ? <FaBars /> : <FaWindowClose />}
                    </button>
                </div>
                <nav className={`flex flex-col pt-4 ${isOpen ? 'flex' : 'hidden'}`}>
                <Link to="/" className={`${location.pathname === '/admin' ? 'bg-blue-900 dark:bg-blue-700' : 'opacity-75 hover:opacity-100'} flex items-center text-white py-4 pl-6`}>
                        <FaHome /> &nbsp; Home
                    </Link>
                    <Link to="/budget-planner" className={`${location.pathname === '/budget-planner' ? 'bg-blue-900 dark:bg-blue-700' : 'opacity-75 hover:opacity-100'} flex items-center text-white py-4 pl-6`}>
                        <FaDollarSign /> &nbsp; Budget Planner
                    </Link>
                    <Link to="/monthaly-report" className={`${location.pathname === '/monthaly-report' ? 'bg-blue-900 dark:bg-blue-700' : 'opacity-75 hover:opacity-100'} flex items-center text-white py-4 pl-6`}>
                        <FaCalendar /> &nbsp; Monthaly report
                    </Link> 
                    <Link to="/borrow" className={`${location.pathname === '/borrow' ? 'bg-blue-900 dark:bg-blue-700' : 'opacity-75 hover:opacity-100'} flex items-center text-white py-4 pl-6`}>
                        <FaBagShopping /> &nbsp; Borrow
                    </Link>
                    <Link to="/gain" className={`${location.pathname === '/gain' ? 'bg-blue-900 dark:bg-blue-700' : 'opacity-75 hover:opacity-100'} flex items-center text-white py-4 pl-6`}>
                        <MdAutoGraph /> &nbsp; Gain
                    </Link>
                    
                    <Link to="/expense-tracker" className={`${location.pathname === '/expense-tracker' ? 'bg-blue-900 dark:bg-blue-700' : 'opacity-75 hover:opacity-100'} flex items-center text-white py-4 pl-6`}>
                        <MdArtTrack /> &nbsp; Expense Tracker
                    </Link>
                    <Link to="/financial-tip" className={`${location.pathname === '/financial-tip' ? 'bg-blue-900 dark:bg-blue-700' : 'opacity-75 hover:opacity-100'} flex items-center text-white py-4 pl-6`}>
                        <FaLightbulb /> &nbsp; Financial Tip
                    </Link>
                </nav>
            </header>
        </>
    )
}
