'use client'
import React, {useState} from 'react';
import { QuillText } from '@/components/inputs';
import InputStatusTypeComponent from "@/app/app-components/shared/InputStatusTypeComponent";

function QuillTextCont() {
    const [text, setText] = useState<string>('Some thing')
    return (
        <div>
            <div className="crc-mb-10 crc-grid crc-gap-4">
                <p className={''}>
                    import {`{QuillText} from  'collov-react-components'`}
                </p>
                <div>
                    <h5>Props:</h5>
                    <ul className={'crc-list-disc'}>
                        <li>
                            value:string|null,

                        </li>
                        <li>
                            handleChange:{`(value: string | null) => void`},

                        </li>
                        <li>
                            status?:<InputStatusTypeComponent/>,

                        </li>
                        <li>
                            maximumWords?:number,

                        </li>
                        <li>
                            placeholder?:string,

                        </li>
                        <li>
                            showWordCount?:boolean,
                        </li>
                    </ul>
                </div>
            </div>
            <p>What you see is what you get text editor</p>
           <QuillText
               placeholder={'What do you want?'}
                value={text}
                handleChange={function (value: string | null): void {
                    setText(value||'')
                } }          
            />


        </div>
    );
}

export default QuillTextCont;