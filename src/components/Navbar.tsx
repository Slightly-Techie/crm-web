import { useState } from "react";
import { Link } from "react-router-dom";
import { getUserProfile } from "../services/api";
import { userProfile } from "../types/type";
import { useQuery } from "react-query";

function Navbar() {
  const [user, setUser] = useState<undefined | userProfile>();
  const query = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    onSuccess(res) {
      setUser(res.data);
    },
  });

  return (
    <div className="w-full  flex items-center justify-between py-6 px-10 border-b border-[#DCDDE1]">
      <div className="p-3">
        <h1 className="font-bold text-xl text-[#3D4450]">
          Slightly Techie CRM
        </h1>
      </div>

      <div className="gap-16 flex">
        <button className="nav-btn px-6">Recent Activity</button>
        <button className="nav-btn px-6">Marketplace</button>
        <button className="nav-btn px-6">Scoreboard</button>
      </div>

      <div className="flex items-center gap-4">
        {query.isSuccess && (
          <>
            <h2 className="font-bold text-xl text-secondary">
              Welcome {user && user.first_name}!
            </h2>
            <Link to={"/profile"}>
              <img
                className="w-12 h-12 rounded-full"
                src={
                  user?.profile_pic_url
                    ? user?.profile_pic_url
                    : `https://avatars.dicebear.com/api/initials/${user?.first_name} ${user?.last_name}.svg`
                }
                alt="profile"
              />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
