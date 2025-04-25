import React, {useRef, useState} from "react"
import ClickOutsideListener from "@/components/modals/ClickOutsideListener";
import ImageDropBox from "./ImageDropBox";
import ImageInputPreviews from "./ImageInputPreviews";
import ImageCropper from "../ImageCropper";
import {ImageInputComponentProps} from "@/types";

function MainImageInput(
    {
        onDone,onCancel,title,handleInputs,acceptedImageFormats,
        guidelines,loading,imagesHaveErrors,imagesHaveWarnings,tempFiles,
        removeImage,replaceImage,max,aspectRatio,minSizes

    }:ImageInputComponentProps
) {
    const contRef = useRef<HTMLDivElement>(null)
    const [showCropper, setShowCropper] = useState<boolean>(false)
    const [cropIndex, setCropIndex] = useState<number>(0)

    return (
        <div
            className={' crc-fixed crc-w-full crc-z-40 crc-h-screen-h crc-hidden lg:crc-flex crc-items-center' +
                ' crc-justify-center crc-right-0 crc-bottom-0 crc-bg-slate-600/75 '}
            id='modal-cont'>
            <ClickOutsideListener
                onCLick={onCancel}
                exclude={['mob-image-input-cont']}
            >
                <div
                    className="crc-min-h-400px crc-w-full crc-max-w-600px crc-bg-white dark:crc-slate-800 crc-p-8 crc-relative crc-rounded-md crc-flex crc-flex-col crc-justify-between"
                    ref={contRef}
                    id='main-image-input-cont'
                >
                    <button
                        className="crc-absolute crc-top-0 crc-right-0 crc-m-1 crc-w-8 crc-h-8 crc-border-1px crc-rounded-md"
                        onClick={onCancel}
                    >
                        X
                    </button>
                    <div className="crc-max-w-full">
                        <h3>{title}</h3>
                        <ImageDropBox
                            onInput={handleInputs}
                            acceptedImageFormats={acceptedImageFormats}
                        />
                        {
                            guidelines.length > 0 &&
                            <ul className="crc-mt-4 crc-text-3 crc-grid crc-gap-2">
                                {
                                    guidelines.map((guideline, index) => (
                                        <li className="" key={index}>
                                            {guideline}
                                        </li>
                                    ))
                                }
                            </ul>
                        }
                        <ImageInputPreviews
                            tempFiles={tempFiles}
                            removeImage={removeImage}
                            crop
                            cropImage={(index)=> {
                                setCropIndex(index)
                                setShowCropper(true)
                            }}
                            aspectRatio={aspectRatio}
                        />

                        {
                            tempFiles.length > max ?
                                <div className="crc-mt-4 crc-text-3 crc-text-red-500">
                                    You can only add {max} images
                                </div>
                                :
                                <div className="crc-mt-4 crc-text-3">
                                    You can only add {max} images
                                </div>
                        }
                        {
                            imagesHaveErrors &&
                            <div className="crc-mt-4 crc-text-3 crc-text-red-500">
                                Please fix the errors before proceeding
                            </div>
                        }
                        {
                            imagesHaveWarnings &&
                            <div className="crc-mt-4 crc-text-3 crc-text-orange-500">
                                Please consider checking the issues highlighted
                            </div>
                        }
                    </div>
                    <div className="crc-flex crc-justify-end">
                        {
                            tempFiles.length && !imagesHaveErrors  && !loading?
                                <button
                                    className="crc-w-120px crc-h-10 bg-primary crc-text-white crc-rounded-md"
                                    onClick={onDone}
                                >
                                    Done
                                </button>
                                :
                                <button
                                    className="crc-w-120px crc-h-10 crc-border-1px crc-bg-slate-100 crc-dark:bg-slate-400 crc-rounded-md crc-cursor-notallowed"
                                    disabled={true}
                                >
                                    Add
                                </button>
                        }
                    </div>

                    {
                        showCropper && tempFiles[cropIndex] &&
                        <ImageCropper
                            src={tempFiles[cropIndex].preview}
                            onCancel={()=>setShowCropper(false)}
                            setCropped={(image)=>{
                                replaceImage(cropIndex,image)
                                setShowCropper(false)
                            }}
                            aspectRatio={aspectRatio}
                            minWidth={minSizes[0]}
                            filename={tempFiles[cropIndex].file.name}
                        />
                    }

                </div>
            </ClickOutsideListener>
        </div>
    )

}

export default MainImageInput