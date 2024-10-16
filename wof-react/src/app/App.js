import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLoginPage from "../features/admin/services/Admin-LoginPage";
import {ThemeProvider} from "@mui/material";
import theme from "../components/common/theme/theme";
import HomePage from "../features/home/services/Home-Page";
import RegisterPage from "../features/user/services/RegisterPage";
import LoginPage from "../features/user/services/LoginPage";
import ExaminerLogin from "../features/examiner/services/ExaminerLogin";
import PrivacyPolicy from "../features/home/components/privacyPolicy/PrivacyPolicy";
import ExaminerDashboard from "../features/examiner/components/examinerDashboard/examinerDashboard";
import PrivateExaminerRoute from "../routes/private/PrivateExaminerRoute";
import PrivateUserRoute from "../routes/private/PrivateUserRoute";
import PrivateAdminRoute from "../routes/private/PrivateAdminRoute";
import AdminDashboard from "../features/admin/components/userConsole/AdminDashboard";
import UserDashboard from "../features/user/components/userConsole/userDashboard";



function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <div className="App">
                    <header className="App-header">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />

                            <>
                            <Route path="/user-reg" element={<RegisterPage />} />
                            <Route path="/user-login" element={<LoginPage />} />
                                <Route path="/dashboard/*" element={
                                    <PrivateUserRoute>
                                        <UserDashboard />
                                    </PrivateUserRoute>
                                }/>
                            </>
                            <>
                                <Route path="/examiner-login" element={<ExaminerLogin />} />
                                <Route path="/dashboard/examiner/*" element={
                                    <PrivateExaminerRoute>
                                        <ExaminerDashboard />
                                    </PrivateExaminerRoute>
                                }/>
                            </>
                            <Route path="/admin" element={<AdminLoginPage />} />
                            <Route path="/dashboard/admin/*" element={
                                <PrivateAdminRoute>
                                    <AdminDashboard />
                                </PrivateAdminRoute>
                            }/>
                        </Routes>
                    </header>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
