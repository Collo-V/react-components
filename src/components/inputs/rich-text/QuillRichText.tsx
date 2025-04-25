'use client'
import React, {useEffect, useState} from 'react';
const ReactQuill = dynamic(() => import('./ReactQuill'), { ssr: false })
import dynamic from "next/dynamic";
import {extractTextFromHTML} from "collov-js-methods";
import '@/styles/quill.css'
const toolbar = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'align': [] }],

];
export type QuillTextProps = {
    value:string|null,
    handleChange:(value:string|null)=>void,
    error?:boolean,
    maximumWords?:number,
    placeholder?:string
}

function QuillRichText(props:QuillTextProps) {
    const {
        value,handleChange,error,maximumWords,
        placeholder,
    } = props
    const [showQuill,setShowQuill] = useState(false)
    const [totalWords, setTotalWords] = useState<number>(0)
    const [disableEditor, setDisableEditor] = useState<boolean>(false)
    const maxWords:number = maximumWords??2000
    useEffect(() => {
        setShowQuill(true)
    }, []);

    useEffect(() => {
        const text = extractTextFromHTML(value??'')
        setTotalWords(text.length)
    }, [value]);
    useEffect(() => {
        if(totalWords > maxWords){
            // editorRef.current.editor.container.classList.add('border-2px border-red-500')
        }
        setDisableEditor(totalWords > maxWords)
    }, [value]);
    const getContClass = ()=>{
        let c ='dark:crc-text-white'
        if(disableEditor || error)c+=" border-red-500 border-2px"
        return c
    }
    return (
        <React.Fragment>
            {
                showQuill &&
                <ReactQuill
                    placeholder={placeholder||'Start typing'}
                    className={getContClass()}
                    theme="snow"
                    value={value}
                    modules={{
                        toolbar
                    }}
                    onChange={handleChange} />
            }
            <div className="crc-flex crc-justify-end">
                {
                    disableEditor &&
                    <input type="text" className="crc-hidden input-valid"/>
                }
                {
                    disableEditor ?
                        <span className={'crc-text-red-500'}>{totalWords}/{maxWords}</span>
                        :
                        <span>{totalWords}/{maxWords}</span>
                }
            </div>
        </React.Fragment>
    );
}

export default QuillRichText;