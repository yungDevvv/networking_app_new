"use client"

import { Fragment, useState } from 'react';

import { Calendar, Clock, ContactRound, EllipsisVertical, Handshake, Info, Link, Mail, MapPin, Phone, Search } from 'lucide-react';

import { useRouter } from "next/navigation";

import {
   Avatar,
   AvatarFallback,
   AvatarImage
} from "@/components/ui/avatar"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import MemberCardWeekSearch from './week-search/member-card-week-search';
import { useModal } from '@/hooks/use-modal';
import { useTranslations } from 'next-intl';
import { businessNetworksType } from '@/types/business-networks-type';
import { format } from 'date-fns';

const ContactCard = ({ member, meets }) => {
   const [contentOpen, setContentOpen] = useState(1);
   const [dropdownOpen, setDropdownOpen] = useState(false);

   const { onOpen } = useModal();
   const t = useTranslations();
   const router = useRouter();

   const businessNetworks = member.business_networks
      ? businessNetworksType.filter(el => member.business_networks.find(bns => bns === el.name))
      : [];

   return (
      <div className="min-w-[380px] max-xs:min-w-[325px] group bg-white rounded-xl p-5 max-xs:p-3 border border-gray-200 hover:border-indigo-500 hover:shadow-lg transition-all space-y-3">
         {/* Header section with avatar and basic info */}
         <div className='flex items-start gap-5'>
            <Avatar className="h-20 w-20 rounded-xl ring-2 ring-gray-100">
               <AvatarImage src={member.avatar} className="object-cover" />
               <AvatarFallback className="bg-indigo-50">
                  <img src={'/blank_profile.png'} alt="avatar" className="h-full w-full object-cover" />
               </AvatarFallback>
            </Avatar>

            <div className='flex-1 min-w-0'>
               <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                     <h2 className="text-lg max-md:text-base font-semibold text-gray-900 truncate">{member.name}</h2>
                  </div>
                  <DropdownMenu onOpenChange={setDropdownOpen} open={dropdownOpen}>
                     <DropdownMenuTrigger className="focus:outline-none">
                        <div className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                           <EllipsisVertical className="h-5 w-5 text-gray-500" />
                        </div>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="w-48">
                        {console.log(member)}
                        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/public-profile/${member.$id}`)}>
                           {t("view_profile")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" onClick={() => {
                           onOpen("invite-modal", { recipient: member, type: "networks" })
                           setDropdownOpen(false)
                        }}>
                           {t("invite_network")}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => {
                           onOpen("invite-modal", { recipient: member, type: "groups" })
                           setDropdownOpen(false)
                        }}>
                           {t("invite_group")}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => {
                           onOpen("create-meeting", { recipient: member })
                           // setDropdownOpen(false)
                        }}>
                           {t("create_meet")}
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
               {member.job_title && (
                  <p className='text-sm font-medium text-indigo-600 mb-0.5'>{member.job_title}</p>
               )}
               {member.company && (
                  <div className="flex items-center gap-2">
                     <p className='text-sm text-gray-600'>{member.company}</p>
                     {member.company_logo && (
                        <img
                           src={member.company_logo}
                           alt={member.company}
                           className="h-5 w-5 object-contain"
                        />
                     )}
                  </div>
               )}
            </div>
         </div>
         <div className='flex items-center gap-1'>
            {
               businessNetworks.length !== 0 &&
               businessNetworks.map((el, i) => <img key={i} className='w-[25px] h-[25px]' src={el.image} alt="network_logo" title={el.name} />)
            }
         </div>
         {/* Tab navigation */}
         <div className="flex border-b border-gray-200">
            <button
               onClick={() => setContentOpen(1)}
               className={`px-3 max-md:!px-2 py-2 -mb-px text-sm font-medium ${contentOpen === 1
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                  }`}
            >
               {t("contact")}
            </button>
            <button
               onClick={() => setContentOpen(2)}
               className={`px-3 max-md:!px-2 py-2 -mb-px text-sm font-medium ${contentOpen === 2
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                  }`}
            >
                {t("info")}
            </button>
            <button
               onClick={() => setContentOpen(3)}
               className={`px-3 max-md:!px-2 py-2 -mb-px text-sm font-medium ${contentOpen === 3
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                  }`}
            >
               {t("search")}
            </button>
            <button
               onClick={() => setContentOpen(4)}
               className={`px-3 max-md:!px-2 py-2 -mb-px text-sm font-medium ${contentOpen === 4
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                  }`}
            >
               {t("meets")}
            </button>
         </div>

         {/* Tab content */}
         <div className="min-h-[180px]">
            {contentOpen === 1 && (
               <div className="grid gap-3">

                  {member.week_searches.length !== 0 && (
                     <div className="rounded-lg p-3 border border-indigo-100 hover:border-indigo-200">
                        <div className="flex items-start gap-3">
                           <div className="bg-white rounded-lg">
                              <Search className="h-5 w-5 text-indigo-600" />
                           </div>
                           <div>
                              <h3 className="text-sm font-medium text-indigo-900 mb-1">Currently Searching For</h3>
                              <p className="text-sm text-indigo-700">
                                 {member.week_searches[member.week_searches.length - 1].text}
                              </p>
                           </div>
                        </div>
                     </div>
                  )}

                  {member.phone && member.show_phone && (
                     <a
                        href={`tel:${member.phone}`}
                        className="flex items-center gap-3 p-1 rounded-lg hover:bg-gray-50 group-hover:bg-gray-50/50 transition-colors"
                     >
                        <div className="rounded-lg bg-indigo-50 p-2 group-hover:bg-indigo-100 transition-colors">
                           <Phone className='h-4 w-4 text-indigo-600' />
                        </div>
                        <span className="text-sm text-gray-600 group-hover:text-gray-900">{member.phone}</span>
                     </a>
                  )}
                  {member.email && member.show_email && (
                     <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-3 p-1 rounded-lg hover:bg-gray-50 group-hover:bg-gray-50/50 transition-colors"
                     >
                        <div className="rounded-lg bg-indigo-50 p-2 group-hover:bg-indigo-100 transition-colors">
                           <Mail className='h-4 w-4 text-indigo-600' />
                        </div>
                        <span className="text-sm text-gray-600 group-hover:text-gray-900">{member.email}</span>
                     </a>
                  )}
                  {member.location && (
                     <div className="flex items-center gap-3 p-1 rounded-lg group-hover:bg-gray-50/50 transition-colors">
                        <div className="rounded-lg bg-indigo-50 p-2 group-hover:bg-indigo-100 transition-colors">
                           <MapPin className='h-4 w-4 text-indigo-600' />
                        </div>
                        <span className="text-sm text-gray-600">{member.location}</span>
                     </div>
                  )}
               </div>
            )}

            {contentOpen === 2 && (
               <div className="space-y-6 max-md:space-y-3">
                  {member.introduction && (
                     <div className="space-y-2 max-md:space-y-1">
                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                           Introduction
                           <div className="h-1 w-1 rounded-full bg-gray-300" />
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                           {member.introduction}
                        </p>
                     </div>
                  )}
                  {member.offering && (
                     <div className="space-y-2 max-md:space-y-1">
                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                           We Offer
                           <div className="h-1 w-1 rounded-full bg-gray-300" />
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                           {member.offering}
                        </p>
                     </div>
                  )}
                  {member.searching && (
                     <div className="space-y-2 max-md:space-y-1">
                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                           Looking For
                           <div className="h-1 w-1 rounded-full bg-gray-300" />
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                           {member.searching}
                        </p>
                     </div>
                  )}
               </div>
            )}

            {contentOpen === 3 && (
               <MemberCardWeekSearch member={member} />
            )}

            {contentOpen === 4 && (
               <div className="space-y-4">
                  {meets && meets.map((meet) => (
                     <div
                        key={meet.$id}
                        className="group bg-white rounded-xl p-4 max-xs:p-2.5 border border-gray-200 hover:border-indigo-200 hover:shadow-sm transition-all duration-200"
                     >
                        <div className="flex items-start gap-4 max-xs:gap-2 max-md:flex-wrap">
                           <div className="shrink-0">
                              <div className="bg-indigo-50 rounded-lg p-2">
                                 <Calendar className="h-4 w-4 text-indigo-600" />
                              </div>
                           </div>
                           <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                 <h2 className="text-sm font-semibold text-gray-900 flex-1">
                                    {meet.title}
                                 </h2>
                                 <span className="text-xs self-start font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                                    {format(new Date(meet.date), 'dd.MM.yyyy')}
                                 </span>
                              </div>
                              <div className="flex items-center gap-2 mb-1.5 text-sm text-gray-500 max-md:mt-2">
                                 <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span className='text-black'>{meet.location}</span>
                                 </div>
                                 <div className="h-1 w-1 rounded-full bg-gray-300" />
                                 <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span className='text-black'>{meet.start_time} - {meet.end_time}</span>
                                 </div>
                              </div>
                              <p className="text-sm text-gray-600 leading-thin">
                                 {meet.description}
                              </p>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
};

export default ContactCard;



