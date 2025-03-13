'use client'
import React, {ReactElement, RefObject, useEffect} from 'react';
import {isPlainObject} from "collov-js-methods";

type Props = {
    children: ReactElement;
    onCLick:()=>void,
    exclude?:(string|HTMLElement)[]
}
function ClickOutsideListener({children,onCLick,exclude}:Props) {
    if(!children) throw new Error('Children is required');
    if( typeof children === "object" && !isPlainObject(children)){
        throw new Error('React component ClickOutsideListener expects only one child');
    }
    //@ts-expect-error Ignore
    if(!children.ref){
        throw new Error('The Child element must have a ref');
    }
    //@ts-expect-error Ignore
    const ref:RefObject<HTMLElement> = children.ref
    function useOutsideAlerter(ref:React.RefObject<HTMLElement>) {
        useEffect(() => {
            function handleClickOutside(event:MouseEvent) {
                const cont = ref.current
                if(!cont || !onCLick || !cont.contains)return
                let target = event.target as HTMLElement;
                let isOutside = true
                if(cont.contains(target)){isOutside = false}
                if(isOutside){
                    while(target.tagName !== 'BODY') {
                        if(target === cont){
                            isOutside = false;
                            break
                        }
                        if(exclude){
                            for(let i = 0; i < exclude.length; i++) {
                                let excludeElement = exclude[i];
                                if(typeof excludeElement === "string") {
                                    excludeElement = document.getElementById(excludeElement) as HTMLElement
                                }
                                if(excludeElement === target){
                                    isOutside = false;
                                    break
                                }
                            }
                        }
                        target = target.parentNode as HTMLElement
                    }
                }
                if(isOutside){
                    onCLick()
                }
            }
            // Bind the event listener
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }
    useOutsideAlerter(ref)
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}

export default ClickOutsideListener;