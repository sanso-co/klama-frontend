import { useCallback, useState } from "react";
import axios from "axios";
import { apiService } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { ErrorType } from "@/types/error";

export const useAuth = () => {
    const navigate = useNavigate();
    const { setUser, setTokens, setIsLoading } = useAuthStore();
    const [error, setError] = useState<ErrorType | null>(null);

    const login = useCallback(
        async (username: string, password: string) => {
            setIsLoading(true);
            setError(null);
            try {
                const {
                    accessToken: resAccessToken,
                    refreshToken: resRefreshToken,
                    ...userData
                } = await apiService.login({
                    username,
                    password,
                });
                setTokens(resAccessToken, resRefreshToken);
                setUser(userData);
                return userData;
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.data) {
                    const responseData = err.response.data as ErrorType;
                    setError({
                        status: responseData.status,
                        message: responseData.message,
                    });
                } else {
                    setError({
                        status: "error",
                        message: "An unexpected error occurred",
                    });
                }
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        [setIsLoading, setTokens, setUser]
    );

    const signup = useCallback(
        async (data: { username: string; email: string; password: string }) => {
            setIsLoading(true);
            setError(null);
            try {
                const {
                    accessToken: resAccessToken,
                    refreshToken: resRefreshToken,
                    ...userData
                } = await apiService.signup(data);
                setTokens(resAccessToken, resRefreshToken);
                setUser(userData);
                return userData;
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.data) {
                    const responseData = err.response.data as ErrorType;
                    setError({
                        status: responseData.status,
                        message: responseData.message,
                    });
                } else {
                    setError({
                        status: "error",
                        message: "An unexpected error occurred",
                    });
                }
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        [setIsLoading, setTokens, setUser]
    );

    const googleAuth = useCallback(
        async (accessToken: string) => {
            setIsLoading(true);
            setError(null);
            try {
                const {
                    accessToken: resAccessToken,
                    refreshToken: resRefreshToken,
                    ...userData
                } = await apiService.googleLogin(accessToken);

                if (userData.requiresUsername) {
                    sessionStorage.setItem("tempAuthToken", userData.tempToken);
                    await new Promise((resolve) => setTimeout(resolve, 100));
                    navigate("/complete-profile");
                    return;
                }
                setTokens(resAccessToken, resRefreshToken);
                setUser(userData);
                return userData;
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.data) {
                    const responseData = err.response.data as ErrorType;
                    setError({
                        status: responseData.status,
                        message: responseData.message,
                    });
                } else {
                    setError({
                        status: "error",
                        message: "An unexpected error occurred",
                    });
                }
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        [setIsLoading, setTokens, setUser, navigate]
    );

    const completeProfile = useCallback(
        async (username: string) => {
            try {
                const tempToken = sessionStorage.getItem("tempAuthToken");
                if (!tempToken) throw new Error("No temporary token found");

                const userData = await apiService.completeProfile(username, tempToken);

                sessionStorage.removeItem("tempAuthToken");

                setUser(userData);
                return userData;
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.data) {
                    const responseData = err.response.data as ErrorType;
                    setError({
                        status: responseData.status,
                        message: responseData.message,
                    });
                } else {
                    setError({
                        status: "error",
                        message: "An unexpected error occurred",
                    });
                }
                throw err;
            }
        },
        [setUser, setError]
    );

    return { login, signup, googleAuth, completeProfile, error };
};
