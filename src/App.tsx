import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Navbar, Sidebar, Header } from "./components";
import {
    About,
    FindJobs,
    JobDetail,
    UserProfile,
    EmployerLanding,
    Dashboard,
    JobPosts,
    ApplicantsList,
    CompanyInfo,
    RegisterEmployee,
    RegisterEmployer,
    Messenger,
    ResumePage,
    JobForm
} from "./pages";
import { ToastContainer } from 'react-toastify';
import Loading from './components/Loading';
import LoginPage from "./pages/auth/Login";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import CustomModal from "./components/CustomModal";
import { closeMessenger } from "./redux/slice/loadingSlice";
import useAppDispatch from "./hooks/useAppDispatch";

function SidebarLayout() {
    const location = useLocation();
    const showSidebar = ["/dashboard", "/company-info", "/job-posts", "/applicants", "/info-page", "/apply-job"].includes(location.pathname); // Hiển thị Sidebar ở những route này

    return (
        <div className="flex min-h-screen">
            {/* Sidebar chỉ hiển thị trên các trang có Sidebar */}
            {showSidebar && (
                <div className="w-64 bg-white shadow-md">
                    <Sidebar />
                </div>
            )}
            <div className="flex-1 p-8">
                <Outlet />
            </div>
        </div>
    );
}

function App() {
    const location = useLocation();
    const { showMessenger } = useSelector((state: RootState) => state.loadingReducer);
    const dispatch = useAppDispatch();
    // Không hiển thị Navbar trên trang login và register-employee  
    const hideNavbarOnLogin = location.pathname === "/login" || location.pathname === "/register-employee" || location.pathname === "/register-employer";

    return (
        <>
            <main className="bg-[#f7fdfd]">
                {/* Chỉ hiển thị Navbar nếu không phải trang login hoặc register-employee */}
                {!hideNavbarOnLogin && <Navbar />}
                <div className={hideNavbarOnLogin ? "" : "pt-[80px]"}>
                    <Routes>
                        {/* Routes với xác thực */}
                        <Route path="/" element={<Navigate to="/find-jobs" replace={true} />} />
                        <Route path="/find-jobs" element={<FindJobs />} />
                        <Route path="/user-profile" element={<UserProfile />} />
                        <Route path="/job-detail/:id" element={<JobDetail />} />
                        <Route path="/login" element={<LoginPage />} />

                        {/* Routes có Sidebar */}
                        <Route element={<SidebarLayout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/company-info" element={<CompanyInfo />} />
                            <Route path="/job-posts" element={<JobPosts />} />
                            <Route path="/applicants" element={<ApplicantsList />} />
                            <Route path="/info-page" element={<CompanyInfo />} />
                            <Route path="/apply-job" element={<JobForm />} />
                            <Route path="/jobs/edit/:id" element={<JobForm />} />

                        </Route>

                        {/* Các route khác */}
                        <Route path='/messenger' element={<Messenger />} />
                        <Route path="/register-employee" element={<RegisterEmployee />} />
                        <Route path="/register-employer" element={<RegisterEmployer />} />
                        <Route path="/employer" element={<EmployerLanding />} />
                        <Route path="/about-us" element={<About />} />
                        <Route path="/resume" element={<ResumePage />} />

                    </Routes>
                </div>
            </main>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                draggable
                theme="light"
            />
            {showMessenger && <CustomModal isOpen={showMessenger} width='large' height='large' onClose={() => { dispatch(closeMessenger()); }} children={<Messenger />} />}
            { }
            <Loading />
        </>
    );
}

export default App;
