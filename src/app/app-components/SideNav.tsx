'use client'
import React, {useRef, useEffect,JSX} from 'react';
import Link from "next/link";
import {usePathname} from "next/navigation";
type Navs = {
    links:NavLink[],
    title?:string,
}
type NavLink = {
    name:string,
    link?:string,
    icon?:JSX.Element,
    id?:string,
    onClick?:()=>void
}
function SideNav() {
    const sideNavRef = useRef<HTMLDivElement>(null)
    const pathname = usePathname()
    const navCont = useRef<HTMLDivElement>(null)
    const navs: Navs[] = [
        {
            title:"Images",
            links: [
                {
                    name: 'ImageCropper',
                    link: '/components/ImageCropper',
                },
                {
                    name: 'ImageInput',
                    link: '/components/ImageInput',
                }
            ]
        },
        {
            title:"Inputs",
            links: [
                {
                    name: 'QuillText',
                    link: '/components/QuillText',
                }
                
            ]
        },
        {
            title:"Modals",
            links: [
                {
                    name: 'ClickOutSideListener',
                    link: '/components/ClickOutSideListener',
                }
            ]
        },
        // {
        //     title: "Property Manager",
        //     isForAgent: true,
        //     links: [
        //         {
        //             name: 'Leads',
        //             link: '/dashboard/leads',
        //         }
        //     ]
        // },


    ]

    const maxMinNav = (event: unknown, minimize: boolean) => {
        const cont = sideNavRef.current
        if (!cont) return
        if (minimize) {
            cont.classList.remove('crc-w-200px')
            cont.classList.add('crc-w-0')
        } else {
            cont.classList.add('crc-w-200px')
            cont.classList.remove('crc-w-0')
        }

    }
    useEffect(() => {
        const checkScreenSize = () => {
            if (window.screen.width <= 600) {
                maxMinNav('', true)
            }
        }
        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)
        return () => {
            window.removeEventListener('resize', checkScreenSize)
        }
    }, [])
    // useEffect(() => {
    //     const cont = navCont.current
    //     if (!cont) return
    //     if (navIsMinimized) {
    //         cont.classList.remove('w-200px')
    //         cont.classList.add('w-0', 'lg:w-12', 'minimized')
    //     } else {
    //         cont.classList.remove('w-0', 'lg:w-12', 'minimized')
    //         cont.classList.add('w-200px')
    //     }
    //     if (cont.classList.contains('w-0')) {
    //         navModal.current?.classList.add('hidden')
    //     } else {
    //         navModal.current?.classList.remove('hidden')
    //     }
    // }, [navIsMinimized])
    // const manageNavWidth = () => {
    //     dispatch(writeSettings({
    //         navIsMinimized: !navIsMinimized
    //     }))
    // }
    const isActiveLink = (link: string) => {
        let isActive = false
        if (!link) return isActive
        if (!link.endsWith('/dashboard')) {
            if (pathname.includes(link) && link !== '/dashboard') isActive = true
            return isActive
        } else if (link.endsWith('/dashboard') && link === pathname) {
            isActive = true
        } else if (link === '/dashboard' && pathname.endsWith('/dashboard')) {
            isActive = true

        }
        return isActive

    }
    return (
        <div
            className='sidenav lg:crc-relative crc-shrink-0 crc-z-20 crc-top-0 crc-bottom-0 crc-left-0 crc-bg-white dark:crc-slate-800 crc-shadow-md'
            ref={sideNavRef}
            style={{
                transition: 'width 1s'
            }}
        >



            <div
                ref={navCont}
                style={{
                    transition: 'width 1s'
                }}
                className={"nav nav-cont crc-py-4 crc-w-0" +
                    " lg:crc-w-200px crc-bg-white dark:crc-slate-800 crc-h-full crc-overflow-x-hidden " +
                    "crc-overflow-y-auto custom-scroll"}
            >
                <div className='md:crc-flex crc-justify-between p-2'>


                </div>
                {
                    navs.map((navGroup, index) => {
                        let navContClass = 'crc-py-4 crc-px-2'
                        if (index > 0) navContClass += ' crc-border-t-1px'
                        return (
                            <div className={navContClass} key={index}>
                                {
                                    navGroup.title &&
                                    <h3 className='crc-mb-4 nav-title crc-text-center crc-whitespace-nowrap crc-overflow-hidden '>{navGroup.title}</h3>
                                }
                                <div className='crc-grid crc-gap-4'>
                                    {
                                        navGroup.links.map((link) => {
                                            let navClass = "crc-relative nav-link crc-whitespace-nowrap crc-overflow-hidden crc-block text-left crc-w-full crc-max-w-full crc-flex crc-gap-2 crc-justify-center crc-px-2 crc-overflow-hidden" +
                                                " crc-items-center crc-h-8 crc-rounded-md crc-z-[10000]"
                                            navClass += " " + link.name.replaceAll(' ', '-').toLowerCase() + '-link'
                                            navClass += isActiveLink(link.link || '') ?
                                                ' bg-primary/40 text-primary nav-active' : ' hover:bg-primary/40 hover:text-primary'

                                            return link.link ? (
                                                    <Link
                                                        id={link.id}
                                                        href={link.link}
                                                        key={link.name}
                                                        className={navClass}
                                                    >
                                                        <>
                                                            {
                                                                link.icon && typeof link.icon === 'function' &&
                                                                <div className='crc-text-5 crc-stroke-2 nav-icon'>
                                                                    {/* @ts-expect-error Ignore */}
                                                                    {link.icon({className: 'crc-text-5 crc-stroke-2 nav-icon'})}
                                                                </div>
                                                            }
                                                        </>
                                                        <span className='nav-name crc-w-120px'>{link.name}</span>
                                                        <div className="cover-div crc-z-1" style={{zIndex: '1000'}}></div>
                                                    </Link>
                                                )
                                                :
                                                (
                                                    <button
                                                        onClick={()=> {
                                                            link.onClick!()
                                                        }}
                                                        key={link.name} className={navClass}>
                                                        <>
                                                            {
                                                                link.icon && typeof link.icon === 'function' &&
                                                                <div className='crc-text-5 crc-stroke-2 nav-icon'>
                                                                    {/* @ts-expect-error Ignore */}
                                                                    {link.icon({className: 'crc-text-5 crc-stroke-2 nav-icon'})}
                                                                </div>
                                                            }
                                                        </>
                                                        <span className='nav-name crc-w-120px'>{link.name}</span>
                                                    </button>
                                                )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );

}


export default SideNav;
