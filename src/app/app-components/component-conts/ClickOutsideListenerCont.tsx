'use client'
import React, {useRef, useState} from 'react';
import ClickOutsideListener from "@/components/modals/ClickOutsideListener";

function ClickOutsideListenerCont() {
    const [count, setCount] = useState<number>(0)
    const ref = useRef<HTMLDivElement>(null)
    return (
        <div>
            <button
                className="crc-h-10 crc-px-2 crc-border-1px crc-rounded-md"
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
                    className='crc-h-300px crc-w-300px crc-bg-white  crc-rounded-md crc-mt-4 crc-flex crc-flex-col crc-justify-center crc-items-center'
                    ref={ref}
                >
                    <p>
                        Detect when you click outside this element
                    </p>
                    <p className={'crc-mt-4'}>
                        {count} clicks
                    </p>
                </div>
            </ClickOutsideListener>

        </div>
    );
}

export default ClickOutsideListenerCont;