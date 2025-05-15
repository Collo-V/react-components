'use client'
import React, {useState} from 'react';
import ImageInput from "@/components/images/input/ImageInput";
import ImageInputResponseObjectComponent from "@/app/app-components/shared/ImageInputResponseObjectComponent";

function ImageInputCont() {
    const [showInput, setShowInput] = useState<boolean>(false)
    return (
        <div>
            <div className="crc-mb-10 crc-grid crc-gap-4">
                <p className={''}>
                    import {`{ImageInput} from  'collov-react-components'`}
                </p>
                <div>
                    <h5>Props:</h5>
                    <ul className={'crc-list-disc'}>
                        <li>
                            max:number,

                        </li>
                        <li>
                            onCropped:{`({file:File,preview:string})=>void`}
                        </li>
                        <li>
                            addImages:{`(files:`}<ImageInputResponseObjectComponent/>{`[])=>void`},

                        </li>
                        <li>
                            onCancel:{`() => void`},

                        </li>
                        <li>
                            title:string,
                        </li>
                        <li>
                            title:string,

                        </li>
                        <li>
                            maxSize?:string,

                        </li>
                        <li>
                            minSize?:string,

                        </li>
                        <li>
                            guidelines?:string[],

                        </li>
                        <li>
                            loading:boolean,

                        </li>
                        <li>
                            aspectRatio?:number,

                        </li>
                        <li>
                            crop?:boolean
                        </li>
                    </ul>
                </div>
            </div>
            <button
                className="crc-h-10 crc-px-2 crc-border-1px crc-rounded-md"
                onClick={()=>setShowInput(true)}
            >
                Select Image
            </button>
            {
                showInput &&
                <ImageInput
                    max={4}
                    addImages={()=>{}}
                    onCancel={()=>setShowInput(false)}
                    title={'Add images'}
                    loading={false}
                    crop={true}
                    aspectRatio={8/5}
                    minSize={'800X500'}
                />
            }
        </div>
    );
}

export default ImageInputCont;