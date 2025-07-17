import {React,useRef,useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import { updateUserFailure, updateUserSuccess ,deleteUserFailure,deleteUserStart,deleteUserSuccess,signOutUserStart, updateUserStart,} from '../redux/user/userSlice';


const Profile = () => {
  const {currentUser,loading,error} = useSelector(state => state.user)
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined);
  const [filePercentage,setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const dispatch =  useDispatch();
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);



  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file,formData]);

  // console.log("chi chi")

  const handleFileUpload = (selectedFile) => {
      if (!selectedFile) {
        console.error('No file selected.');
        return;
      }
      const storage = getStorage(app)
      const fileName = new Date().getTime() + selectedFile.name;
      const storageRef = ref(storage,fileName);
      const uploadTask = uploadBytesResumable(storageRef,selectedFile);
      console.log(selectedFile)
      uploadTask.on('state_changed',(snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
            // console.log('upload is' + progress + '% done');
            setFilePercentage(Math.round(progress));
          },
          (error) => {
            setFileUploadError(true);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{
              setFormData((prevData) => ({ ...prevData, avatar: downloadURL }));
          setUpdateSuccess(true);
            }
              // setFormData({ ...formData, avatar: downloadURL })

            );
          }
      );
  }


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // console.log(formData)
  };

  const handleSubmit =async(e) => {
    e.preventDefault();
    // console.log(formData)
    try{
      // dispatch(updateUserStart());
      // console.log("userid console kr rhe hai",currentUser._id)
      const res = await fetch(`http://localhost:8000/api/user/update/${currentUser._id}`,{
        
        method: 'PUT',
        headers: {
          'content-type':'application/json',

        },
        credentials: 'include',
        
        body:JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("checking for the response",data)
      if(data.success === false){
        dispatch(updateUserFailure(data.message))
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true); 
    }
    catch(error){
      // console.log(e);
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDelete = async() => {
    try{
      dispatch(deleteUserStart());
      const res = await fetch(`http://localhost:8000/api/user/delete/${currentUser._id}`,{
        method: 'DELETE',
        headers: {
          'content-type':'application/json',
        },
        credentials: 'include',
      })
      const data = await res.json();
      if(data.success == false){
        dispatch(deleteUserFailure(data.message))
        return;
      }
      dispatch(deleteUserSuccess(data.message))
    }
    catch(error){
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleLogOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('http://localhost:8000/api/auth/logout',{
        method: 'GET',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    console.log(currentUser)
    try {
      setShowListingsError(false);
      const res = await fetch(`http://localhost:8000/api/user/lists/${currentUser._id}`,{
        method: 'GET',
        headers: {
          'content-type':'application/json',
        },
        credentials: 'include',
      })
      const data = await res.json();
      // console.log("list backend se jo aaya",data)
      if (data.success === false) { 
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        headers: {
          'content-type':'application/json',
        },
        credentials: 'include',
      })
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4 ' onSubmit={handleSubmit}>
        <input onChange={(e)=> setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*'></input>
        <img className='rounded-full w-24 h=24 object-cover cursor-pointer self-center mt-2'  onClick={()=>fileRef.current.click()} src={currentUser.avatar} alt='profile'></img>
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePercentage}%`}</span>
          ) : filePercentage >= 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input className='rounded-lg border p-3' type='text' placeholder='username' id='username' onChange={handleChange} defaultValue={currentUser.username}></input>
        <input className='rounded-lg border p-3' type='email' placeholder='email' id='email' onChange={handleChange} defaultValue={currentUser.email}></input>
        <input className='rounded-lg border p-3' type='password' placeholder='password' id='password' onChange={handleChange} defaultValue={currentUser.password}></input>
        <button className='rounded-lg bg-slate-800 text-white p-3' type='submit' >{loading ? 'Loading...' : 'Update'}</button>
        <Link
          className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
          to={'/create-listing'}
        >
          Create Listing
        </Link>
      </form>
      <div  className='flex justify-between mt-5'>
        <span className='text-red-600 font-semibold cursor-pointer'onClick={handleDelete} >Delete Account</span>
        <span className='text-red-600 font-semibold cursor-pointer' onClick={handleLogOut}>Logout</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
      <button onClick={handleShowListings} className='text-green-700 w-full'>
        Show Listings
      </button>
      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Error showing listings' : ''}
      </p>
      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((list) => (
            <div
              key={list._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${list._id}`}>
                <img
                  src={list.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${list._id}`}
              >
                <p>{list.name}</p>
              </Link>
              {console.log("list ka id :",list._id)}
              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(list._id)}
                  
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${list._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Profile
