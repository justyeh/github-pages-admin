import React, { Component } from 'react';
import { BrowserRouter,Route,Redirect,Switch } from 'react-router-dom';

import { basePath } from '@/appConfig';
import {storage} from '@/libs/utils';
import AuthRoute from '@/components/AuthRoute';
import routes from "@/router/";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: !!storage.get("token")
    }
  }
  
  render() { 
    return (
      <BrowserRouter
        basename={basePath}
      >
        <Switch>
          <Route exact path="/" render={() => 
              <Redirect to='/post'/>
            }
          />
          {routes.map(item=>{
              return (
                  <AuthRoute {...item} key={item.path || item.key}></AuthRoute>
              )
          })}
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;

