"use client"

import Notification_warn from "../components/Notification_warn"
import LogUserCTA from "./LogUserCTA"
import { useLoadingContext } from '../context/LoadingContext';

import * as React from 'react';
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Button from '@mui/material/Button';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { useState } from 'react'
import { signIn, signInWithGoogle, signUp, signOut } from '../app/lib/auth'

//style
import './style.css';


export default function Menu() {
  
  const pathname = usePathname();
  const {foundUser, loading} = useLoadingContext();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // <div className='menu-logged menu-border-left'>
  //       Logged In <AccountCircleRoundedIcon color="success" />
  //   </div>

  if (loading) return null;

  return (
    <>
    <Notification_warn />
    
    <div className='menu-wrapper-space' >
    </div>
    <div className='menu-wrapper' >
        <span className={`menu-overlay ${!menuOpen ? 'hide' : ''}`}>
          <div className="menu-links">
            <Link 
              className={pathname.includes("/chart") ? "active" : ""}  
              href="/chart">Charts
            </Link>
            <Link
              className={` ${pathname.includes("/bloodTest") ? "active" : ""}`}  
              href="/bloodTest">Upload Results</Link>
          </div>
          <LogUserCTA />

        </span>
         {
            menuOpen ? 
            <CloseRoundedIcon className='menu-icon' fontSize="large" onClick={() => setMenuOpen(false)} />
            :
            <MenuRoundedIcon className='menu-icon' fontSize="large" onClick={() => setMenuOpen(true)} />
        }
        <div className="menu-left">
          <div className="menu-logo-wrapper">
            <img
              className="menu-logo"
              src="/images/logo.png"
              alt="Logo"
            />
            - Tracker
          </div>
        </div>
        <div className="menu-links">
          <Link 
            className={pathname.includes("/chart") ? "active" : ""}  
            href="/chart">Charts
          </Link>
          <Link
            className={`menu-border-left ${pathname.includes("/bloodTest") ? "active" : ""}`}  
            href="/bloodTest">Upload Results</Link>
        </div>
        <LogUserCTA />
    </div>
    </>
  );
}
