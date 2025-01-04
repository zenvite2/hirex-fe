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
    VideoCallRequest,
    PasswordChangeForm
} from "./pages";
import { ToastContainer } from 'react-toastify';
import Loading from './components/common/Loading';
import LoginPage from "./pages/auth/Login";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import CustomModal from "./components/common/CustomModal";
import { addMessage, closeMessenger, setToCaller } from "./redux/slice/messageSlice";
import useAppDispatch from "./hooks/useAppDispatch";
import CVPreview from "./pages/cv/CVPreview";
import CVGenerate from "./pages/cv/CVGenerate";
import { useCallback, useEffect, useState } from "react";
import { getConversations } from "./services/messageApi";
import { getUserInfo } from "./services/authApi";
import { setUserInfo } from "./redux/slice/authSlice";
import SavedJobsPage from "./pages/employee/SavedJobsPage";
import Resume from "./pages/cv/Resume";
import AppliedJob from "./pages/employee/AppliedJobs";
import ListCV from "./pages/employee/ListCV";
import websocketService from './utils/WebSocketService';
import { ChatMessage, Status, VIDEO_CALL_RESPONSE } from "./pages/chat/Messenger";
import { Client, Message as MessageStompjs, over } from 'stompjs';
import OTPInput from "./pages/OTP";
import { NotificationType, setNotifications, setUnreadCount } from "./redux/slice/notificationSlice";
import EmployerRoute from "./routes/EmployerRoute";
import EmployeeRoute from "./routes/EmployeeRoute";
import BrowseJob from "./pages/cms/BrowseJob";
import AccountManagement from "./pages/cms/AccountManagement";
import SidebarCMS from "./components/layout/SidebarCMS";
import CVManagement from "./pages/cms/CVManagement";
import Job from "./pages/cms/Job";
import JobCMS from "./pages/cms/Job";
import AdminRoute from "./routes/AdminRoute";
import Footer from "./components/layout/Footer";
import NotificationManagement from "./pages/cms/NotificationManagement";
import HelpSupport from "./pages/HelpSupport";

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

