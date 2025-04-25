'use client'
import React, {useState} from 'react';
import { QuillText } from '@/components/inputs/index';

function QuillTextCont() {
    const [text, setText] = useState<string>('')
    return (
        <div>
            <p>What you see is what you get text editor</p>
           <QuillText 
                value={text} 
                handleChange={function (value: string | null): void {
                    setText(value||'')
                } }          
            />
            

        </div>
    );
}

export default QuillTextCont;