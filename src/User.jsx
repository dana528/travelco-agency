import { Button } from '@mui/material';
import React , {useState} from 'react';
import { useNavigate , useLocation} from 'react-router-dom';
import { db } from './firebase';

const User = () => {

    const [values, setValues] = useState({
        username: "",
        email: "",
        birthday: "",
        password: "",
        confirmPassword: "",
      });
        const navigate = useNavigate();
        const location = useLocation();
        const segments = location.pathname.split('/');
        const userIdFromLink = segments[1];
     
        const getUserData = async (userId) => {
            try {
              const userQuerySnapshot = await db.collection('users').doc(userId).get(); // Fetch user by userId
              if (userQuerySnapshot.exists) {
                return userQuerySnapshot.data();
              } else {
                throw new Error('User not found');
              }
            } catch (error) {
              throw new Error('Error fetching user data: ' + error.message);
            }
          };
        
          const onChange = (e) => {
            setValues({ ...values, [e.target.name]: e.target.value });
          };

        
  return ( 

    <div className='w-full h-screen'>

  <img
    className='top-0 left-0 w-full h-screen object-cover'
    src='https://img.freepik.com/free-photo/island-sea-with-plane-wing_1339-517.jpg?t=st=1714939577~exp=1714943177~hmac=4a42605cf12595b43cf2544da7919c7b0b0a267a14a530a8cf7be82a73313004&w=1060'
    alt='/'
  />
<header className="w-full bg-transparent px-4 lg:px-6 py-2.5 fixed top-0 z-10 transition-shadow duration-300 hover:shadow-lg">
  <nav className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl h-10">
    <a className="flex items-center">
      <strong className="self-center text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 text-white">
        Travelco Agency
      </strong>
    </a>
    <div className="flex items-center lg:order-2">
      <a className="text-white text-gray-800 dark:text-white hover:bg-lack hover:text-white focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-purple-900 focus:outline-none dark:focus:ring-gray-800"
       onClick={() => navigate(`/${userIdFromLink}/login`)}>
        Log in
      </a>
    </div>
  </nav>
</header>

  <div className='bg-black/30 absolute top-0 left-0 w-full h-screen' />
  <div className='absolute top-0 w-full h-full flex flex-col justify-center text-white'>
    <div className='md:left-[10%] max-w-[1100px] m-auto absolute p-4'>
      <h1 className='font-bold text-5xl md:text-7xl drop-shadow-2xl text-white'>
        Welcome to Travelco Agency
      </h1>
      <p className='max-w-[600px] drop-shadow-2xl py-2 text-xl italic'>
        <strong className="text-blue-600 dark:text-purple-900 hover:purple-900 ">Login</strong> to continue and confidently share your details
      </p>
      <div className="flex items-center lg:order-2">
      {/* <a className="text-white  hover:bg-black hover:text-white  focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-purple-900 focus:outline-none dark:focus:ring-gray-800">
  Log in
</a> */}

    </div>
    </div>
  </div>
</div>

   

  );
}

export default User;
