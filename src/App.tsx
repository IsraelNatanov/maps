import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { DataApi, PointExpression } from './tips';
import Maps from './maps';
import OpenLy from './component/appMap';
import { QueryClientProvider } from 'react-query';
import { QueryClient } from 'react-query';
import AppMap from './component/appMap';

interface pointAdders{
  pointExpression: PointExpression
}



const App: React.FC = () => {
  const [posAr, setPosAr] = useState([[31.7235293,34.7439036],[31.7233293,34.7437036]]);
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
    <div className="App">
      <AppMap/>
      
    </div>
    </QueryClientProvider>
  )
}

export default App
