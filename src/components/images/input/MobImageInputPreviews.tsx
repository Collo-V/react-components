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
                <div className={'max-w-full h-full flex flex-col justify-between'}>
                    <Carousel setApi={setApi} >
                        <CarouselContent>
                            {
                                tempFiles.map((image, index: number) => (
                                    <CarouselItem key={index}>
                                        <div className={'w-full'}>
                                            <div
                                                className={'border-1px rounded-md flex p-1' +
                                                    ' items-center justify-center relative dropdown-cont ' +
                                                    `${image.error ? 'border-red-400' : image.warning ? 'border-orange-500' : ""}`
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
                                                    className='max-h-90% w-auto'
                                                />
                                                {
                                                    (image.error || image.warning) &&
                                                    <div className='absolute top-0 left-0 z-2 m-1'>
                                                        {
                                                            image.error ?
                                                                <FaExclamationTriangle className='fill-red-500'/>
                                                                :
                                                                <FaExclamationCircle className='fill-orange-500'/>
                                                        }
                                                    </div>
                                                }

                                            </div>
                                            {
                                                (image.error || image.warning) &&
                                                <div className={'grid gap-4  mt-4'}>
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

                                                </div>
                                            }
                                        </div>
                                    </CarouselItem>
                                ))
                            }
                        </CarouselContent>

                    </Carousel>
                    <div className={'shrink-0'}>
                        {
                            tempFiles.length > 0 &&
                            <div className="flex gap-4 mt-2">
                                {
                                    tempFiles.map((image, index: number) => (
                                        <React.Fragment key={index}>
                                            <div
                                                onClick={()=>goToSlide(index)}
                                                className={'w-16  border-1px rounded-md flex p-1' +
                                                    ' items-center justify-center relative overflow-hidden ' +
                                                    `${image.error ? 'border-red-400' : image.warning ? 'border-orange-500' : ""}`
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
                                                    className='max-h-90% w-auto'
                                                />

                                                {
                                                    cropIndex === index &&
                                                    <button
                                                        className="bg-slate-800/50 cover-div flex items-center justify-center text-red-400"
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