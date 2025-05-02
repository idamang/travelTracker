import { ApolloProvider } from '@apollo/client';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import client from './ApolloClient';
import Layout from './components/layout/layout';
import ProtectedRoute from './context/ProtectedRoute';
import ErrorPage from './pages/Erro';
import CountryPage from './pages/explore/[country]/index';
import Explore from './pages/explore/explore';
import GetStarted from './pages/getStarted';
import LoginPage from './pages/login';
import Maps from './pages/maps';
import TripDetail from './pages/myTravels/[travel]/Index';
import MyTravels from './pages/myTravels/mytravels';
import NewTrip from './pages/newTrip';
import { UserProvider } from './context/UserContext';
import Profile from './pages/profile';

// Import ThemeProvider
import { ThemeProvider } from './ThemeContext';

function App() {
  return (
    <ApolloProvider client={client}>
      <UserProvider>
        <ThemeProvider>
          <Router basename="/project2">
            <Layout>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<Explore />} />
                <Route path="/:city" element={<CountryPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/maps" element={<Maps />} />
                  <Route path="/mytravels" element={<MyTravels />} />
                  <Route path="/mytravels/:travel" element={<TripDetail />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/get-started" element={<GetStarted />} />
                  <Route path="/mytravels/newtrip" element={<NewTrip />} />
                </Route>
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </Layout>
          </Router>
        </ThemeProvider>
      </UserProvider>
    </ApolloProvider>
  );
}

export default App;
