import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/404");
  }, [navigate]);

  return (
    <div className="bg-[#1E1E1E] text-white font-[Monolisa]">
      <h1 className="text-center text-[35px] font-bold">Oops!....</h1>
      <h1 className="text-center text-[35px] font-bold">Page Not Found</h1>
    </div>
  );
}
export default PageNotFound;
