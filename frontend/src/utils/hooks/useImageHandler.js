import { useState } from 'react';

export function useImageHandler(e) {
    const [file, setFile] = useState();
    const [image, setImage] = useState('');

    let files = Array.from(e.target.files);
    setFile(files[0]);
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
        setImage(reader.result?.toString() ?? '');
    };

    return([setFile, image]);
}