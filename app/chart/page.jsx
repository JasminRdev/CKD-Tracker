"use client"

import useUser from '../lib/useUser'
import Chart from '../../components/Chart.jsx'


import Menu from '../../components/Menu'

export default function ChartPage() {
  const user = useUser();
  
    return (
        <div >
        
               <Menu />
            <Chart />
        </div>
    );
}
