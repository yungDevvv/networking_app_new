"use client"

import { Fragment, useState } from 'react';

import { ContactRound, EllipsisVertical, Info, Link, Mail, MapPin, Phone, Search } from 'lucide-react';
// import { companiesList } from '../utils/companies_data';
// import { hashEncodeId } from '../../hashId';

// import { useModal } from "../context/ModalProvider";
import { useRouter } from "next/navigation";

const companiesList = [
   {
      name: "BNI",
      image: "data:image/webp;base64,UklGRlYDAABXRUJQVlA4IEoDAAAwEgCdASo4ADgAPjEKjEYiEREMACADBLMAPQL6N+MHPARAyQPmh/DflH/Se0B4lv9u6gHmA/YD0a+oA/TvrT/Qz8sL2QP2G/ZD2kblL4J+DPwhHFop/vuZa/JfLPvnOiUZBJoG+k/Rg6xy/Rxnd8TGLQPDzQKma07g1SdvVH1qQ3eLLVbqrVRS8W6MkdYBU3PsHGuL+QWz/d6AAP7/fIJ/5lO7bR+gJ6L4jBPQIdaxTD6PIHyBtPcfb57oazGqRaB3xupmJPefsHP1URur7bjq3iAyhW/o1VEGuL/8CmMcGRLW4ymPHeL/zl9izNMqrcDS2E49Acn//8Fz06mBiDvsBb9//nozqzaJZ8q1Gf4VX3/2cX93UOE8GfEoIPaucLeK82vR3POg+vaL+Pgzzzu2yMIs6p2LS6R8EDbEK05r3h/Kj0Rqwj1SHdCl3SrknJEHLwHITrvCAOjqAFyEc5oyorq9qe3NYMdyQZY5OwH1u/1P/iguZlaJQBTkTuyyo//8//88WP5mLCDAl0civL0vh74wvjXE6FgtJ9bQrWWVI9DDj9Zhn86H25y8bNH50WbQ3jra/P98C8+xX+t8w6K+KdW2Zp7iZnmBnaeAoo7S7Lfrc0Rtpj22uPjamqniGf5rDGLHZUiqL/55Invq6fvViWfhr/hQ2yu4gtFljjfkxHiqjn/HA4tSjv4146drIJNXl/I//5a6I387CHBR7F+9TsG2E/87am+R5+4bBN1WWHHeGbZfRWhIMtWJjtGaD+Kg2Ycw4rB9iuWxf/rxCOsKq0wGSAT8j87mBayZps45tSyEytH6sAv4U0i+aZcS54A+As9UYmyHEH6VA/1U8M8lWExibRZCpMSmr/aKYpwQjQ7fSm/j35vg7OPA4lwcAGizbIfsZJafR30hzfIcG54lt1vWWMccE7V9ZH5/q+HneEld9AI++AVpZjXypwERu+jlaVL6NO9u0/69cmm2AYGSx/6URrG86RryH/whmpGP9biYPPV2/8NKhiessbxkzzlVfyCA1ex/sAq09FzE7SsekdXAsooPJrG4Kz9ICf6XM71HGJurp635mBLfku+DAvz6Ynow9PB7Kk2YsuCxYu996EA8Ij3YAAAAAA=="
   },
   {
      name: "Business Festival",
      image: "data:image/webp;base64,UklGRtoDAABXRUJQVlA4IM4DAAAwFACdASo4ADgAPjEOjEYiEREKACADBLIAYIsAvzP8QO2A0HzD8O+dM5Y6HcQZngfarvgPMB+rn6V9g70AP0a62b0Gv2d9Mz2Of25/Yj2iqXR9L/HD9yMw/+K8mtwrNlfFQTF/7H6Deg5UL/LNBEBmRNdvcjW9J3yQIlFHnP8cTxGLm4Gvu2k+UgCgXIUHaygMgyn/2ylrip7DhtRlhE8D+6TZNZgOH6YAAAD+//4Y4B63onctKp4jGBdMHwg6r/NiWNvZ/6UUqLjEr3OksIJOCAUpnzVs8YGewnCh/XPIy/qLkl3SV8fXQ3ww6Rm/Fc+N6QHQsVg3ev+uY/xD+O3/q5S8hOHtwDfcYRjFKQ1cPAo/sP7dogiwe4lFKN54n//Dz/l2fTX8jhUbR1mYKOR5rF04IX0oBWzq3uzhwftTPa+f1VgNpQ7QPHESASIHZbfNUHfyMOOuofwY98ecpY6/PdtgP8Z5PFOeqNPh/je+WHBJ++wWZYaIy+ta1khoFTW3ACc2RDldlNYmwt4BeqkPGQlrA8MTfo9C3Mu+ru6NqX//xYfgsZZJOkMV6oND8f3v0yNYYytq+j/0rEOjZf/HTvnD8zNA3HpBkQb0Dv5fmsuhNfMSecQou6XbKg3//KH/vwacEROlF8fPYp4A624Fd0S6cA6H5wavQA3Lg2GqPsdx2TwfgZyTDu69I78hXcI4oZ9tZufl2s/s9oElwwL4oGaSed9W9b+CMlYw7d4NR+40UtGo4C6fxGXYcZVFpLHJ2L/rb9Xe8u9w4byQYOrb4HwMLraLVsOHcRG4vdV4nu6AzlDliyAszF1nZGDFmjxkNyzvAva262QXiJKG16hp1CqqzSJwO8jT7te/kLU4phzSe3J8Ce1FqJj6d2VIQXMiTWfF2z32ad8Syl4uGnzs4LZ2CHOHa03Inf3/fcv6eUkp8xrzmNE4vg+V9dxJv4uP4GnDiYqQciio3OT/ljOvwa9Yl6K7PV7jVg8bj32nPYsbBwHgOFWhHvcLlm5W1QLmEpluaL/CpW+aohaZ3/vNTcLLJnvz+GwqCdrNYOd2qjzA0nnTU6dnV3cN93D8WJ1KN6byQckbi7ZydF6UdtsNvTns8JucjOHIQVmeNWl8IKWm5UKwv8PwyU99S49feae1/buAkeQL/7q1f6NX+4X7eOrxuLKS8Z2Hay6dWM8BzmrkyXEpqIx3nQh8Kep17FRMbPt0tANHeLJsXxF99aHRbSq1f24iG7zi2OB8bRLE273dQcucyw1evmLEwCpjZMIhycSXU6xCD+kqj/oAAA=="
   },
   {
      name: "Boost",
      image: "data:image/webp;base64,UklGRlYEAABXRUJQVlA4IEoEAAAwFgCdASpAAEAAPi0Ki0WhkNDN+BgCxLYAVyrG/wD8QOlKmnyv8c/ZFp78a+4v465BZ7zfc/ue7QH2ge4B+g/9E/jX4s9yjzAfxb+v/8f/Pdhv0AP6x/pOsL9ADyy/Ya/Yj9m/Z2/+d2FkQI+fOn/1Pjf+lPRn6wDUT5iPLRh25mk4HT7YqJYS78I0BXbYoeIRvJMpf1lTQGu4GnaexPb5BT2gceoWGety9FSWZ7wc6fFKc2y/PQVA7gAA/v6lh7i/F5PO1oes/LI1CdkYdQqf21wvXpAK77//bd+TtTWBn6viVKn1FqRCWTbQHJejUaudOVtVFeEpKtDp2nf/wZLd1qkHLKTBmYMBVNXm7TMvpx6nmIqhFGIy2D3fea5Yb9guHT/VkL9w3MK2AFGNJ5OWvmC6SJ8P7abxt7ajFgAwKK0zCCltepHsUbi3V09/wLRbJkwCcNUZ2z83Jo7SxDxuuL/xdvi0yhms6S6IX251qJwJFDvcNp/uoPLmimV7vVyi4Yj+XalpqEwgT1cGOQbKGL+TgdO1E4sP/oXFerJ0oSF/nWryH1yjYhJrmcV0rCaTJWPBLN//8pbeC9zSMnLuCnAFx0PgwpcNtYoRBdLXVbJWBtI/FUREh6Oe8rTf4kgq/7coBspUD253BY4gjYdx70l3Zhhta9vvoLRN0f0e9PSLlXTGo0cqX+HTmCeCW59+Uf6d0E+3APfgNVch9Z0BgUj2mLxXg/hYCJTmoTv2qxxND3BIUl/h9xXLXzXss5ZeSBIShGRbpqv1sgxf/cne1GwryDlHUavMdVT1iA6Yn9OjwZCOK62Zc0pRtmZvdjTO6bJ+aIkSLS5+ZmTUw/9mkAKYG0+mYkcBUT3ri6V/W9bPtcdCzgq32RnNPLtJnbwLeaxO3DaqGNa87uppx2aYxjiehcN3mqy1rwI4vh0QN+QlHTk/i7MsmEfTWaBHUuTQJfMemEBlL+TWFBU4CiYgaie6yY8a9nH8M+eXlZ4Qto0J/5+DU6fgt8xPrNgBD9UVxOHlSATvGC3iKDnMtXPncP+UV0Ki1xN2XQ/x0kPDWyEI9L8s5YL9XoaGKV/8NvxOPbamDWBmBzi0yMOV+pvML5t/xpqNJ2dYLreA+sIC7qpDStftwlYMCsxJ3DzZ8GfMIuOMoc2zdVMNmmMAB+M0ds+eiBPPiR3URw5jq+FvRFJ+jVLKapJ1pCPbk/Z8d7G5J/HGUHiRqiUmvfD5MenkbqBwRQYqqBWU80M+UazxeR526byAcb/uVpCAY4nI4iyonGrv2Wva4PUVESmoCblvCrXzSQmrruQ167T26QQuOA/kF/+/dmw4fe96fy1qV2f4HmpA8wkc7WP/Lw65d2Ehqkn/70YCsA/gGlnXkJBEasVxdK/i38nC1FMULF/Lmd8Nc4lFb1LvTVHWWf35VirSVtbH00A1AmVu9zQEQHO/unAkkO/dKtfAAAA="
   },
   {
      name: "Suositus.fi",
      image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAS1BMVEVHcEx5u+NLm9I/kcxAkcw6jss4jco3jcpGlM0+kMtep9hbnNBHlM48j8tNoNVTuupUruBHtedDtOdMt+hHtedCk81Lt+g/kcxQmc/rTGjuAAAAGHRSTlMAD0OMo/b//2XRHi58509bN97/g9KFqrmy1uvdAAAAl0lEQVR4AcXNRxLEMAgAQZRQcs7/f+mqWOMsXz03VQuAcwLyCfmCUr2gNnkTaF0WPSKGnNmEJj5RgRYplSHKGpej27QoL2Z9YAsVyAMnilA3KzrrG6iY6dF2PV+09JnYlhJk23VHRGJnEjVDoh1H/JeY6YhcrAke0T6g+gCdfUEo7R0FcPqK02pUmBkvxMw4BbgX9ZLwSD+5ORFzIOXX/wAAAABJRU5ErkJggg=="
   },
   {
      name: "Suomen yrittäjät",
      image: "data:image/webp;base64,UklGRsYGAABXRUJQVlA4WAoAAAAQAAAAPwAAPwAAQUxQSK8BAAARkCTJtlsp57THuyHsfz+wgp7i+UbftN49ByM9vXdF9DgiJgCPV9ZdZCMAuBoAmIe4OdmOmrBtgDmIi8Fyw7AB9iOudpYbywPATsRguaN8AnsQVwe5s3wBNiMGy93lHdiI2IdTxhlsQhzkpGGwAS+GcNo4g8twlhPHAYt54eTvlxAb5dI9WIddOHkcUM07r/BdFfbKp481vPMq7yqwUT810Kc5XjthC/sDpzAoQWPMerX/C66J/8CRIqxlMqZSRiiWOYMqxpVUjiW8CtVY6WS5MiKkZCpjCc1ZVihVlDKOpSaiFGdSKWMpJSoUEblUSoRU0biHHSUipBzRRlFKeKGWxNQF3Dgk/6t2Bv9Bs1KmrCnJy2abRZ26bNSoTMmt9TDDOzeW/5Xbv+QUsFWb3howzzt3lJr5CeeAnfJpQC3vvMJnrAGOyqYB9bz6qVwawDqQTg5i8VaZtMNyYog8sQGXgTgrSxxBtCSkHLED0ZYYrX7yDkRrAofope0FiI7ExuohfwHRl8B3q5V8/xREd+Lim9VC/vwWSQmcbatGtk+vwSwAAeBU83ADgEhOVBOPVwBWUDgg8AQAAPAcAJ0BKkAAQAA+MRCMRiIREQkAIAMEtIAK9J/iP0q+TP9T/C39vO1d79+nHos/sG0P+vX0/8jfy05wd4h/Bf6v+SH5c7wJI1/Ff6P+ZP8n1zP8f/pf5qfy32Sf7N3HfYA/if8R/uv9M/XD/Jf//4if0b8qv8h7L/i3+y/kz/FvsB/hf8P/q39F/vf+t/un/6/432gepj9GvYE/Qj+dfX+idWOilm3ZQndTCWPw4bDSQfbeNJfGC3JNC1R6RbGa9YBqTF0oBkgdaTZxjcrfOxkYsHwWGoQti7td2m4lZ9RPZ3P8t+kLvM0K53UbBdkwAAD+/MR9Sp//DbPpPvX5GmJIYC6mo4thAA5aa152M/zTpD+BMFWBPrUb+2CH/pFUNDuYRZ1CnBQKsqj3zZnUWWs7kLxDcCjOeJ//fVal1lSqfHFNzPunZbJ//h+dh01NemZPIBgpsz0u2bZQ+iIfG/s8R9YBvRNzM0NzNAxLDqVQO+TYQ+NlrajgPJflcfIa12fmI8htx7t88Ql+NSLuQ661q29VDRniY1WRKACsqCqBKz4VHDRsIRbCHRd2LMVjt1bQsIWjlLJ0UosfW3A9aogtIdgcWuTeVYf1j+NRSIPkLO+YL8kIjY6y6DBU1NM5SwABMa8EhxpWXBufkv8Iz9En/yD/tbzgFr/TkKHllQY88EMorGTxbaQzvwANiS3Q9zAu4vKWGXbeVCjyRaHg7wxOzqBzB4mfiO2z2+n5JXvc5mfQ6/PfOHe3lS3+KimIQImyHeUvTn1Fv2/rlq1NUqAyJescBuzsbh+E3Ru7DsIpcjs9aW7nuSCY/QbnqRqny5M92MT/GRi+zZkpLyGY/Maw//IrsnENZ822TYLQRhX5SFhQlwkB19xLNoR8I3AyUO0r/oFWrhlAayNhgGwAAt9DVDybDUt1grGAdL9nxfBOGQs5xxh+xvgzhJcldanPdZ0NRLXjUL0TlQ2b9ROyXfMAkm04a99UqCvxX06R5JFS3Z3UZjuFtvR0a9HwPAIDrvyWntyYU0l95nb5pTtP+alAdCy4oG5cWMQ8BsW2GettMEaR5I8hoTEhATSvTu/SdRTrhMme6LshTXr2HDIyyPTB2dJAgWQx+5S8AVO32h+V+BChPvz+OgbABe3581EkG6cr4wqRqXDbhbkf5OZ6Wbmvv/fWm8oW+StWpBTdEZaREPOyQPnWoDx8SfkMeQAvolPo4wAc2PYidZ021Q6s2p2AnG6N3/BmbpQ38Ib/LxBJQcpjFRiClbXe191FBlO75jktUBC4n11PsikMHz2p57jX+cN/cyZG4sFDk64o9NApMQHbVE4Lolc+Z0gYzXmqICcIYp/O4v9Qlqu24zm/LJcj1hJbKO3c79tXjhlKZxegx1qlXJZq1E5/JxK//bBwDY2pU/HX9p4/qwqX3QsX+PsdTPhMcA14sFKNupK8IKBNrJF8eBV3gCGpAIWioYd38YWmdba7bC6Af//6t9GC+YXhs6yQcY0P+XR+L6Z59JdUIK/XQstziyKeUcL1k1XaK68E+XwF21w+g2lbry5XeSJ2533kRYAQveRscYhTYykfQ0HXM/Y9U7Cc0HYJL//N1RgEo+UJJrtlDz6Fcvjhc4EbW+OJOmKgF45x1kjWf9fmBYmbGumWPCGLCFfeQho72zMWXR4n/zRNRLXf7NAAAAA="
   },
   {
      name: "Keuke",
      image: "https://www.keuke.fi/client/keuke/images/logo-black.png"
   },
 ];

