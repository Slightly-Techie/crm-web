import ImageBG from "../../assets/imgs/magic-pattern.jpg"

const InactiveUser = () => {
  return (
    <main className="h-screen flex flex-col justify-center items-center bg-[#020202]">
        <section className="w-full h-full bg-[#020202] text-white p-5 flex flex-col justify-center items-center">
            <h1 className="text-4xl">Oops!😔</h1>
            <p className="text-2xl text-center pt-5">Your account is not yet active. You will be notified when it is activated.</p>
        </section>
        <img src={ImageBG} alt="inactive-user" className="w-full h-[50%] object-cover"/>
    </main>
  )
}

export default InactiveUser