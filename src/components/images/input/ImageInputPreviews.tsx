import React from 'react';
import {Popover} from "antd";
import {FaExclamationCircle, FaExclamationTriangle, FaTrashAlt} from "react-icons/fa";
import ImageComponent from "next/image";
import {ImageValidationObject} from "@/types";
import {FaCrop} from "react-icons/fa6";

type Props = {
    tempFiles:ImageValidationObject[]
    crop?:boolean,
    cropImage:(index:number)=>void,
    removeImage:(index:number)=>void,
    aspectRatio?:number
}
function ImageInputPreviews({tempFiles,crop,cropImage,removeImage,aspectRatio}:Props) {
    if(crop && !cropImage){
        throw  new Error(`'cropImage' function is required`)
    }
    return (
        <>
            {
                tempFiles.length > 0 &&
                <div className="flex gap-4 mt-2">
                    {
                        tempFiles.map((image, index: number) => (
                            <React.Fragment key={index}>
                                <Popover
                                    content={
                                        (image.error || image.warning)?
                                            <div className={'grid gap-4 max-w-300px'}>
                                                {
                                                    image.error &&
                                                    <div className='flex gap-2 items-center'>
                                                        <FaExclamationTriangle
                                                            className='fill-red-500 shrink-0'/>
                                                        {image.error}
                                                    </div>
                                                }
                                                {
                                                    image.warning &&
                                                    <div className='flex gap-2 items-center'>
                                                        <FaExclamationCircle
                                                            className='fill-orange-500 shrink-0'/>
                                                        {image.warning}
                                                    </div>
                                                }

                                            </div> : null
                                    }
                                >
                                    <div
                                        className={'w-120px  border-1px rounded-md flex p-1' +
                                            ' items-center justify-center relative dropdown-cont ' +
                                            `${image.error ? 'border-red-400' : image.warning ? 'border-orange-500' : ""}`
                                        }
                                        style={{
                                            aspectRatio:aspectRatio||1
                                        }}
                                    >
                                        <ImageComponent
                                            height={100}
                                            width={100}
                                            src={image.preview}
                                            alt=""
                                            className='max-h-90% w-auto'
                                        />
                                        {
                                            (image.error || image.warning) &&
                                            <div className='absolute top-0 left-0 z-2 m-1'>
                                                {
                                                    image.error?
                                                        <FaExclamationTriangle className='fill-red-500'/>
                                                        :
                                                        <FaExclamationCircle className='fill-orange-500'/>
                                                }
                                            </div>
                                        }
                                        <div
                                            className="dropdown absolute top-0 left-0 h-full w-full bg-gray-300/50 flex flex-col items-end gap-2 rounded-md overflow-hidden">
                                            <button
                                                className="w-8 h-8 float-right flex items-center justify-center bg-red-200 text-red-400"
                                                onClick={() => removeImage(index)}
                                            >
                                                <FaTrashAlt/>
                                            </button>
                                            {
                                                crop &&
                                                <button
                                                    className="w-8 h-8 float-right flex items-center justify-center bg-white"
                                                    onClick={() => cropImage(index)}
                                                >
                                                    <FaCrop/>
                                                </button>
                                            }

                                        </div>
                                    </div>
                                </Popover>
                            </React.Fragment>
                        ))
                    }

                </div>
            }
        </>
    );
}

export default ImageInputPreviews;