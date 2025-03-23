'use client'
import React, {useCallback, useEffect, useState} from 'react';
import {fileToBase64, selectFiles} from "collov-js-methods";
import ImageCropper from "@/components/images/ImageCropper";
import Image from "next/image";

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
            <button
                className="h-10 px-2 border-1px rounded-md"
                onClick={selectImage}
            >
                Select Image
            </button>
            {
                src &&
                <>
                    <div className="flex gap-4 mt-4">
                        <div className="">
                            <p className='mb-4 text-center'>Before crop</p>
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
                                <p className='mb-4 text-center'>Cropped</p>
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
                            setCropped={({preview}) => {
                                console.log('Cropping......')
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