import React, {useRef, useEffect, useCallback, useState} from "react"
import Cropper from "cropperjs"
import 'cropperjs/dist/cropper.css'
import { base64StringtoFile } from "collov-js-methods"
import Image from "next/image";
import {ImageInputResponseObject} from "@/types";
import {ClickOutsideListener} from "collov-react-components";
import {getImageSize} from "collov-js-methods";
import {FaCheck} from "react-icons/fa";
type Props = {
    src:string,
    onCancel:()=>void,
    setCropped:(image:ImageInputResponseObject)=>void,
    filename?:string,
    aspectRatio?:number,
    maxWidth?:number
    minWidth?:number
}
function ImageCropper(props:Props) {
    const {
        src,onCancel,setCropped,filename,aspectRatio,
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
        setCropped({file:cropped,preview:croppedPrev})

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
            className={ ' fixed w-full z-40 h-screen-h flex items-center' +
            ' justify-center right-0 bottom-0 bg-slate-600/75 animate__animated animate__fadeInUp'}
        >
            <ClickOutsideListener
                onCLick={handleHide}
            >
                <div
                    ref={cropImagesContRef}
                    id={'cropper-cont'}
                    className={"overflow-hidden w-full max-w-full lg:max-w-500px " +
                        "h-full lg:h-fit bg-white dark:bg-slate-800 p-8 relative " +
                        "rounded-md flex flex-col gap-4 justify-between items-center"
                    }
                >
                    <div className={'w-full'}>
                        <h3 className={'mb-4 w-full'}>
                            Crop {filename || 'Image'}
                        </h3>
                        <div className="flex justify-between shrink-0">
                            <button
                                className="w-8 h-8 border-1px rounded-md"
                                onClick={onCancel}
                            >
                                X
                            </button>

                            <button
                                className="w-8 h-8 border-1px rounded-md flex items-center justify-center"
                                onClick={getCrop}
                            >
                                <FaCheck/>
                            </button>
                        </div>
                    </div>
                    <div className={'h-full'}>
                        <div
                            className="w-full oveflow-hidden"
                            style={{
                                maxWidth: '100%',
                                aspectRatio: aspectRatio || 1,
                            }}
                        >
                            <Image
                                width={imageWidth}
                                height={imageWidth / (aspectRatio || 1)}
                                src={src} alt=""
                                className="h-full w-full"
                                ref={cropImageRef}
                            />

                        </div>
                    </div>
                    <div className="mt-4 hidden lg:flex justify-end w-full shrink-0">
                        <button
                            className="w-120px h-10 bg-primary text-white rounded-md"
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