"use client"

import * as React from 'react';
import { useState } from 'react'

//style
import './style.css';

import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

import { useRouter } from 'next/navigation'

import { useLoadingContext } from '../context/LoadingContext';

export default function Notification_warn() {

  const router = useRouter()

  const {notification_warn, setNotification_warn,
          notification_warn_color,
          notification_warn_message, extra_message, setExtra_message,
          extra_message_action} = useLoadingContext();

 if(notification_warn){
    setTimeout(() => {
      setNotification_warn(false)
    }, 7000)
  }

 if(extra_message){
    setTimeout(() => {
      setExtra_message(false)
    }, 7000)
  }

  return (
    <>
    {
      notification_warn_message ? (
        <>
           <div className={`notifocation-message-abs ${!notification_warn ? 'hide' : ``} ${notification_warn_color == 'success' ? 'green' : ''}`}>
                <p><PriorityHighRoundedIcon fontSize="large" color={notification_warn_color} className={`${notification_warn_color == 'success' ? 'hide' : ''}`} />{notification_warn_message}</p>
                <CloseRoundedIcon className='notification-close'
                fontSize="large" onClick={() => setNotification_warn(false)} />
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

    {(extra_message && extra_message_action == "visit-chart")  && (
        <>
          <div className="extra-message-wrapper">
            <span className="extra-message"
              onClick={() => router.push('/chart') }
            >
              Click here to visit Chart now 
              <ArrowRightAltIcon sx={{ fontSize: 40 }} /> 
            </span>
            <CloseRoundedIcon className='notification-close'
                  fontSize="large" onClick={() => setNotification_warn(false)} />
          </div>
        </>
    )}
    </>
  
  );
}
