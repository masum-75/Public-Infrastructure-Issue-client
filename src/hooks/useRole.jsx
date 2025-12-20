import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth"; 
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: roleData, isLoading: isRoleLoading } = useQuery({
    queryKey: ['userRole', user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}/role`);
      return res.data;
    }
  });

  const role = roleData?.role || "citizen";
  const isPremium = roleData?.isPremium || false;
  const isBlocked = roleData?.isBlocked || false;
  const roleLoading = loading || isRoleLoading;

  return { role, isPremium, isBlocked, roleLoading };
};

export default useRole;