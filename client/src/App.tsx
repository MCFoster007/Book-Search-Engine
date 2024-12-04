// import './App.css';
// import { Outlet } from 'react-router-dom';
// import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client';
// import { setContext } from '@apollo/client/link/context';
// import  Navbar  from './components/Navbar';



// const authLink = setContext((_, { headers }) => ({
//   headers: {
//     ...headers,
//     authorization: token ? `Bearer ${token}` : '',
//   },
// }));

// // Create HttpLink to GraphQL
// const httpLink = new HttpLink({
//   uri: 'http://localhost:3001/graphql', 
// });

// // Combine authLink and httpLink
// const link = authLink.concat(httpLink);

// // Create ApolloClient
// const client = new ApolloClient({
//   link, 
//   cache: new InMemoryCache(), 
// });

// function App() {
//   return (
//     <ApolloProvider client={client}>
//       <div className="flex-column justify-center align-center min-100-vh bg-primary">
//         <Navbar />
//         <Outlet />
//       </div>
//     </ApolloProvider>
//   );
// }

// export default App;

import './App.css';
import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;