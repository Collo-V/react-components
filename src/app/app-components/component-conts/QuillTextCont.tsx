'use client'
import React, {useState} from 'react';
import { QuillText } from '@/components/inputs/csr';

function QuillTextCont() {
    const [text, setText] = useState<string>('Some thing')
    return (
        <div>
            <p>What you see is what you get text editor</p>
           <QuillText
               placeholder={'What do you want?'}
                value={text}
                handleChange={function (value: string | null): void {
                    console.log('change', value)
                    setText(value||'')
                } }          
            />
            <button
                onClick={() => {
                    console.log('clicked', text);
                    setText('Hello World!')
                }}
            >
                Change
            </button>
            

        </div>
    );
}

export default QuillTextCont;