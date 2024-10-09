import { useState } from "react";
import { useSelector } from "react-redux";
import { HiLocationMarker } from "react-icons/hi";
import { AiOutlineMail } from "react-icons/ai";
import { FiPhoneCall } from "react-icons/fi";
import UserForm from "../components/common/UserForm";
import { RootState } from "../redux/store";

const UserProfile: React.FC = () => {
  const { userId } = useSelector((state: RootState) => state.userReducer);
  const [open, setOpen] = useState(false);

  // Mock user data for demonstration purposes
  const userInfo = {
    firstName: "John",
    lastName: "Doe",
    jobTitle: "Software Engineer",
    location: "San Francisco, CA",
    email: "john.doe@example.com",
    contact: "+1 234 567 890",
    about: "A passionate software engineer with a love for coding and problem-solving."
  };

  return (
    <div className='container mx-auto flex items-center justify-center py-10'>
      <div className='w-full md:w-2/3 2xl:w-2/4 bg-white shadow-lg p-10 pb-20 rounded-lg'>
        <div className='flex flex-col items-center justify-center mb-4'>
          <h1 className='text-4xl font-semibold text-slate-600'>
            {`${userInfo.firstName} ${userInfo.lastName}`}
          </h1>
          <h5 className='text-blue-700 text-base font-bold'>
            {userInfo.jobTitle || "Add Job Title"}
          </h5>

          <div className='w-full flex flex-wrap lg:flex-row justify-between mt-8 text-sm'>
            <p className='flex gap-1 items-center justify-center px-3 py-1 text-slate-600 rounded-full'>
              <HiLocationMarker /> {userInfo.location || "No Location"}
            </p>
            <p className='flex gap-1 items-center justify-center px-3 py-1 text-slate-600 rounded-full'>
              <AiOutlineMail /> {userInfo.email || "No Email"}
            </p>
            <p className='flex gap-1 items-center justify-center px-3 py-1 text-slate-600 rounded-full'>
              <FiPhoneCall /> {userInfo.contact || "No Contact"}
            </p>
          </div>
        </div>

        <hr />

        <div className='w-full py-10'>
          <div className='w-full flex flex-col'>
            <h2 className='text-2xl font-semibold text-slate-600 mb-2'>About</h2>
            <p className='text-slate-600'>
              {userInfo.about || "Add a description about yourself."}
            </p>
          </div>
        </div>

        <div className='flex justify-center'>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            onClick={() => setOpen(true)}
          >
            Edit Profile
          </button>
        </div>
        <UserForm open={open} setOpen={setOpen} />
      </div>
    </div>
  );
};

export default UserProfile;
