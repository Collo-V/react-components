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
                <div className="crc-flex crc-gap-4 crc-mt-2">
                    {
                        tempFiles.map((image, index: number) => (
                            <React.Fragment key={index}>
                                <Popover
                                    content={
                                        (image.error || image.warning)?
                                            <div className={'crc-grid crc-gap-4 crc-max-w-300px'}>
                                                {
                                                    image.error &&
                                                    <div className='crc-flex crc-gap-2 crc-items-center'>
                                                        <FaExclamationTriangle
                                                            className='crc-fill-red-500 crc-shrink-0'/>
                                                        {image.error}
                                                    </div>
                                                }
                                                {
                                                    image.warning &&
                                                    <div className='crc-flex crc-gap-2 crc-items-center'>
                                                        <FaExclamationCircle
                                                            className='crc-fill-orange-500 crc-shrink-0'/>
                                                        {image.warning}
                                                    </div>
                                                }

                                            </div> : null
                                    }
                                >
                                    <div
                                        className={'crc-w-120px  crc-border-1px crc-rounded-md crc-flex crc-p-1' +
                                            ' crc-items-center crc-justify-center crc-relative dropdown-cont ' +
                                            `${image.error ? 'crc-border-red-400' : image.warning ? 'crc-border-orange-500' : ""}`
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
                                            className='crc-max-h-90% crc-w-auto'
                                        />
                                        {
                                            (image.error || image.warning) &&
                                            <div className='crc-absolute crc-top-0 crc-left-0 crc-z-2 crc-m-1'>
                                                {
                                                    image.error?
                                                        <FaExclamationTriangle className='crc-fill-red-500'/>
                                                        :
                                                        <FaExclamationCircle className='crc-fill-orange-500'/>
                                                }
                                            </div>
                                        }
                                        <div
                                            className="dropdown crc-absolute crc-top-0 crc-left-0 crc-h-full crc-w-full crc-bg-gray-300/50 crc-flex crc-flex-col crc-items-end crc-gap-2 crc-rounded-md crc-overflow-hidden">
                                            <button
                                                className="crc-w-8 crc-h-8 crc-float-right crc-flex crc-items-center crc-justify-center crc-bg-red-200 crc-text-red-400"
                                                onClick={() => removeImage(index)}
                                            >
                                                <FaTrashAlt/>
                                            </button>
                                            {
                                                crop &&
                                                <button
                                                    className="crc-w-8 crc-h-8 crc-float-right crc-flex crc-items-center crc-justify-center crc-bg-white"
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