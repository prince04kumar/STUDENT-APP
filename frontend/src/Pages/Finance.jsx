import React from 'react';
import Nev from '../Components/Nev';

export default function Finance() {
  // Array of financial tips
  const financialTips = [
    {
      id: 1,
      title: "Budgeting",
      description: "Create a monthly budget and track your expenses to manage your finances effectively."
    },
    {
      id: 2,
      title: "Emergency Fund",
      description: "Build an emergency fund to cover unexpected expenses and financial emergencies."
    },
    {
      id: 3,
      title: "Investing",
      description: "Start investing early to grow your wealth over time. Consider various investment options such as stocks, bonds, and mutual funds."
    },
    {
      id: 4,
      title: "Debt Management",
      description: "Develop a plan to pay off high-interest debts first and avoid taking on unnecessary debt."
    },
    {
      id: 5,
      title: "Saving",
      description: "Set aside a portion of your income for savings to achieve your financial goals."
    },
    {
      id: 6,
      title: "Financial Education",
      description: "Invest in financial education to improve your understanding of personal finance and make informed financial decisions."
    },
    {
      id: 7,
      title: "Retirement Planning",
      description: "Start planning and saving for retirement early to ensure financial security in your later years."
    },
    {
      id: 8,
      title: "Income Diversification",
      description: "Diversify your sources of income to reduce financial risk and increase stability."
    },
    {
      id: 9,
      title: "Insurance Coverage",
      description: "Ensure you have adequate insurance coverage to protect yourself and your assets from unexpected events."
    },
    {
      id: 10,
      title: "Avoid Impulse Spending",
      description: "Think carefully before making impulse purchases and prioritize spending on essential items."
    },
    {
      id: 11,
      title: "Review Finances Regularly",
      description: "Regularly review your financial situation and adjust your strategies as needed to stay on track toward your goals."
    },
    {
      id: 12,
      title: "Seek Professional Advice",
      description: "Consider seeking advice from a financial advisor or planner to help you make informed decisions and optimize your financial strategy."
    },
  ];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 font-family-karla flex sm:flex-row flex-col">
      <Nev />
      <div className="w-full overflow-x-hidden border-t flex flex-col h-[100vh] dark:border-gray-700">
        <main className="w-full flex-grow p-6">
          <h1 className="text-3xl text-black dark:text-white pb-6">Financial Tips</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {financialTips.map((tip) => (
              <div key={tip.id} className="p-6 bg-white dark:bg-gray-800 dark:text-gray-300 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-2">{tip.title}</h2>
                <p>{tip.description}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