import MemberCardWeekSearch from './week-search/member-card-week-search';

const MemberCard = () => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [chooseGroupModalOpen, setChooseGroupModalOpen] = useState(false);
   const [contentOpen, setContentOpen] = useState(1)

   const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

   // const { openModal } = useModal();
   const router = useRouter();

   // const handleAddToNetwork = (profileId) => {
   //    router.replace(`?profileId=${profileId}`);
   //    openModal("choose-network")
   // }

   // const highlightText = (text) => {
   //    if (!searchTerm) return text;

   //    const regex = new RegExp(`(${searchTerm})`, 'gi');
   //    const parts = text.split(regex);

   //    return parts.map((part, index) => (
   //       regex.test(part) ? <span key={index} className="bg-yellow-200">{part}</span> : part
   //    ));
   // };

   const businessNetworks = companiesList;


   return (
      <div className={`bg-white shadow-md rounded-lg p-4 border border-gray-100 relative`}>

         {/* Actions Menu */}
         <div className="relative text-right -mb-3">
            <button
               // onClick={handleMenuToggle}
               className="text-gray-500 hover:text-gray-700 ml-auto h-5"

            >
               <EllipsisVertical size={20} />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
               <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg text-left">
                  <ul className="py-1">
                     <li>
                        <a href={`/profile/#hash`} className="block underline px-4 py-2 text-indigo-500 hover:text-indigo-700 hover:bg-gray-100">Näytä profiili</a>
                     </li>
                     <li>
                        <button  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left">Kutsu verkostoon</button>
                     </li>
                     <li>
                        <button onClick={() => {
                           // setChooseGroupModalOpen(true)
                           // router.replace(`?profileId=${member.id}`);
                        }} className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left">Kutsu ryhmään</button>
                     </li>
                     {/* <li>
                        <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Change Role</a>
                     </li>
                     <li>
                        <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Add to Contacts</a>
                     </li>
                     <li>
                        <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Send Message</a>
                     </li> */}
                  </ul>
               </div>
            )}
         </div>
         <div className='flex items-center'>
            <div className='mr-5'>
               <img className="w-24 h-24 rounded mx-auto object-cover" src={'/blank_profile.png'} alt="Avatar" />
            </div>
            <div>
               <h2 className="text-md font-semibold">Semen Meliachenko <span className='font-normal text-red-500'> (ADMIN)</span></h2>
               <p className='text-indigo-500'>Software Engineer</p>
               <p>RespaSolutions Oy</p>
            </div>
            <div className='ml-auto'>
               {
                  businessNetworks.length !== 0 &&
                  businessNetworks.map((el, i) => <img key={i} className='w-[20px] h-[20px]' src={el.image} alt="network_logo" title={el.name} />)
               }
            </div>
         </div>
         <div className='w-24 h-[50px] mt-1'>
            <img className='w-full h-full object-contain' src={"/site_logo.png"} alt="company logo" />
         </div>
         <hr className='my-5' />
         <div className="flex items-start justify-center flex-col min-h-[150px]">
            {contentOpen === 1 && (
               <div className="space-y-3">
                  {/* {
                     member.phone && ( */}
                        <div className="flex items-center">
                           <div className="rounded bg-indigo-100 p-[5px] mr-2">
                              <Phone size={18} className='text-indigo-700' />
                           </div>
                           <span>0467204143</span>
                        </div>
                     {/* )
                  } */}
                  {/* {
                     member.email_address && ( */}
                        <div className="flex items-center">
                           <div className="rounded bg-indigo-100 p-1 mr-2">
                              <Mail size={18} className='text-indigo-700' />
                           </div>
                           <span>sem.elmlm@gmail.com</span>
                        </div>
                     {/* )
                  } */}
                  {/* {
                     member.address1 && ( */}
                        <div className="flex items-center">
                           <div className="rounded bg-indigo-100 p-1 mr-2">
                              <MapPin size={18} className='text-indigo-700' />
                           </div>
                           <span>HELSINKI</span>
                        </div>
                     {/* )
                  } */}
               </div>
            )}
            {contentOpen === 2 && (
               <div className='space-y-1'>
                  <div>
                     <strong className="text-gray-700">Esittely:</strong>
                     <p className="text-gray-600 text-sm leading-tight">
                        {/* {highlightText(member.notice)} */}
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur hic cum rerum alias ad in similique fugit nostrum est. Nesciunt molestias suscipit iusto totam earum blanditiis, nulla tenetur veniam placeat.
                     </p>
                  </div>
                  <div>
                     <strong className="text-gray-700">Tarjoamme:</strong>
                     <p className="text-gray-600 text-sm leading-tight">
                        {/* {highlightText(member.offering)} */}
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa soluta consequuntur laboriosam consequatur modi voluptatibus molestias expedita mollitia magnam vitae numquam dolores dignissimos officiis ut temporibus, hic fugiat aliquam praesentium.
                     </p>
                  </div>
                  <div>
                     <strong className="text-gray-700">Etsimme:</strong>
                     <p className="text-gray-600 text-sm leading-tight">
                        {/* {highlightText(member.searching)} */}
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officiis suscipit rem vel vitae molestias quidem dolor dolore esse mollitia asperiores. Nihil enim quidem facere quod eos. Dolorem, numquam officia. Reiciendis?
                     </p>
                  </div>
               </div>
            )}

            {contentOpen === 3 && (
               // <MemberCardWeekSearch profileId={member.profileId} />
               <MemberCardWeekSearch  />
            )}


         </div>
         <hr className='my-5' />
         <div className='flex items-center justify-between'>
            <button onClick={() => setContentOpen(1)} className={'bg-indigo-100 px-4 py-2 rounded hover:bg-indigo-200 text-indigo-700 transition-all duration-150 ' + `${contentOpen === 1 && "!text-gray-200 bg-indigo-500 hover:text-gray-200 hover:bg-indigo-500"}`}><ContactRound /></button>
            <button onClick={() => setContentOpen(2)} className={'bg-indigo-100 px-4 py-2 rounded hover:bg-indigo-200 text-indigo-700 transition-all duration-150 ' + `${contentOpen === 2 && "!text-gray-200 bg-indigo-500 hover:text-gray-200 hover:bg-indigo-500"}`}><Info /></button>
            <button onClick={() => setContentOpen(3)} className={'bg-indigo-100 px-4 py-2 rounded hover:bg-indigo-200 text-indigo-700 transition-all duration-150 ' + `${contentOpen === 3 && "!text-gray-200 bg-indigo-500 hover:text-gray-200 hover:bg-indigo-500"}`}><Search /></button>
         </div>

         {/* {chooseGroupModalOpen && <ChooseGroupModal setChooseGroupModalOpen={setChooseGroupModalOpen} />} */}
      </div>
   );
};

export default MemberCard;


