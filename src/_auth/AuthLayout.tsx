import { Outlet, Navigate, useNavigate } from "react-router-dom";

const AuthLayout = () => {
  const isAuth = false;
  useNavigate();

  return (
    <>
      {isAuth ? (
        <Navigate to="/" />
      ) : (
        <div className="flex w-full">
          {/* Left Side */}
          <section className="flex w-full flex-col flex-1 justify-center items-center py-10">
            <div>
              <Outlet />
            </div>
          </section>

          {/* Right Side */}
          <img
            src="/assets/images/side-img.svg"
            alt="side-img"
            className="hidden md:block w-1/2 h-screen object-cover bg-no-repeat"
          />
        </div>
      )}
    </>
  );
};

export default AuthLayout;
