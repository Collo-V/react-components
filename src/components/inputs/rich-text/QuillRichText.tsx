'use client'
import React, {useEffect, useState} from 'react';
import {AnyObject, extractTextFromHTML} from "collov-js-methods";
import '@/styles/quill.css'
import ComponentReactQuill from "@/components/inputs/rich-text/ComponentReactQuill";
import {InputStatus} from "@/types";
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
    status?:InputStatus,
    maximumWords?:number,
    placeholder?:string,
    showWordCount?:boolean,
}

function QuillRichText(props:QuillTextProps) {
    const {
        value,handleChange,status,maximumWords,
        placeholder,showWordCount
    } = props
    const countWords = showWordCount !== false
    const [showQuill,setShowQuill] = useState(false)
    const [totalWords, setTotalWords] = useState<number>(0)
    const [disableEditor, setDisableEditor] = useState<boolean>(false)
    useEffect(() => {
        setShowQuill(true)
    }, []);

    useEffect(() => {
        const text = extractTextFromHTML(value??'')
        setTotalWords(text.length)
    }, [value]);
    useEffect(() => {
        if(!maximumWords)return
        if(totalWords > maximumWords){
            // editorRef.current.editor.container.classList.add('border-2px border-red-500')
        }
        setDisableEditor(totalWords > maximumWords)
    }, [value]);
    const getContClass = ()=>{
        let c ='dark:crc-text-white'
        if(disableEditor || status === 'error')c+=" border-red-500 border-2px"
        return c
    }
    return (
        <React.Fragment>
            {
                showQuill &&
                <ComponentReactQuill
                    placeholder={placeholder||'Start typing'}
                    className={getContClass()}
                    style={{
                        border:disableEditor?'solid 1px #F87171':"",
                    }}
                    theme="snow"
                    value={value}
                    modules={{
                        toolbar
                    }}
                    onChange={handleChange}
                />
            }
            {
                countWords &&
                <div className="crc-flex crc-justify-end">
                    <span className={`${disableEditor&&'crc-text-red-500'}`}>{totalWords}{maximumWords &&`/${maximumWords}`}</span>
                </div>
            }
        </React.Fragment>
    );
}

export default QuillRichText;