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
            className={' fixed w-full z-40 h-screen-h hidden lg:flex items-center' +
                ' justify-center right-0 bottom-0 bg-slate-600/75 '}
            id='modal-cont'>
            <ClickOutsideListener
                onCLick={onCancel}
                exclude={['mob-image-input-cont']}
            >
                <div
                    className="min-h-400px w-full max-w-600px bg-white dark:bg-slate-800 p-8 relative rounded-md flex flex-col justify-between"
                    ref={contRef}
                    id='main-image-input-cont'
                >
                    <button
                        className="absolute top-0 right-0 m-1 w-8 h-8 border-1px rounded-md"
                        onClick={onCancel}
                    >
                        X
                    </button>
                    <div className="max-w-full">
                        <h3>{title}</h3>
                        <ImageDropBox
                            onInput={handleInputs}
                            acceptedImageFormats={acceptedImageFormats}
                        />
                        {
                            guidelines.length > 0 &&
                            <ul className="mt-4 text-3 grid gap-2">
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
                                <div className="mt-4 text-3 text-red-500">
                                    You can only add {max} images
                                </div>
                                :
                                <div className="mt-4 text-3">
                                    You can only add {max} images
                                </div>
                        }
                        {
                            imagesHaveErrors &&
                            <div className="mt-4 text-3 text-red-500">
                                Please fix the errors before proceeding
                            </div>
                        }
                        {
                            imagesHaveWarnings &&
                            <div className="mt-4 text-3 text-orange-500">
                                Please consider checking the issues highlighted
                            </div>
                        }
                    </div>
                    <div className="flex justify-end">
                        {
                            tempFiles.length && !imagesHaveErrors  && !loading?
                                <button
                                    className="w-120px h-10 bg-primary text-white rounded-md"
                                    onClick={onDone}
                                >
                                    Done
                                </button>
                                :
                                <button
                                    className="w-120px h-10 border-1px bg-slate-100 dark:bg-slate-400 rounded-md cursor-notallowed"
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