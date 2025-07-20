"use client"

import useUser from '../lib/useUser'
import BloodTest from '../components/BloodTest.jsx'

export default function bloodTest() {
  const user = useUser();
  if(!user) {
    return <p>Please log in</p>
  } else {
    return (
        <div >
            <BloodTest />
        </div>
    );
  };
}
