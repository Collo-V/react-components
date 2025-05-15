'use client'
import React, {useCallback, useEffect, useState} from 'react';
import {fileToBase64, selectFiles} from "collov-js-methods";
import ImageCropper from "@/components/images/ImageCropper";
import Image from "next/image";
import ImageInputResponseObjectComponent from "@/app/app-components/shared/ImageInputResponseObjectComponent";

function ImageCropperCont() {
    const acceptedImageFormats  = ['image/png','image/jpeg','image/jpg',"image/jfif","image/tif"]
    const [src, setSrc] = useState<string|null>(null)
    const [croppedSrc, setCroppedSrc] = useState<string|null>(null)
    const [showCrop, setShowCrop] = useState<boolean>(false)
    const selectImage = useCallback(async () => {
        setSrc(null)
        const images = await selectFiles(acceptedImageFormats.map(a=>a.replace('image/','.'))) as File[]|undefined
        if(images){
            const base64 = await fileToBase64(images[0])
            setSrc(base64 as unknown as string)
        }
    },[])
    useEffect(() => {
        if(src){
            setShowCrop(true)
            setCroppedSrc(null)
        }
    }, [src]);

    return (
        <div>
            <div className="crc-mb-10 crc-grid crc-gap-4">
                <p className={''}>
                    import {`{ImageCropper} from  'collov-react-components'`}
                </p>
                <div>
                    <h5>Props:</h5>
                    <ul className={'crc-list-disc'}>
                        <li>
                            src:string
                        </li>
                        <li>
                            onCropped:{`(data:`}<ImageInputResponseObjectComponent/>{`)=>void`}
                        </li>
                        <li>
                            filename?:string,
                        </li>
                        <li>
                            aspectRatio?:number,
                        </li>
                        <li>
                            maxWidth?:number
                        </li>
                        <li>
                            minWidth?:number
                        </li>
                    </ul>
                </div>
            </div>
            <button
                className="crc-h-10 crc-px-2 crc-border-1px crc-rounded-md"
                onClick={selectImage}
            >
                Select Image
            </button>
            {
                src &&
                <>
                    <div className="crc-flex crc-gap-4 crc-mt-4">
                        <div className="">
                            <p className='crc-mb-4 crc-text-center'>Before crop</p>
                            <Image
                                src={src}
                                alt={''}
                                height={150}
                                width={150}
                            />
                        </div>
                        {
                            croppedSrc &&
                            <div className="">
                                <p className='crc-mb-4 crc-text-center'>Cropped</p>
                                <Image
                                    src={croppedSrc}
                                    alt={''}
                                    height={150}
                                    width={150}
                                />
                            </div>
                        }
                    </div>
                    {
                        showCrop &&
                        <ImageCropper
                            src={src}
                            onCancel={() => {
                                setShowCrop(false)
                            }}
                            onCropped={({preview}) => {
                                setCroppedSrc(preview)
                                setShowCrop(false)
                            }}
                        />
                    }

                </>
            }

        </div>
    );
}

export default ImageCropperCont;