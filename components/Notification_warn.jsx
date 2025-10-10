"use client"

import * as React from 'react';
import { useState } from 'react'

//style
import './style.css';

import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { useLoadingContext } from '../context/LoadingContext';

export default function Notification_warn() {
  const {notification_warn, setNotification_warn,
          notification_warn_color,
          notification_warn_message} = useLoadingContext();

 if(notification_warn){
    setTimeout(() => {
      setNotification_warn(false)
    }, 7000)
  }

  return (
    <>
    {
      notification_warn_message ? (
        <>
           <div className={`notifocation-message-abs ${!notification_warn ? 'hide' : ``}`}>
                <p><PriorityHighRoundedIcon fontSize="large" color={notification_warn_color} />{notification_warn_message}</p>
                <CloseRoundedIcon fontSize="large" onClick={() => setNotification_warn(false)} />
            </div>
        </>
      ) 
      :
      (
        <div className={`notifocation-message-abs ${!notification_warn ? 'hide' : ``}`}>
            <p><PriorityHighRoundedIcon fontSize="large" color='warning' />Please log in to use this feature</p>
            <CloseRoundedIcon fontSize="large" onClick={() => setNotification_warn(false)} />
        </div>
      )
    }
    </>
  
  );
}
