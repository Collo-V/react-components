'use client'
import React, {useState} from 'react';
import ImageInput from "@/components/images/input/ImageInput";

function ImageInputCont() {
    const [showInput, setShowInput] = useState<boolean>(false)
    return (
        <div>
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