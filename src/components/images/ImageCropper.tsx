import React, {useRef, useEffect, useCallback, useState} from "react"
import Cropper from "cropperjs"
import 'cropperjs/dist/cropper.css'
import { base64StringtoFile } from "collov-js-methods"
import Image from "next/image";
import {ImageInputResponseObject} from "@/types";
import ClickOutsideListener from "../modals/ClickOutsideListener";
import {getImageSize} from "collov-js-methods";
import {FaCheck} from "react-icons/fa";
type Props = {
    src:string,
    onCancel:()=>void,
    onCropped:(image:ImageInputResponseObject)=>void,
    filename?:string,
    aspectRatio?:number,
    maxWidth?:number
    minWidth?:number
}
function ImageCropper(props:Props) {
    const {
        src,onCancel,onCropped,filename,aspectRatio,
        maxWidth,minWidth
    } = props
    const cropImagesContRef = useRef<HTMLDivElement>(null)
    const cropImageRef = useRef<HTMLImageElement>(null)
    const cropperRef = useRef<Cropper>(null)
    const [imageWidth, setImageWidth] = useState<number>(maxWidth||300)
    
    const getCrop = ()=>{
        const cropper = cropperRef.current
        if(!cropper) return null
        let width = maxWidth||minWidth||300
        if(width <300)width = 300
        const canvas = cropper.getCroppedCanvas({
            height:width*(aspectRatio||1),
            width
        })
        const croppedPrev = canvas.toDataURL()
        const cropped = base64StringtoFile(croppedPrev,filename??'image.png')!
        onCropped({file:cropped,preview:croppedPrev})

    }
    useEffect(()=>{
        const initializeCrop = async ()=>{
            if(!cropImageRef.current)return
            if(!maxWidth){
                const [width] = await getImageSize(src)
                setImageWidth(width)
            }
            new Cropper(cropImageRef.current,{
                preview:'#image-preview',
                aspectRatio:aspectRatio||1,
                ready(){
                    //@ts-expect-error Ignore this
                    cropperRef.current = this.cropper
                }
            })
        }
        if(!src && cropperRef.current){
            cropperRef.current.destroy()
        }else{
            initializeCrop()
        }

        //eslint-disable-next-line
    },[src])
    //eslint-disable-next-line
    const handleHide = useCallback(onCancel,[])
    if(!src)return ''
    return (
        <div 
            className={ ' crc-fixed crc-w-full crc-z-40 crc-h-screen-h crc-flex crc-items-center' +
            ' crc-justify-center crc-right-0 crc-bottom-0 crc-bg-slate-600/75 animate__animated animate__fadeInUp'}
        >
            <ClickOutsideListener
                onCLick={handleHide}
            >
                <div
                    ref={cropImagesContRef}
                    id={'cropper-cont'}
                    className={"crc-overflow-hidden crc-w-full crc-max-w-full lg:max-w-500px " +
                        "crc-h-full lg:crc-h-fit crc-bg-white dark:crc-slate-800 crc-p-8 crc-relative " +
                        "crc-rounded-md crc-flex crc-flex-col crc-gap-4 crc-justify-between crc-items-center"
                    }
                >
                    <div className={'crc-w-full'}>
                        <h3 className={'crc-mb-4 crc-w-full'}>
                            Crop {filename || 'Image'}
                        </h3>
                        <div className="crc-flex crc-justify-between crc-shrink-0">
                            <button
                                className="crc-w-8 crc-h-8 crc-border-1px crc-rounded-md"
                                onClick={onCancel}
                            >
                                X
                            </button>

                            <button
                                className="crc-w-8 crc-h-8 crc-border-1px crc-rounded-md crc-flex crc-items-center crc-justify-center"
                                onClick={getCrop}
                            >
                                <FaCheck/>
                            </button>
                        </div>
                    </div>
                    <div className={'crc-h-full'}>
                        <div
                            className="crc-w-full overflow-hidden"
                            style={{
                                maxWidth: '100%',
                                aspectRatio: aspectRatio || 1,
                            }}
                        >
                            <Image
                                width={imageWidth}
                                height={imageWidth / (aspectRatio || 1)}
                                src={src} alt=""
                                className="crc-h-full crc-w-full"
                                ref={cropImageRef}
                            />

                        </div>
                    </div>
                    <div className="crc-mt-4 crc-hidden lg:crc-flex crc-justify-end crc-w-full crc-shrink-0">
                        <button
                            className="crc-w-120px crc-h-10 bg-primary crc-text-white crc-rounded-md"
                            onClick={getCrop}
                        >
                            Done
                        </button>
                    </div>

                </div>
            </ClickOutsideListener>

        </div>
    )
}

export default ImageCropper