"use client"

import useUser from '../lib/useUser'
import Chart from '../../components/Chart.jsx'

export default function ChartPage() {
  const user = useUser();
  if(!user) {
    return <p>Please log in</p>
  } else {
    return (
        <div >
            <Chart />
        </div>
    );
  };
}
