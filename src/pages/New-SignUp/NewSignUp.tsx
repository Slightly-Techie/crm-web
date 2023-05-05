import stars from "../../assets/icons/Stars.png";
import rocket from "../../assets/icons/big-blue-flying-rocket.png";
import useNavigateForms from "../../Hooks/useNavigateForms";

let NEW_USER_DATA = {
  email: "",
  phone: "",
  portfolio: "",
  languages: "",
  experience_yrs: "",
  experience_summary: "",
  twitter_handle: "",
  linkedin_profile: "",
  working: "",
};

function NewSignUp() {
  const { handleSubmit, next, previous, currentForm, currentFormIndex } =
    useNavigateForms();

  function onSubmit(data: any) {
    NEW_USER_DATA = { ...NEW_USER_DATA, ...data };
    console.log(NEW_USER_DATA);
  }

  return (
    <div className="w-full bg-white dark:bg-[#111111]">
      <div className="w-screen h-screen grid lg:grid-cols-2 bg-[#Fff] dark:bg-[#111111] max-w-[1440px] mx-auto">
        <div className="new-sign-upbg hidden lg:block  ">
          <div className="flex flex-col gap-4 justify-center p-8 w-4/5 mx-auto  h-full">
            <img
              src={stars}
              className=" w-36 object-contain h-8 "
              alt="stars"
            />
            <h1 className="text-[3.5rem] text-white font-bold ">
              Welcome to{" "}
              <mark className="text-[#ffffffd8]">Slightly Techie Network</mark>
            </h1>
            <img
              className=" aspect-square w-20 object-contain "
              src={rocket}
              alt="rocket"
            />
          </div>
        </div>
        <div className=" p-8 lg:w-5/6 mx-auto h-4/5 my-auto flex flex-col gap-4 ">
          <section className="flex text-[#000] dark:text-[#fff] mx-auto text-[1.5rem] font-medium justify-between">
            <h3>{currentForm.category}</h3>
          </section>
          <form onSubmit={handleSubmit(onSubmit)}>
            {currentForm.element}
            <section className="flex gap-4 justify-end">
              {currentFormIndex !== 0 && (
                <button
                  onClick={previous}
                  type="button"
                  className=" px-6 py-3 bg-[#001] dark:bg-white text-white dark:text-[#000] rounded-md"
                >
                  Back
                </button>
              )}
              {currentFormIndex <= 2 && (
                <button
                  onClick={next}
                  className=" px-6 py-3 bg-[#001] dark:bg-white text-white dark:text-[#000] rounded-md"
                >
                  {currentFormIndex === 2 ? "Submit" : "Next"}
                </button>
              )}
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewSignUp;
