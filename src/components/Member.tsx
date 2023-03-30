import React from 'react'
import Search from "../assets/icons/search.png"
import ProfileImage from "../assets/icons/bryan.png"
import Circle from "../assets/icons/circle.png"
import { MemberProps } from "../shared/type";



const Member = ({ data }: MemberProps) => {
  return (

    <div className="border-[#DCDDE1] border rounded-md p-4">
      <div className="flex items-center gap-4 mb-2">
        <img src={data.profile_image} alt=" image" />

        <div>
          <h3 className="text-lg font-medium">{data.name}</h3>
          <p className="font-medium text-[#5D6675] text-sm">{data.location}</p>
        </div>
      </div>

      <div>
        <p className="mb-2 inline-flex items-center gap-1 rounded-sm bg-[#F1F6F7] p-2 font-medium text-[#5D6675] text-sm">
          <img src={Circle} alt="circle" />
          Visit Website
        </p>
      </div>


      <div className="mb-2">
        <h2 className="font-medium text-[#5D6675] text-sm">Work Experience</h2>
        <div className="flex flex-wrap gap-2 mt-4">
          {data.work_exprerience.map((item, i) => (
            <p key={`work-${i}`} className="font-medium text-[#5D6675] text-sm">{item},</p>
          ))}
          <p className="font-medium text-[#5D6675] text-sm">+3 more</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <p className="flex bg-[#F1F3F7] rounded-3xl p-2 text-xs">Software Engineering</p>
        {data.stack.map((item, i) => (
          <p key={`stack-${i}`} className="bg-[#F1F3F7] rounded-3xl p-2 text-xs">{item}</p>
        ))}
      </div>
    </div>

  )
}

export default Member