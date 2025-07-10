import React, { useState, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import AddMember from './pages/AddMember';
import EditMember from './pages/EditMember';
import Members from './pages/Members'; 
import Login from './pages/Login';
import UserManagement from './pages/UserManagement';
import TailwindTest from './pages/TailwindTest';
import MainLayout from './components/MainLayout';
import { supabase } from './services/supabase';
import { canManageMembers } from './utils/permissions';
import { setupViewportHeight, fixIonicScroll } from './utils/viewport';
import ViewMember from './pages/ViewMember';
import About from './pages/About';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables and custom CSS */
import './theme/variables.css';
import './tailwind.css';
import './components/MainLayout.css';

setupIonicReact();

const App: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        checkPermissions();
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    // Configurar altura da viewport
    setupViewportHeight();
    
    // Corrigir scroll do Ionic após carregamento
    const timer = setTimeout(() => {
      fixIonicScroll();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      if (session) {
        checkPermissions();
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const checkPermissions = async () => {
    try {
      const permitted = await canManageMembers();
      setHasPermission(permitted);
    } catch (error) {
      console.error('Permission check error:', error);
      setHasPermission(false);
    }
  };

  // Redirecionamento baseado no estado de autenticação
  if (isLoading) {
    return <div className="loading-screen">Carregando...</div>;
  }

  return (
    <IonApp className="scrollable-app">
      <IonReactRouter>
        <Switch>
          <Route path="/login" exact>
            {isAuthenticated ? <Redirect to="/app/home" /> : <Login />}
          </Route>
          
          <Route path="/app">
            {!isAuthenticated ? (
              <Redirect to="/login" />
            ) : (
              <MainLayout hasPermission={hasPermission}>
                <Switch>
                  <Route path="/app/home" component={Home} exact />
                  <Route path="/app/members" component={Members} exact />
                  <Route path="/app/add" component={AddMember} exact />
                  <Route path="/app/edit/:id" component={EditMember} exact />
                  <Route path="/app/users" component={UserManagement} exact />
                  <Route path="/app/test-tailwind" component={TailwindTest} exact />
                  <Route path="/app/view/:id" component={ViewMember} exact />
                  <Route path="/app/about" component={About} exact />
                  <Route path="/app">
                    <Redirect to="/app/home" />
                  </Route>
                </Switch>
              </MainLayout>
            )}
          </Route>
          
          <Route exact path="/">
            <Redirect to="/app/home" />
          </Route>
          
          <Route path="*">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
