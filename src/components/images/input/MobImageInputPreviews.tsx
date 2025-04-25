import React, {useEffect} from 'react';
import {FaExclamationCircle, FaExclamationTriangle, FaTrashAlt} from "react-icons/fa";
import ImageComponent from "next/image";
import {ImageValidationObject} from "@/types";
import {Carousel, CarouselApi, CarouselContent, CarouselItem} from "@/components/ui/carousel";

type Props = {
    tempFiles:ImageValidationObject[]
    crop?:boolean,
    cropIndex:number,
    setCropIndex:(index:number)=>void,
    removeImage:(index:number)=>void,
    aspectRatio?:number
}
function MobImageInputPreviews(
    {tempFiles,cropIndex,removeImage,aspectRatio,setCropIndex}:Props
) {
    const [api, setApi] = React.useState<CarouselApi>()
    useEffect(() => {
        if (!api) {
            return
        }
        const current = api.selectedScrollSnap()

        setCropIndex(current)
        // cropImage(current)

        api.on("select", () => {
            setCropIndex(api.selectedScrollSnap())
        })
    }, [api,tempFiles.length])
    const goToSlide = (index:number) => {
        if(api){
            api.scrollTo(index)
        }
    }
    return (
        <>
            {
                tempFiles.length > 0 &&
                <div className={'crc-max-w-full crc-h-full crc-flex crc-flex-col crc-justify-between'}>
                    <Carousel setApi={setApi} >
                        <CarouselContent>
                            {
                                tempFiles.map((image, index: number) => (
                                    <CarouselItem key={index}>
                                        <div className={'crc-w-full'}>
                                            <div
                                                className={'crc-border-1px crc-rounded-md crc-flex crc-p-1' +
                                                    ' crc-items-center crc-justify-center crc-relative dropdown-cont ' +
                                                    `${image.error ? 'crc-border-red-400' : image.warning ? 'crc-border-orange-500' : ""}`
                                                }
                                                style={{
                                                    aspectRatio: aspectRatio || 1
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
                                                            image.error ?
                                                                <FaExclamationTriangle className='crc-fill-red-500'/>
                                                                :
                                                                <FaExclamationCircle className='crc-fill-orange-500'/>
                                                        }
                                                    </div>
                                                }

                                            </div>
                                            {
                                                (image.error || image.warning) &&
                                                <div className={'crc-grid crc-gap-4  crc-mt-4'}>
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

                                                </div>
                                            }
                                        </div>
                                    </CarouselItem>
                                ))
                            }
                        </CarouselContent>

                    </Carousel>
                    <div className={'crc-shrink-0'}>
                        {
                            tempFiles.length > 0 &&
                            <div className="crc-flex crc-gap-4 crc-mt-2">
                                {
                                    tempFiles.map((image, index: number) => (
                                        <React.Fragment key={index}>
                                            <div
                                                onClick={()=>goToSlide(index)}
                                                className={'w-16  crc-border-1px crc-rounded-md crc-flex crc-p-1' +
                                                    ' crc-items-center crc-justify-center crc-relative crc-overflow-hidden ' +
                                                    `${image.error ? 'crc-border-red-400' : image.warning ? 'crc-border-orange-500' : ""}`
                                                }
                                                style={{
                                                    aspectRatio: aspectRatio || 1
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
                                                    cropIndex === index &&
                                                    <button
                                                        className="crc-slate-800/50 cover-div crc-flex crc-items-center crc-justify-center crc-text-red-400"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            removeImage(index)
                                                        }}
                                                    >
                                                        <FaTrashAlt/>
                                                    </button>
                                                }
                                            </div>
                                        </React.Fragment>
                                    ))
                                }

                            </div>
                        }
                    </div>
                </div>
            }
        </>
    );
}

export default MobImageInputPreviews;