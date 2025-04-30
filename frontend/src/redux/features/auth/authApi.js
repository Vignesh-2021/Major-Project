import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from "../../../utils/baseURL";

const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/auth`,
        credentials: 'include',
    }),
    tagTypes: ["User"], // ✅ Added tagTypes to enable caching
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
            invalidatesTags: ["User"], // ✅ Invalidate cache after login
        }),

        logoutUser: builder.mutation({
            query: () => ({
                url: "/logout",
                method: "POST"
            }),
            invalidatesTags: ["User"], // ✅ Invalidate cache after logout
        }),

        getUser: builder.query({
            query: () => ({
                url: "/users",  // ✅ Ensure this is the correct API endpoint
                method: "GET"
            }),
            providesTags: ["User"], // ✅ Now Redux knows to fetch fresh data when needed
        }),

        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `/users/${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"],
        }),

        editProfile: builder.mutation({ // ✅ Fixed typo from `editProfle`
            query: (profileData) => ({
                url: "/edit-profile",
                method: "PATCH",
                body: profileData
            }),
            invalidatesTags: ["User"], // ✅ Ensure UI updates after profile edit
        }),
    }),
});

export const { 
    useRegisterUserMutation, 
    useLoginUserMutation, 
    useLogoutUserMutation, 
    useGetUserQuery, 
    useDeleteUserMutation, 
    useEditProfileMutation // ✅ Fixed
} = authApi;

export default authApi;
