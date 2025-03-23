'use client'
import React, {useState} from 'react';
import ImageInput from "@/components/images/input/ImageInput";

function ImageInputCont() {
    const [showInput, setShowInput] = useState<boolean>(false)
    return (
        <div>
            <button
                className="h-10 px-2 border-1px rounded-md"
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