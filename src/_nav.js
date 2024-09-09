let menu = JSON.parse(sessionStorage.getItem("items"));
export default {
  items: menu,
  
};

// export default {
//   items: [
//     {
//       title: true,
//       name: 'Components'
//     },
//     {
//       name: 'Account Details',
//       url: '/wallet',
//       icon: 'icon-wallet',
//     },
//     {
//       name: 'Sign Document',
//       url: '/docUpload',
//       icon: 'icon-note',
//     },
//     {
//       name: 'Payments',
//       url: '/payments',
//       icon: 'fa fa-inr',
//     },
//     {
//       name: 'Reports',
//       url: '/reports',
//       icon: 'icon-book-open',
//       children: [
//         {
//           name: 'Transaction History',
//           url: '/reports/txnDetails',
//           icon: 'icon-book-open',
//         },
//         {
//           name: 'Payment History',
//           url: '/reports/paymentDetails',
//           icon: 'icon-book-open',
//         },
//       ],
//     },
//   ],
// };
