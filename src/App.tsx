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
    JobForm,
    ResumeContent,
    CompanyDetail,
} from "./pages";
import { ToastContainer } from 'react-toastify';
import Loading from './components/common/Loading';
import LoginPage from "./pages/auth/Login";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import CustomModal from "./components/common/CustomModal";
import { closeMessenger } from "./redux/slice/messageSlice";
import useAppDispatch from "./hooks/useAppDispatch";
import TestCV from "./pages/cv/CVGenerate";
import CVPreview from "./pages/cv/CVPreview";
import CVGenerate from "./pages/cv/CVGenerate";
import { useCallback, useEffect } from "react";
import { getConversations } from "./services/messageApi";
import { getUserInfo } from "./services/authApi";
import { setUserInfo } from "./redux/slice/authSlice";
import SavedJobsPage from "./pages/employee/SavedJobsPage";
import TestCV1 from "./pages/cv/Resume";
import AppliedJob from "./pages/employee/AppliedJobs";

function SidebarLayout() {
    const location = useLocation();
    const showSidebar = [
        "/dashboard",
        "/company-info",
        "/job-posts",
        "/applicants",
        "/info-page",
        "/apply-job"
    ].includes(location.pathname) ||
        /^\/jobs\/edit\/\d+$/.test(location.pathname);

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
    const { showMessenger } = useSelector((state: RootState) => state.messageReducer);
    const dispatch = useAppDispatch();
    const { userId, isLoggedIn } = useSelector((state: RootState) => state.authReducer);
    // Không hiển thị Navbar trên trang login và register-employee  
    const hideNavbarOnLogin = location.pathname === "/login" || location.pathname === "/register-employee" || location.pathname === "/register-employer";

    const fetchUserInfo = useCallback(async () => {
        if (userId) {
            const res = await getUserInfo(userId);
            if (res) {
                dispatch(setUserInfo({ fullName: res.fullName, avatar: res.avatar }));
            }
            dispatch(getConversations());
        }
    }, [userId]);

    useEffect(() => {
        isLoggedIn && fetchUserInfo();
    }, [userId]);

    return (
        <>
            <main className="bg-[#f7fdfd]">
                {/* Chỉ hiển thị Navbar nếu không phải trang login hoặc register-employee */}
                {!hideNavbarOnLogin && <Navbar />}
                <div className={hideNavbarOnLogin ? "" : "pt-[50px]"}>
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
                            <Route path="/company/detail/:id" element={<CompanyDetail />} />
                            <Route path="/test" element={<TestCV1 />} />
                            <Route path="/saved-jobs" element={<SavedJobsPage />} />
                            <Route path="/applied-jobs" element={<AppliedJob />} />
                        </Route>

                        {/* Các route khác */}
                        {/* <Route path='/messenger' element={<Messenger />} /> */}
                        <Route path='/generate-cv' element={<CVGenerate />} />
                        <Route path='/cv-preview' element={<CVPreview />} />
                        <Route path="/register-employee" element={<RegisterEmployee />} />
                        <Route path="/register-employer" element={<RegisterEmployer />} />
                        <Route path="/employer" element={<EmployerLanding />} />
                        <Route path="/about-us" element={<About />} />
                        <Route path="/resume" element={<ResumePage />} />
                        <Route path="/resume-content" element={<ResumeContent />} />

                    </Routes>
                </div>
            </main>
            <ToastContainer
                position="bottom-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                draggable
                theme="light"
                pauseOnFocusLoss={false}
                stacked
            />
            <CustomModal isOpen={showMessenger} width='large' height='large' onClose={() => { dispatch(closeMessenger()); }} children={<Messenger />} />
            <Loading />
        </>
    );
}

export default App;
