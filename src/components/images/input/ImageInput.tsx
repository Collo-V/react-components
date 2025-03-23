import React, {useMemo, useState} from "react"
import {fileToBase64} from "collov-js-methods"
import {ImageInputComponentProps, ImageInputResponseObject, ImageValidationObject} from "@/types";
import {getImageSize} from "collov-js-methods";
import MobImageInput from "@/components/images/input/MobImageInput";
import MainImageInput from "@/components/images/input/MainImageInput";
type ImageInputProps = {
    max:number,
    addImages:(files:ImageInputResponseObject[])=>void,
    onCancel:()=>void,
    title:string,
    maxSize?:string,
    minSize?:string,
    guidelines?:string[],
    loading:boolean,
    aspectRatio?:number,
    crop?:boolean
}

function ImageInput(
    {
        max,addImages,onCancel,title,maxSize,minSize,guidelines,loading,aspectRatio,
        crop
    }:ImageInputProps
) {
    if(!guidelines)guidelines = []
    const cropInfo = 'You can crop images for perfect fit'
    if(crop && !guidelines.includes(cropInfo)){
        guidelines.push(cropInfo)
    }
    if(!max)max = 1
    const acceptedImageFormats  = ['image/png','image/jpeg','image/jpg',"image/jfif","image/tif"]
    title = title??"Add images"
    // const filesR = useSelector(selectTempImages) as ImageValidationObject[]
    // const dispatch = useDispatch<AppDispatch>()
    const [tempFiles,setTempFiles] = useState<ImageValidationObject[]>([])
    let minSizes = [32,32]
    if(minSize){
        minSizes = minSize.split('X').map(a=>parseInt(a))
    }else {
        const width = minSizes[0]
        minSizes = [width,width/(aspectRatio||1)]
    }

    const sendImages = ()=>{
        addImages(tempFiles)
    }
    const removeImage = (index:number)=>{
        setTempFiles(files=>files.filter((_,i)=>i!==index))
    }
    const validateImage =  async (file:File)=>{
        if (!acceptedImageFormats.includes(file.type)) return
        const preview = await fileToBase64(file)
        const imageObject: ImageValidationObject = {
            file, preview: preview!
        }
        if (file.size > Math.pow(2, 20)) {
            imageObject.error = 'Image is too big'
        }
        if (minSize || maxSize || aspectRatio) {
            const [width, height] = await getImageSize(preview!)
            if (minSize) {
                const [minWidth, minHeight] = minSizes
                if (minWidth && width < minHeight || minHeight && height < minHeight) {
                    imageObject.error = 'Image is too small'
                }
            }
            if (aspectRatio) {
                if (width / height !== aspectRatio) {
                    imageObject.warning = 'Image does not match the required aspect ratio.\n Consider cropping'
                }
            }
        }
        return imageObject
    }
    const handleInputs = async (files:File[])=>{
        const temp:ImageValidationObject[] = []
        for (let i = 0; i < files.length; i++) {
            const file = await validateImage(files[i])
            if(file){
                temp.push(file)
            }
        }
        setTempFiles(files=>files.concat(temp))
    }
    const replaceImage = async (index:number,replacement:File|ImageValidationObject)=>{
        //@ts-expect-error Ignore
        replacement = replacement?.file
        const file = await validateImage(replacement as File)
        if(file){
            const temp = [...tempFiles]
            temp[index] = file
            setTempFiles(temp)
        }
    }
    const imagesHaveErrors  = useMemo(()=> {
        let hasError = false
        if(tempFiles.length >0){
            if(max && tempFiles.length > max)hasError = true
            if(tempFiles.filter((image:ImageValidationObject)=>image.error).length)hasError = true
        }
        return hasError
    },[tempFiles,max])
    const imagesHaveWarnings  = useMemo(()=> {
        let hasWarning = false
        if(tempFiles.length >0){
            if(max && tempFiles.length > max)hasWarning = true
            if(tempFiles.filter((image:ImageValidationObject)=>image.warning).length)hasWarning = true
        }
        return hasWarning
    },[tempFiles,max])
    const args:ImageInputComponentProps = {
        imagesHaveErrors,imagesHaveWarnings,replaceImage,
        handleInputs,removeImage,onDone:sendImages,loading,onCancel,
        title,acceptedImageFormats,guidelines,tempFiles,aspectRatio:aspectRatio||1,max,minSizes
    }

    return (
        <div
            className={' fixed w-full z-40 h-screen-h flex items-center' +
                ' justify-center right-0 bottom-0 bg-slate-600/75 '}
            id='modal-cont'>
            <MobImageInput {...args}/>
            <MainImageInput {...args}/>
        </div>
    )
    
}

export default ImageInput