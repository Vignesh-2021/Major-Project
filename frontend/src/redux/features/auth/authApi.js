import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from "../../../utils/baseURL";

const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/auth`, // Fixed to match backend route
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token; // Assumes token is stored in Redux state
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (newUser) => ({
                url: "/register",
                method: "POST",
                body: newUser
            }),
        }),

        loginUser: builder.mutation({
            query: (credentials) => ({
                url: "/login",
                method: "POST",
                body: credentials
            }),
            invalidatesTags: ["User"],
        }),

        logoutUser: builder.mutation({
            query: () => ({
                url: "/logout",
                method: "POST"
            }),
            invalidatesTags: ["User"],
        }),

        getUser: builder.query({
            query: () => ({
                url: "/users", // Note: Backend endpoint not implemented yet
                method: "GET"
            }),
            providesTags: ["User"],
        }),

        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `/users/${userId}`, // Note: Backend endpoint not implemented yet
                method: "DELETE",
            }),
            invalidatesTags: ["User"],
        }),

        editProfile: builder.mutation({
            query: (profileData) => ({
                url: "/edit-profile", // Note: Backend endpoint not implemented yet
                method: "PATCH",
                body: profileData
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

export const { 
    useRegisterUserMutation, 
    useLoginUserMutation, 
    useLogoutUserMutation, 
    useGetUserQuery, 
    useDeleteUserMutation, 
    useEditProfileMutation 
} = authApi;

export default authApi;