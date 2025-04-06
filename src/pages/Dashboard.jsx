// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { portfolioService } from '../portfolioService';
// import { useAuth } from '../contexts/AuthContext';

// const Dashboard = () => {
//   const [portfolios, setPortfolios] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { currentUser } = useAuth();

//   useEffect(() => {
//     const fetchPortfolios = async () => {
//       try {
//         const data = await portfolioService.getPortfoliosByUserId(currentUser.uid);
//         setPortfolios(data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error:', error);
//         setLoading(false);
//       }
//     };
//     fetchPortfolios();
//   }, [currentUser]);

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this portfolio?')) {
//       try {
//         await portfolioService.deletePortfolio(id);
//         setPortfolios(portfolios.filter(p => p.id !== id));
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     }
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="container mx-auto p-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">My Portfolios</h1>
//         <Link to="/create" className="bg-blue-500 text-white px-4 py-2 rounded">
//           Create New Portfolio
//         </Link>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {portfolios.map((portfolio) => (
//           <div key={portfolio.id} className="border rounded p-4">
//             <h2 className="text-xl font-bold">{portfolio.name}</h2>
//             <p className="text-gray-600">{portfolio.title}</p>
//             <div className="mt-4 flex gap-2">
//               <Link
//                 to={`/portfolio/${portfolio.id}`}
//                 className="text-blue-500 hover:underline"
//               >
//                 View
//               </Link>
//               <Link
//                 to={`/edit/${portfolio.id}`}
//                 className="text-green-500 hover:underline"
//               >
//                 Edit
//               </Link>
//               <button
//                 onClick={() => handleDelete(portfolio.id)}
//                 className="text-red-500 hover:underline"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;