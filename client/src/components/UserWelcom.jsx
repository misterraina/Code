import React from 'react'
import {useAuth} from '../AuthProvider'

export default function UserWelcom() {
  const {  logout } = useAuth();

  return (
    <div className="flex items-center justify-center">
    
        <>
            <h1 className="text-9xl">Welcome, User!</h1>
            <button onClick={logout} className="ml-4 px-4 py-2 bg-red-500 text-white rounded">
                LogOut
            </button>
        </>
 
</div>
  )
}
