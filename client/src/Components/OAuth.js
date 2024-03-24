import React from 'react'
import {GoogleAuthProvider,getAuth, signInWithPopup} from "firebase/auth"
import { app } from '../firebase';
import { signInSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async(e) =>{
        try{
            const Provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth,Provider)
            console.log("result",result)
            const res = await fetch('http://localhost:8000/api/auth/google',{
                method:'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({name: result.user.displayName, email:result.user.email, photo:result.user.photoURL}),
            })
            const data = await res.json()
            console.log(data);
            if(data.success == false){
                dispatch(signInFailure(data.message));
                return;
            }
            dispatch(signInSuccess(data));
            navigate('/')
        }
        catch(error){
            // console.log("connot signup with google")
            console.log(error)
        }
    }
  return (
    <div>
        {/* <button className='bg-red-500 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 '>Continue with google</button> */}
        <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80'>Continue with google</button>
    </div>
  )
}

export default OAuth