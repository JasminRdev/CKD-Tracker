"use client"

import useUser from '../lib/useUser'

export default function dashboard() {
  const user = useUser();
  if(!user) {
    return <p>Please log in</p>
  } else {
    return (
        <div >
            dashboard
        </div>
    );
  };
}
