"use client"

import useUser from '../app/lib/useUser'


import './style.css';

export default function Documents() {
  const user = useUser();
   {
    return (
    <div className="comp-wrapper">
      <h1>documents comp</h1>
            Show all documents
        </div>
    );
  };
}
