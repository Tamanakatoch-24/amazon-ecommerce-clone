import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Auth() {
    const navigate = useNavigate();
    const { currentUser, login, signup } = useContext(AuthContext);

    const [step, setStep] = useState("identifier");
    const [isExistingUser, setIsExistingUser] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");

    const onChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onContinue = (e) => {
        e.preventDefault();
        setError("");

        const normalizedEmail = String(form.email || "").trim().toLowerCase();
        if (!normalizedEmail) {
            setError("Enter mobile number or email");
            return;
        }

        const rawUsers = localStorage.getItem("amazon_clone_users");
        const users = rawUsers ? JSON.parse(rawUsers) : [];
        const exists = users.some((u) => u.email === normalizedEmail);
        setIsExistingUser(exists);
        setStep("credentials");
    };

    const onSubmitCredentials = (e) => {
        e.preventDefault();
        setError("");

        const action = isExistingUser ? login : signup;
        const payload = isExistingUser
            ? { email: form.email, password: form.password }
            : { name: form.name, email: form.email, password: form.password };

        const result = action(payload);
        if (!result.ok) {
            setError(result.message || "Unable to continue");
            return;
        }

        navigate("/");
    };

    return (
        <div className="auth-page-wrap">
            <main className="auth-shell">
                <div className="auth-logo-wrap" aria-label="Amazon logo">
                    <span className="auth-logo-text">amazon</span>
                    <span className="auth-logo-in">.in</span>
                </div>

                <section className="auth-card">
                    {currentUser ? (
                        <>
                            <h1>Signed in</h1>
                            <div className="auth-signed-box">
                                <p>
                                    You are signed in as {currentUser.name} ({currentUser.email})
                                </p>
                                <button type="button" className="auth-submit-btn" onClick={() => navigate("/")}>
                                    Continue shopping
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h1>Sign in or create account</h1>

                            {step === "identifier" ? (
                                <form onSubmit={onContinue} className="auth-form">
                                    <label>
                                        Enter mobile number or email
                                        <input
                                            name="email"
                                            value={form.email}
                                            onChange={onChange}
                                            placeholder=""
                                            autoFocus
                                        />
                                    </label>

                                    {error && <p className="auth-error">{error}</p>}

                                    <button type="submit" className="auth-submit-btn">
                                        Continue
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={onSubmitCredentials} className="auth-form">
                                    <p className="auth-email-row">
                                        {form.email}
                                        <button type="button" onClick={() => setStep("identifier")}>Change</button>
                                    </p>

                                    {!isExistingUser && (
                                        <label>
                                            Your name
                                            <input name="name" value={form.name} onChange={onChange} placeholder="First and last name" />
                                        </label>
                                    )}

                                    <label>
                                        Password
                                        <input type="password" name="password" value={form.password} onChange={onChange} autoFocus />
                                    </label>

                                    {error && <p className="auth-error">{error}</p>}

                                    <button type="submit" className="auth-submit-btn">
                                        Continue
                                    </button>
                                </form>
                            )}

                            <p className="auth-terms">
                                By continuing, you agree to Amazon's
                                <a href="#"> Conditions of Use </a>
                                and
                                <a href="#"> Privacy Notice</a>.
                            </p>

                            <div className="auth-business-box">
                                <h3>Buying for work?</h3>
                                <a href="#">Create a free business account</a>
                            </div>
                        </>
                    )}
                </section>
            </main>

            <footer className="auth-global-footer">
                <div className="auth-global-links">
                    <a href="#">Conditions of Use</a>
                    <a href="#">Privacy Notice</a>
                    <a href="#">Help</a>
                </div>
                <p>© 1996-2026, Amazon.com, Inc. or its affiliates</p>
            </footer>
        </div>
    );
}

export default Auth;
