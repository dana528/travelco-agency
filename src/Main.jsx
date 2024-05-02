import React, { useState } from 'react';
import { useNavigate , useLocation} from 'react-router-dom';
import { db } from './firebase';
import './emailVerification.css';
import FormInput from "./components/FormInput";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Main = () => {
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

const inputs = [

  {
    id: 1,
    name: "email",
    type: "email",
    placeholder: "Email",
    errorMessage: "It should be a valid email address!",
    label: "Email",
    required: true,
  },
 
];

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
      

      const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            console.log('userIdFromLink:', userIdFromLink); // Log userIdFromLink
            // Fetch user data from the database
            const userData = await getUserData(userIdFromLink);
            console.log("userdata email",userData.email);
            console.log("values email",values.email);
            
            // Verify if the entered email matches the user's email
            if (userData.email === values.email) {
              toast.success("You have successfully LoggedIn");
                // If it matches, navigate to the UserProfile component with userId and email
                setTimeout(() => {
                  navigate(`/${userIdFromLink}/${values.email}`);
                }, 2000);
                
            } else {
                // If it doesn't match, show an error message or handle it accordingly
                // alert('Email does not match the user ID.');
                toast.error("Email does not match the user ID")

            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            // Handle error fetching user data
            // alert('Error fetching user data. Please try again.');
            toast.error("Error fetching user data. Please try again")
        }
    };


    const onChange = (e) => {
      setValues({ ...values, [e.target.name]: e.target.value });
    };
    
    return (
      <div className='bg-slate-900 py-10 min-h-screen grid place-items-center'>
        <header className="w-full bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 fixed top-0 z-10">
          <nav className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a  className="flex items-center">
              {/* <img src="./images/travelco.png" className="mr-3 h-6 sm:h-9" alt="logo" /> */}
              <strong class="self-center text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
              {/* text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 */}
                Travelco Agency</strong>
            </a>
            <div className="flex items-center lg:order-2">
              <a className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-blue-500 focus:outline-none dark:focus:ring-gray-800"
              onClick={() => navigate(`/${userIdFromLink}/login`)}>
                Log in</a>
            </div>
            <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
              <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                {/* Add your menu items here */}
              </ul>
            </div>
          </nav>
        </header>

     
        {/* <form onSubmit={handleSubmit}>
      <h1>Please Enter your Email to continue</h1>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}
        <button className="btn" type="submit">Verify</button>
      </form> */}

<section>
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
  <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white "> 
          Enter your Email to Continue
        </h1>

      <div >
        <form class="dark:bg-gray-800 dark:border-gray-700 space-y-3 md:space-y-6 py-4 px-7" onSubmit={handleSubmit}>
          
            <input onChange={onChange} 
            type="email" 
            name="email" 
            id="email" 
            value = {values.email}
            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            placeholder="Your email" 
            required="" />
          
          <div class="flex items-center justify-between">
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
              </div>
              <div class="ml-3 text-sm">
                <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
              </div>
            </div>
          </div>
          <button type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">verify</button>
        </form>
      </div>
    </div>

</section>

<ToastContainer />

        </div>
       
    
    );
  };
  
  export default Main;