import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: roleData, isLoading: isRoleLoading } = useQuery({
        queryKey: [user?.email, 'userRole'],
        
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/role/${user?.email}`);
            return res.data; 
        }
    });

   
    const role = roleData?.role;
    const isPremium = roleData?.isPremium;
    const isBlocked = roleData?.isBlocked;

    return { role, isPremium, isBlocked, isRoleLoading };
};

export default useRole;