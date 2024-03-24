import {React,useState} from 'react'
import {Link,Navigate, useNavigate} from 'react-router-dom'
import OAuth from '../Components/OAuth';

const Registration = () => {

  const [formData,setFormData] = useState({});
  const [error, setError] =  useState(null);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({
      ...formData,[e.target.id]:e.target.value,
    })
  }
  // console.log(formData);

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
   try{ 
    const res = await fetch('http://localhost:8000/api/auth/register',
    {method:'POST',
    headers:{
      'Content-type': 'application/json',
    },
    body: JSON.stringify(formData),
    })
    const data = await res.json();
    console.log(data.success);
    if(data.success){

      setError(data.message);
      setLoading(true);
      navigate("/sign-in")
      return;
    }
    setLoading(false);
    // console.log(data);
  }
  catch(error){
    console.log('Error during registration;',error.message);
  }

    console.log(formData);
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input className='border p-3 rounded-lg' id='username' type='text' placeholder='username' onChange={handleChange}></input>
        <input className='border p-3 rounded-lg' id='email' type='text' placeholder='abc@gmail.com' onChange={handleChange}></input>
        <input className='border p-3 rounded-lg' id='password' type='text' placeholder='password' onChange={handleChange}></input>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80' type='submit'>{loading ? 'Loading...':'SignUp'}</button>
        {/* <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80' type='submit'>signup</button> */}
        {/* <button className='bg-red-500 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 '>Continue with google</button> */}
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={"/sign-in"}><span className='text-blue-700'>Sign-in</span></Link>

      </div>

    </div>
  )
}

export default Registration 
