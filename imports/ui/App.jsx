import React from 'react';
import { Hello } from './Hello.jsx';
import { Info } from './Info.jsx';
import { RenderRoutes } from '../../client/router.jsx';

export const App = () => (
  <div>
    <RenderRoutes />
  </div>
);
