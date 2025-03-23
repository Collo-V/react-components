import React, {JSX} from 'react';
import {PageProps} from "@/types";
import {capitalizeString} from "collov-js-methods";
import ClickOutsideListenerCont from "@/app/app-components/component-conts/ClickOutsideListenerCont";
import SideNav from "@/app/app-components/SideNav";
import ImageCropperCont from "@/app/app-components/component-conts/ImageCropperCont";
import ImageInputCont from "@/app/app-components/component-conts/ImageInputCont";

export const generateMetadata = async({params}:PageProps)=>{
    const component = (await params).component;
    return {
        title:capitalizeString((component||'') as string)
    }
}
type ComponentsMap = {
    [key:string]:()=>JSX.Element
}
async function Page({params}:PageProps) {
    const currComponent = (await params).component;
    const name = currComponent as string
    const componentsMap:ComponentsMap = {
        ClickOutSideListener: ClickOutsideListenerCont,
        ImageCropper: ImageCropperCont,
        ImageInput: ImageInputCont,
    }
    const Component = componentsMap[name as keyof ComponentsMap]||(()=>'');

    return (
        <div className="h-screen-h flex gap-8">
            <SideNav/>
            <div className="w-full h-full p-8">
                <Component/>
            </div>
        </div>
    );
}

export default Page;