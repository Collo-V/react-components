'use client'
import React, {useRef, useState} from 'react';
import ClickOutsideListener from "@/components/modals/ClickOutsideListener";

function ClickOutsideListenerCont() {
    const [count, setCount] = useState<number>(0)
    const ref = useRef<HTMLDivElement>(null)
    return (
        <div>
            <button
                className="h-10 px-2 border-1px rounded-md"
                onClick={() => setCount(0)}
            >
                Reset
            </button>
            <ClickOutsideListener
                onCLick={()=> {
                    setCount(count=>count+1)
                    console.log()
                }}
                // contRef={ref as RefObject<HTMLDivElement>}
            >
                <div
                    className='h-300px w-300px bg-white  rounded-md mt-4 flex flex-col justify-center items-center'
                    ref={ref}
                >
                    <p>
                        Detect when you click outside this element
                    </p>
                    <p className={'mt-4'}>
                        {count} clicks
                    </p>
                </div>
            </ClickOutsideListener>

        </div>
    );
}

export default ClickOutsideListenerCont;