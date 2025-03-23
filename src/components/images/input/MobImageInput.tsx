import React, {useRef, useState} from "react"
import {ImageInputComponentProps} from "@/types";
import { ClickOutsideListener } from "collov-react-components";
import ImageCropper from "../ImageCropper";
import {selectFiles} from "collov-js-methods";
import MobImageInputPreviews from "@/components/images/input/MobImageInputPreviews";
import {FaCrop} from "react-icons/fa6";
function MobImageInput(
    {
        onDone,onCancel,title,handleInputs,acceptedImageFormats,
        guidelines,loading,imagesHaveErrors,imagesHaveWarnings,tempFiles,
        removeImage,replaceImage,max,aspectRatio,minSizes

    }:ImageInputComponentProps
) {
    const addImagesContRef = useRef<HTMLDivElement>(null)
    const [showCropper, setShowCropper] = useState<boolean>(false)
    const [cropIndex, setCropIndex] = useState<number>(0)

    const selectImages = async ()=>{
        const files = await selectFiles(acceptedImageFormats.map(a=>a.replace('image/',''))) as File[]
        handleInputs(files)
    }

    return (
        <div
            className={'fixed w-full top-0 left-0 z-40 flex lg:hidden items-center' +
                ' justify-center right-0 bottom-0 bg-slate-600/75 '}
            id='modal-cont'>
            <ClickOutsideListener
                onCLick={onCancel}
                exclude={['main-image-input-cont']}
            >
                <div
                    className="h-full w-full max-w-600px bg-white dark:bg-slate-800 p-4 relative flex flex-col justify-between gap-4"
                    ref={addImagesContRef}
                    id='mob-image-input-cont'
                >
                    <div className="flex justify-between shrink-0">
                        {
                            tempFiles.length > 0 ?
                                <div className="flex gap-4">
                                    <button
                                        className="px-2 h-8 border-1px rounded-md"
                                        onClick={selectImages}
                                    >
                                        Add Image
                                    </button>
                                </div>
                                :
                                <span></span>
                        }
                        <div className="flex gap-4">
                            {
                                tempFiles.length > 0 &&
                                <button
                                    className="w-8 h-8 border-1px rounded-md flex items-center justify-center"
                                    onClick={() => {
                                        setShowCropper(true)
                                    }}
                                >
                                    <FaCrop/>
                                </button>
                            }
                            <button
                                className="w-8 h-8 border-1px rounded-md"
                                onClick={onCancel}
                            >
                                X
                            </button>
                        </div>
                    </div>
                    <div className="max-w-full h-full ">
                        <h3>{title}</h3>

                        {
                            tempFiles.length === 0 ?
                                <>
                                    <div
                                        onClick={selectImages}
                                        className="mt-4 h-150px border-dotted border-2px rounded-md flex items-center justify-center">
                                        Click to select images
                                    </div>

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
                                </>
                                :
                                <MobImageInputPreviews
                                    tempFiles={tempFiles}
                                    removeImage={removeImage}
                                    crop
                                    cropIndex={cropIndex}
                                    setCropIndex={setCropIndex}
                                    aspectRatio={aspectRatio}
                                />
                        }


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
                    <div className="flex justify-end shrink-0">
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

export default MobImageInput