function SidebarCMSLayout() {
    const location = useLocation();
    const showSidebar = [
        "/cms/browse-job",
        "/cms/account-management",
        "/cms/notification"
    ].includes(location.pathname) ||
        /^\/cms\/job\/\d+$/.test(location.pathname);

    return (
        <div className="flex min-h-screen">
            {/* Sidebar chỉ hiển thị trên các trang có Sidebar */}
            {showSidebar && (
                <div className="w-64 bg-white shadow-md">
                    <SidebarCMS />
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
    const { showMessenger, toCaller } = useSelector((state: RootState) => state.messageReducer);
    const dispatch = useAppDispatch();
    const { userId, isLoggedIn } = useSelector((state: RootState) => state.authReducer);
    // Không hiển thị Navbar trên trang login và register-employee  
    const hideNavbarOnLogin = location.pathname === "/login" ||
        location.pathname === "/register-employee" ||
        location.pathname === "/register-employer" ||
        location.pathname === "/otp" ||
        location.pathname === "/generate-cv/:id" ||
        location.pathname.startsWith("/generate-cv/");
    const wsUrl = process.env.REACT_APP_BASE_WS_URL;
    const [showCallRqModal, setShowCallRqModal] = useState(false);
    const { notifications, unreadCount } = useSelector((state: RootState) => state.notificationReducer);

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

        if (userId && wsUrl) {
            try {
                websocketService.connect(userId.toString(), wsUrl);
            } catch (error) {
                console.log(error);
            }
        }
    }, [userId]);

    useEffect(() => {
        websocketService.subscribe('messenger', onReceive);
        websocketService.subscribe('notification', onNotificationReceive);

        return () => {
            websocketService.unsubscribe('messenger');
            websocketService.unsubscribe('notification');
        };
    }, []);

    const handleRefuseCall = () => {
        const acceptPayload = {
            fromUser: userId,
            toUser: toCaller?.id,
            status: VIDEO_CALL_RESPONSE.REFUSE,
        };
        websocketService.sendMessage(acceptPayload, '/app/accept');
    };

    const updateLstConvers = useCallback((chatMessage: ChatMessage) => {
        const converUserIdReceived = Number(Number(chatMessage.sender) === userId ? chatMessage.receiver : chatMessage.sender);
        dispatch(addMessage({ converId: converUserIdReceived, msg: chatMessage }));
    }, [userId]);

    const onReceive = (payload: MessageStompjs) => {
        const msgReceived: ChatMessage = { ...JSON.parse(payload.body), position: 'normal', direction: 'incoming' };
        if (msgReceived?.type != null) {
            updateLstConvers(msgReceived);
            if (msgReceived.status == Status.VIDEO_CALL_REQUEST) {
                setShowCallRqModal(true);
                dispatch(setToCaller({
                    id: msgReceived.sender,
                    fullname: msgReceived.senderName
                }))
            }
        }
    };

    const onNotificationReceive = (payload: MessageStompjs) => {
        const notificationReceived: NotificationType = { ...JSON.parse(payload.body) };

        if (notificationReceived?.read != null) {
            const currentNotifications = [...notifications];

            const notificationExists = currentNotifications.some(
                notification => notification.id === notificationReceived.id
            );

            if (!notificationExists) {
                dispatch(setNotifications([notificationReceived, ...currentNotifications]));
                dispatch(setUnreadCount(unreadCount + 1));
            }
        }
    };

    return (
        <>
            <main className="bg-[#f7fdfd] min-h-screen flex flex-col">
                {/* Chỉ hiển thị Navbar nếu không phải trang login hoặc register-employee */}
                {!hideNavbarOnLogin && <Navbar />}
                <div className={hideNavbarOnLogin ? "" : "pt-[50px] min-h-screen "}>
                    <Routes>
                        {/* Routes với xác thực */}
                        <Route path="/" element={<Navigate to="/find-jobs" replace={true} />} />
                        <Route path="/find-jobs" element={<FindJobs />} />
                        <Route path="/user-profile" element={<UserProfile />} />
                        <Route path="/job-detail/:id" element={<JobDetail />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/employer" element={<EmployerLanding />} />
                        <Route path="/help-support" element={<HelpSupport />} />

                        {/* Routes có Sidebar */}
                        <Route element={<SidebarLayout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/company-info" element={<CompanyInfo />} />
                            <Route path="/info-page" element={<CompanyInfo />} />
                            <Route path="/apply-job" element={<JobForm />} />
                            <Route path="/jobs/edit/:id" element={<JobForm />} />
                            <Route path="/company/detail/:id" element={<CompanyDetail />} />
                            <Route path="/resume/:id" element={<Resume />} />
                            <Route path="/change-password" element={<PasswordChangeForm />} />

                        </Route>

                        <Route path="/register-employee" element={<RegisterEmployee />} />
                        <Route path="/register-employer" element={<RegisterEmployer />} />
                        <Route path="/about-us" element={<About />} />
                        <Route path="/otp" element={<OTPInput />} />

                        <Route element={<EmployeeRoute />}>

                            <Route path="/applied-jobs" element={<AppliedJob />} />
                            <Route path="/saved-jobs" element={<SavedJobsPage />} />
                            <Route path="/list-cv" element={<ListCV />} />
                            <Route path="/resume" element={<ResumePage />} />
                            <Route path="/resume-content" element={<ResumeContent />} />
                            <Route path='/cv-preview' element={<CVPreview />} />
                            {/* <Route path='/generate-cv/:id' element={<CVGenerate />} /> */}

                        </Route>

                        <Route element={<EmployerRoute />}>
                            <Route element={<SidebarLayout />}>
                                <Route path="/applicants" element={<ApplicantsList />} />
                                <Route path="/job-posts" element={<JobPosts />} />
                            </Route>


                        </Route>

                        <Route element={<AdminRoute />}>
                            <Route element={<SidebarCMSLayout />}>
                                <Route path="/cms/browse-job" element={<BrowseJob />} />
                                <Route path="/cms/account-management" element={<AccountManagement />} />
                                <Route path="/cms/notification" element={<NotificationManagement />} />
                                <Route path="/cms/job/:id" element={<JobCMS />} />
                            </Route>

                            <Route path="/employer" element={<EmployerLanding />} />

                        </Route>
                        <Route path='/generate-cv/:id' element={<CVGenerate />} />
                    </Routes>
                </div>
                <Footer />
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
            <Loading />
            {<CustomModal isOpen={showMessenger} width='large' height='large' onClose={() => { dispatch(closeMessenger()); }} children={<Messenger />} />}
            {showCallRqModal && <CustomModal isOpen={showCallRqModal} onClose={() => setShowCallRqModal(false)} width='small' height='small'>
                <VideoCallRequest
                    fromUser={toCaller.id}
                    toUser={userId + ''}
                    fromUserFullname={toCaller.fullname}
                    setShowCallRequestModal={setShowCallRqModal}
                    handleRefuseCall={handleRefuseCall}
                />
            </CustomModal>}

        </>
    );
}

export default App;
