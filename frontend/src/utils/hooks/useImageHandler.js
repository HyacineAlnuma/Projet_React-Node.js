import { useState } from 'react';

export function useImageHandler() {
    const [file, setFile] = useState();
    const [image, setImage] = useState('');

    function imageHandler(e) {
        let files = Array.from(e.target.files);
        setFile(files[0]);
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = () => {
        setImage(reader.result?.toString() ?? '');
    };
    }

    return({file, image, setFile, setImage, imageHandler});
}