import {ReactNode} from 'react';
import '@/styles/tailwind.css'

function Wrapper({children}: {children: ReactNode}) {
    return children;
}

export default Wrapper;