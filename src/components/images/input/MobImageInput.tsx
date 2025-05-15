import React, {useRef, useState} from "react"
import {ImageInputComponentProps} from "@/types";
import ClickOutsideListener from "@/components/modals/ClickOutsideListener";
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
            className={'crc-fixed crc-w-full crc-top-0 crc-left-0 crc-z-40 crc-flex lg:crc-hidden crc-items-center' +
                ' crc-justify-center crc-right-0 crc-bottom-0 crc-bg-slate-600/75 '}
            id='modal-cont'>
            <ClickOutsideListener
                onCLick={onCancel}
                exclude={['main-image-input-cont']}
            >
                <div
                    className="crc-h-full crc-w-full crc-max-w-600px crc-bg-white dark:crc-slate-800 p-4 crc-relative crc-flex crc-flex-col crc-justify-between crc-gap-4"
                    ref={addImagesContRef}
                    id='mob-image-input-cont'
                >
                    <div className="crc-flex crc-justify-between crc-shrink-0">
                        {
                            tempFiles.length > 0 ?
                                <div className="crc-flex crc-gap-4">
                                    <button
                                        className="crc-px-2 crc-h-8 crc-border-1px crc-rounded-md"
                                        onClick={selectImages}
                                    >
                                        Add Image
                                    </button>
                                </div>
                                :
                                <span></span>
                        }
                        <div className="crc-flex crc-gap-4">
                            {
                                tempFiles.length > 0 &&
                                <button
                                    className="crc-w-8 crc-h-8 crc-border-1px crc-rounded-md crc-flex crc-items-center crc-justify-center"
                                    onClick={() => {
                                        setShowCropper(true)
                                    }}
                                >
                                    <FaCrop/>
                                </button>
                            }
                            <button
                                className="crc-w-8 crc-h-8 crc-border-1px crc-rounded-md"
                                onClick={onCancel}
                            >
                                X
                            </button>
                        </div>
                    </div>
                    <div className="crc-max-w-full crc-h-full ">
                        <h3>{title}</h3>

                        {
                            tempFiles.length === 0 ?
                                <>
                                    <div
                                        onClick={selectImages}
                                        className="crc-mt-4 h-150px crc-border-dotted border-2px crc-rounded-md crc-flex crc-items-center crc-justify-center">
                                        Click to select images
                                    </div>

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
                    <div className="crc-flex crc-justify-end crc-shrink-0">
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
                            onCropped={(image)=>{
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