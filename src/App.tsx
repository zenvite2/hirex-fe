import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Navbar, Login, Sidebar } from "./components";
import {
  About,
  AuthPage,
  FindJobs,
  JobDetail,
  UserProfile,
  EmployerLanding,
  Dashboard,
  JobPosts,
  ApplicantsList,
  CompanyInfo
} from "./pages";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

// Layout cho các route yêu cầu xác thực
function AuthenticatedLayout() {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.user);

  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate to="/user-auth" state={{ from: location }} replace />
  );
}

// Layout cho các route có Sidebar (chỉ hiển thị Sidebar ở những route cụ thể)
function SidebarLayout() {
  const location = useLocation();
  const showSidebar = ["/dashboard", "/company-info", "/job-posts", "/applicants", "/info-page"].includes(location.pathname); // Hiển thị Sidebar ở những route này

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
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <main className="bg-[#f7fdfd]">
      <Navbar />
      <div className="pt-[80px]">
        <Routes>
          {/* Routes với xác thực */}
          <Route element={<AuthenticatedLayout />}>
            <Route path="/" element={<Navigate to="/find-jobs" replace={true} />} />
            <Route path="/find-jobs" element={<FindJobs />} />
            <Route
              path={user?.accountType === "seeker" ? "/user-profile" : "/user-profile/:id"}
              element={<UserProfile />}
            />
            <Route path="/job-detail/:id" element={<JobDetail />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Routes có Sidebar */}
          <Route element={<SidebarLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/company-info"  element={<CompanyInfo />} />
            <Route path="/job-posts" element={<JobPosts />}  />
            <Route path="/applicants" element={<ApplicantsList />} />
            <Route path="/info-page"  element={<CompanyInfo />} />
          </Route>

          {/* Các route khác */}
          <Route path="/employer" element={<EmployerLanding />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/user-auth" element={<AuthPage />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
